from pydantic import BaseModel
import os
import time
import json
import logging
import copy
import traceback
from typing import Callable, Union
from concurrent.futures import ThreadPoolExecutor, as_completed
from filelock import FileLock
import cloudpickle

import gc

from proconfig.utils.pytree import tree_map
import proconfig.utils.pytree as pytree
from proconfig.utils.expressions import calc_expression
from proconfig.utils.misc import hash_dict
from proconfig.core import Automata, Workflow, State
from proconfig.core.common import GLOBAL_CACHE_MODE
from proconfig.core.variables import Variable
from proconfig.core.constant import return_breakpoint_cache_dir
from proconfig.core.chat import SessionState
from proconfig.runners.utils import empty_callback_fn, _max_input_len_helper, _get_config_by_index_helper

import psutil

process = psutil.Process(os.getpid())

def print_memory():
    cpu_memory_usage = process.memory_info().rss
    print("CPU usage", cpu_memory_usage / (1024 * 1024 * 1024))

class Runner(BaseModel):
    callback: Callable = empty_callback_fn
    as_list: bool = False
    parallel: bool = False
    debug_mode: bool = False
    
    def is_ref(self, v, block_names=None):
        if type(v) == str and v.startswith(r"{{") and v.endswith(r"}}"):
            v = v[2:-2]
            if r"{{" not in v and r"}}" not in v:
                splits = v.split(".", 1)
                if block_names is None or splits[0] in block_names:
                    return True
        return False
    
    def wrap_non_ref_to_list(self, v, block_names):
        return [v] if not self.is_ref(v, block_names) else v
    
    def wrap_non_list_to_list(self, v):
        print("decide v is list or not")
        import pdb; pdb.set_trace()
        return [v] if type(v) != list else v

    def run_widget_as_list(self, module, environ, module_config, task_inputs):
        extra_inputs = ["callback", "widget_run_id"]
        # here module_config store the evaluated result (with list), task_inputs is the original ones
        input_is_list = getattr(module, "INPUT_IS_LIST", False)
        if input_is_list:
            for k, v in module_config.items():
                if type(v) != list:
                    module_config[k] = [v] # TODO: using recursive
            print(module_config)
            outputs = module(environ, module_config)
            for k, v in outputs.items():
                outputs[k] = [v]
            return outputs
        
        # get the tree spec
        tree_spec = pytree.tree_structure(task_inputs)
        max_input_len = _max_input_len_helper(module_config, tree_spec, 0)
        
        outputs = {}
        
        for i in range(max_input_len):
            module_config_once = _get_config_by_index_helper(module_config, tree_spec, i)
            for extra_input_key in extra_inputs:
                module_config_once[extra_input_key] = module_config[extra_input_key][0]
            outputs_once = module(environ, module_config_once)
            for k, v in outputs_once.items():
                if k not in outputs:
                    outputs[k] = []
                
                is_list = False
                if k in module.OutputsSchema.__fields__:
                    json_schema_extra = module.OutputsSchema.__fields__[k].json_schema_extra
                    if json_schema_extra and json_schema_extra.get("is_list", False):
                        is_list = True
                if is_list:
                    outputs[k] += v
                else:
                    outputs[k].append(v)
        return outputs
        
    def run_widget_task(self, container: Union[Workflow, State], task, environ, local_vars):
        run_as_list = self.as_list and isinstance(container, Workflow)
        
        from proconfig.widgets import build_widgets
        # build module based on the task
        module = build_widgets(task.widget_class_name, task.package_name)
        widget_run_id = environ["CURRENT_TASK_ID"] + "_" + task.name

        def run():
            start_time = time.time()
            try:
                print("start run", task.name)
                
                if run_as_list:
                    task_inputs = tree_map(lambda x: self.wrap_non_ref_to_list(x, list(container.blocks.keys())), task.inputs)
                else:
                    task_inputs = task.inputs
                    
                module_config = tree_map(lambda x: calc_expression(x, local_vars), task_inputs)
                        
                self.callback(event_type="task_start", inputs=module_config, create_time=start_time, task_status='start', task_name=task.name)
                if not self.debug_mode:
                    enable_cache = False
                    if task.properties.cache is not None:
                        enable_cache = task.properties.cache # always follow the setting in task
                    else:
                        enable_cache = container.properties.cache
                    
                    block_outputs = None
                    if enable_cache:
                        debug_cache_file = f"cache/{self.name}.json"
                        
                        with FileLock(debug_cache_file + ".lock"):
                            if not os.path.isfile(debug_cache_file):
                                os.makedirs(os.path.dirname(debug_cache_file), exist_ok=True)
                                json.dump({}, open(debug_cache_file, "w"))
                            
                        cached_data = json.load(open(debug_cache_file))
                        task_hash_key = f'{self.name}:{task.name}_hash'
                        task_result_key = f'{self.name}:{task.name}_result'
                        config_hash = hash_dict(module_config)
                        if cached_data.get(task_hash_key, "") == config_hash:
                            print(f"Use cached outputs of {task_result_key}")
                            block_outputs = cached_data[task_result_key]
                    
                    if block_outputs is None:
                        # define a progress callback
                        def progress_callback(progress=0, stream_output=None):
                            self.callback(event_type="task_running", outputs={"progress": progress, "stream_output": stream_output}, create_time=time.time(), task_name=task.name)
                            
                        if run_as_list:
                            module_config["callback"] = [progress_callback]
                            module_config["widget_run_id"] = [widget_run_id]
                            block_outputs = self.run_widget_as_list(module, environ, module_config, task.inputs)
                        else:
                            module_config["callback"] = progress_callback
                            module_config["widget_run_id"] = widget_run_id
                            block_outputs = module(environ, module_config)
                        del module_config
                        gc.collect()
                        
                    if enable_cache:
                        with FileLock(debug_cache_file + ".lock"):
                            cached_data = json.load(open(debug_cache_file))
                            cached_data[task_hash_key] = config_hash
                            cached_data[task_result_key] = block_outputs
                            json.dump(cached_data, open(debug_cache_file, "w"), indent=2)
                    local_vars[task.name] = block_outputs
                    print("finish run", task.name)
                else:
                    time.sleep(1.0)
                    block_outputs = {}
                self.callback(event_type="task_end", outputs=block_outputs, create_time=start_time, finish_time=time.time(), task_status='succeeded', task_name=task.name)
            except Exception as e:
                environ["BREAK"] = e
                error_message = str(e)
                error_message_detail = str(traceback.format_exc())
                logging.info(error_message_detail)
                self.callback(event_type="task_end", outputs={"error_message": error_message, "error_message_detail": error_message_detail}, create_time=start_time, finish_time=time.time(), task_status='failed', task_name=task.name)
                raise e
            
        if module.exclusive_mode:
            lock_file = f"cache/{self.name}_exclusive_task.lock"
            with FileLock(lock_file):
                run()
        else:
            run()
            
    def run_workflow_task(self, task, environ, local_vars):
        # build the workflow
        workflow_root = os.path.join(os.environ["PROCONFIG_PROJECT_ROOT"], "workflow")
        workflow_path = os.path.join(workflow_root, task.workflow_id, "proconfig.json")
        workflow_config = json.load(open(workflow_path))
        workflow = Workflow.model_validate(workflow_config)
        payload = {k: calc_expression(v, local_vars) for k, v in task.inputs.items()}
        outputs = self.run_workflow(workflow, environ, payload)
        local_vars[task.name] = outputs
        
    def run_block_task(self, task, environ, local_vars):
        if task.block["type"] == "workflow":
            workflow = Workflow.model_validate(task.block)
            payload = {k: calc_expression(v, local_vars) for k, v in task.inputs.items()}
            outputs = self.run_workflow(workflow, environ, payload)
        else:
            raise NotImplementedError()
        local_vars[task.name] = outputs
        
    def process_comfy_extra_inputs(self, task):

        comfy_extra_inputs = {
            "api": task.api,
            "comfy_workflow_id": task.comfy_workflow_id,
        }
        task.inputs["comfy_extra_inputs"] = comfy_extra_inputs
            
    def run_task(self, container, task, environ, local_vars):
        
        # block names: names of the (task) blocks of the same level
        if task.widget_class_name == "ComfyUIWidget": # hasattr(task, "comfy_workflow_id")
            assert hasattr(task, "comfy_workflow_id"), "no comfy_workflow_id is founded"
            self.process_comfy_extra_inputs(task)
            
        if task.mode == "widget":
            return self.run_widget_task(container, task, environ, local_vars)
        elif task.mode == "workflow":
            return self.run_workflow_task(task, environ, local_vars)
        elif task.mode == "block":
            return self.run_block_task(task, environ, local_vars)
        else:
            raise NotImplementedError(f"task mode is {task.mode}, which is not supported")


    def load_breakpoint_backup(self, workflow: Workflow):
        save_dir = return_breakpoint_cache_dir()
        
        with open(os.path.join(save_dir, f'{workflow.debug_uuid}.pkl'), 'rb') as file:
            loaded_data = cloudpickle.load(file)

        return loaded_data
    
    def save_breakpoint_backup(self, workflow: Workflow, completed_tasks, environ, local_vars, task_names):
        save_dir = return_breakpoint_cache_dir()

        required_local_variable = workflow._get_required_local_variable()
        # NOTE: here to filter 
        local_vars_reduce = {}
        for key_list in required_local_variable:
            if local_vars.get(key_list[0]) is None:
                continue
            if local_vars_reduce.get(key_list[0]) is None:
                local_vars_reduce[key_list[0]] = {}
            local_vars_reduce[key_list[0]][key_list[1]] = local_vars[key_list[0]][key_list[1]] 

        environ_reduce = {}
        for key in environ:
            if '_CACHE' in key:
                continue
            else:
                environ_reduce[key] = environ[key]
        data = [completed_tasks, environ_reduce, local_vars_reduce]

        with open(os.path.join(save_dir, f'{workflow.debug_uuid}.pkl'), 'wb') as file:
            cloudpickle.dump(data, file)
            # since the file may be very large (> 20G?). Flush should be ensured here to gaurantee the save process complete
            file.flush()           
            os.fsync(file.fileno()) 
        
        # change the breakpoint signal in json
        with open(os.path.join(save_dir, f'{workflow.debug_uuid}.json'), 'r') as file:
            workflow_json = json.load(file)
        for block in workflow_json['workflow']['blocks']:
            if block['name'] in task_names:
                block['breakpoint'] = False
        with open(os.path.join(save_dir, f'{workflow.debug_uuid}.json'), 'w') as file:
            json.dump(workflow_json, file, indent=2)
        
    def run_tasks_sequential(self, container: Union[State, Workflow], environ, local_vars, run_from_breakpoint=False):
        # if this is debug process, we load the memory from disk of last execution
        if run_from_breakpoint and isinstance(container, Workflow):
            assert container.debug_uuid
            completed_tasks, environ, local_vars = self.load_breakpoint_backup(container)
        else:
            completed_tasks = set()
        
        # do execution
        block_names = list(container.blocks.keys())
        for task_name, task in container.blocks.items():
            # if task is already done
            if task_name in completed_tasks:
                print(f'{task_name=} is in {completed_tasks}, skip...')
                continue
            
            # if we need to breakpoint debug here
            if getattr(task, 'breakpoint', False) and isinstance(container, Workflow):
                try:
                    self.save_breakpoint_backup(container, completed_tasks, environ, local_vars, [task_name])
                    self.callback(event_type="breakpoint", outputs={'debug_uuid': container.debug_uuid}, finish_time=time.time(), task_status='succeeded', task_name=task.name)
                except Exception as e:
                    self.callback(event_type="breakpoint", outputs={'error_message': str(e)}, finish_time=time.time(), task_status='failed', task_name=task.name)
                break 

            # run task
            self.run_task(container, task, environ, local_vars)

            # record the completed task
            completed_tasks.add(task_name)

        return completed_tasks, local_vars

            
    def run_tasks_parallel(self, container: Workflow, environ, local_vars, run_from_breakpoint=False):
        dag = container.tasks_dag
        order = copy.deepcopy(dag.top_order)
        
        futures = {}
        breakpoint_tasknames = []

        if run_from_breakpoint:
            assert container.debug_uuid
            completed_tasks, environ, local_vars = self.load_breakpoint_backup(container)
        else:
            completed_tasks = set()
        
        block_names = list(container.blocks.keys())
        with ThreadPoolExecutor() as executor:
            while order:
                # dep -> task
                # dag.graph : key = dependency, value = transition target
                ready_tasks = [task_name for task_name in order if (all(dep in completed_tasks for dep in dag.graph if task_name in dag.graph[dep]) and task_name not in completed_tasks)]
                # print(f'\n\n Ready Tasks {ready_tasks} \n\n Completed Tasks {completed_tasks} \n\n Breakpoint Tasks {breakpoint_tasknames} \n\n')
                
                for task_name in ready_tasks:
                    if task_name not in futures:
                        if getattr(self.blocks[task_name], 'breakpoint', False):
                            breakpoint_tasknames.append(task_name)
                            order.remove(task_name)
                        else:
                            futures[task_name] = executor.submit(self.run_task, container, container.blocks[task_name], environ, local_vars)
                
                for future in as_completed(futures.values()):
                    if "BREAK" in environ:
                        raise environ["BREAK"]
                    task_name = [t for t, f in futures.items() if f == future][0]
                    completed_tasks.add(task_name)
                    order.remove(task_name)
                    del futures[task_name]

                if len(ready_tasks) == 0:
                    break
                
        # NOTE: need test
        if len(breakpoint_tasknames) > 0: # occur a breakpoint
            try:
                self.save_breakpoint_backup(container, completed_tasks, environ, local_vars, breakpoint_tasknames)
                self.callback(event_type="breakpoint", outputs={'debug_uuid': container.debug_uuid}, finish_time=time.time(), task_status='succeeded', task_name=breakpoint_tasknames[0])
            except Exception as e:
                self.callback(event_type="breakpoint", outputs={'error_message': str(e)}, finish_time=time.time(), task_status='failed', task_name=breakpoint_tasknames[0])


        return completed_tasks, local_vars
    
    def run():
        pass
    

    def run_workflow(self, workflow: Workflow, environ, payload, run_from_breakpoint=False):
        gc.disable()
        if run_from_breakpoint: 
            local_vars = {}
        else:
            local_vars = copy.deepcopy(payload)
            # modify context
            for k, v in workflow.context.items():
                if isinstance(v, Variable):
                    workflow.context[k] = v.value
            local_vars["context"] = workflow.context
            
            workflow_start_time = time.time()
            self.callback(event_type="workflow_start", inputs=local_vars, create_time=workflow_start_time, task_status='start')
            
            inputs_start_time = time.time()
            self.callback(event_type="task_start", inputs=local_vars, create_time=inputs_start_time, task_status='start', task_name="@@@start")
            # add user_input_false inputs
            for k, v in workflow.inputs.items():
                if v.user_input and k not in payload:
                    raise NotImplementedError(f"{k} requires user_input=True but no input is provided!")
                if not v.user_input and not k in payload:
                    if getattr(v, "default_value"):
                        local_vars[k] = calc_expression(v.default_value, local_vars)
                    else:
                        raise NotImplementedError(f"{k} user_input=False but has neither default_value nor transition payload!")
            self.callback(event_type="task_end", outputs=local_vars, create_time=inputs_start_time, finish_time=time.time(), task_status='succeeded', task_name="@@@start")
    
        if workflow.tasks_dag is None or (not self.parallel):
            completed_tasks, local_vars = self.run_tasks_sequential(workflow, environ, local_vars, run_from_breakpoint=run_from_breakpoint)
        else:
            completed_tasks, local_vars = self.run_tasks_parallel(workflow, environ, local_vars, run_from_breakpoint=run_from_breakpoint)
        
        if len(completed_tasks) != len(workflow.blocks):
            print(f'\n\n #### workflow not complete due to breakpoint debug or other errors #### \n\n')
            return {}
        else:
            # handle the outputs
            outputs_start_time = time.time()
            self.callback(event_type="task_start", inputs=local_vars, create_time=outputs_start_time, task_status='start', task_name="@@@end")
            outputs = {}
            for output_key, output_expression in workflow.outputs.items():
                if isinstance(output_expression, Variable):
                    output_key = output_expression.name
                    output_expression = output_expression.value

                value = calc_expression(output_expression, local_vars)
                if "context." in output_key:
                    raise NotImplementedError("cannot write to context of workflow")
                else:
                    outputs[output_key] = value
            self.callback(event_type="task_end", outputs=outputs, create_time=outputs_start_time, finish_time=time.time(), task_status='succeeded', task_name="@@@end")
            
            self.callback(event_type="workflow_end", outputs=outputs, create_time=workflow_start_time, finish_time=time.time(), task_status='succeeded')
        del local_vars
        return outputs
    
    def run_state(self, state: State, context: dict, environ: dict, payload: dict = {}):
        local_vars = copy.deepcopy(payload)
        local_vars["context"] = context
        
        state_start_time = time.time()
        self.callback(event_type="state_start", inputs=local_vars, create_time=state_start_time, task_status='start')
        
        # add user_input_false inputs
        for k, v in state.inputs.items():
            if "CHAT_MESSAGE" in payload and v.type == "text" and v.source == "IM":
                local_vars[k] = payload["CHAT_MESSAGE"]
                continue
            
            if v.user_input and k not in payload:
                raise NotImplementedError(f"{v.name} requires user_input=True but no input is provided!")
            
            # for user_input = True, provide the v.default_value
            # for user_input = False, provide the v.value
            if not v.user_input and not k in payload:
                if hasattr(v, "value"):
                    local_vars[k] = calc_expression(v.value, local_vars)
                else:
                    raise NotImplementedError(f"{k} user_input=False but has neither default_value nor transition payload!")

                    
        self.run_tasks_sequential(state, environ, local_vars)
        
        # handle the outputs
        output_vars = {}
        for output_key, output_expression in state.outputs.items():
            if isinstance(output_expression, Variable):
                output_expression = output_expression.value
            value = calc_expression(output_expression, local_vars)
            if "context." in output_key:
                splits = output_key.split(".")
                assert len(splits) == 2
                context[splits[1]] = value
            else:
                output_vars[output_key] = value
        local_vars.update(output_vars)
        
        # handle the render
        renders = {}
        render = state.render.model_dump()
        for render_key, render_expression in render.items():
            if render_expression is None:
                continue
            renders[render_key] = tree_map(lambda x: calc_expression(x, local_vars), render_expression)
            
        outputs = {'context': context, 'renders': renders, 'local_vars': local_vars}
        self.callback(event_type="state_end", inputs=None, outputs=outputs, create_time=state_start_time, task_status='succeeded', )
        return context, renders, local_vars, output_vars
    
    def run_automata(self, automata: Automata, sess_state: SessionState, payload: dict = {}):
        environ = sess_state.environ
        # payload includes inputs from the form
        current_state_name = sess_state.current_state or automata.initial
        context = sess_state.context or automata.context
        # modify context
        for k, v in context.items():
            if isinstance(v, Variable):
                context[k] = v.value
        environ[GLOBAL_CACHE_MODE] = automata.properties.cache

        while True:
            current_state = automata.blocks[current_state_name]
            payload.update(sess_state.state_outputs)
            context, render, local_vars, output_vars = self.run_state(current_state, context, environ, payload)
            # save the output_vars to sess_state
            sess_state.state_outputs[current_state_name] = output_vars
            payload[current_state_name] = output_vars
            if "ALWAYS" in (current_state.transitions or {}):
                transition_case = automata.evaluate_conditional_transitions("ALWAYS", current_state.transitions["ALWAYS"], local_vars)
                current_state_name = transition_case.target
            else:
                break
        
        sess_state.current_state = current_state_name
        sess_state.context = context
        
        # obtain the mapping from event to next_state_name and target_inputs
        event_mapping = {}
        local_transitions = automata.blocks[current_state_name].transitions or {}
        global_transitions = automata.transitions or {}
        
        events = []
        for button_id, button in enumerate(render.get("buttons", [])):
            event_name = button["on_click"]
            if isinstance(event_name, dict):
                event_payload = event_name.get("payload", {})
                event_name = event_name["event"]
            else:
                event_payload = {}
            events.append({
                "event_key": f"BUTTON_{button_id}",
                "event_name": event_name,
                "payload": event_payload
            })
            
        events.append({
                "event_key": "CHAT",
                "event_name": "CHAT",
                "payload": {}
        })
            
        for event_item in events:
            event_name = event_item["event_name"]
            event_payload = event_item["payload"]
            for payload_key, payload_value in event_payload.items():
                if type(payload_value) == dict:
                    event_payload[payload_key] = payload_value["value"]
                
            # handle payload
            transition = local_transitions.get(event_name, None)
            transition = transition or global_transitions.get(event_name, None)
            if transition is None:
                if event_name == "CHAT":
                    continue
                raise NotImplementedError(f"the transition {transition} is not defined, please revise your checker!")
            # evaluate the transitions
            try:
                transition_case = automata.evaluate_conditional_transitions(event_name, transition, local_vars)
                target_state = transition_case.target
            except Exception as e:
                print(e)
                raise(e)
                
            # get the target_inputs from transition
            target_inputs_transition = {}
            for k, v in transition_case.target_inputs.items():
                target_inputs_transition[k] = calc_expression(v, {'payload': event_payload, **local_vars}) # the target_inputs defined by the transition
            
            # get the target inputs
            target_inputs = automata.blocks[target_state].inputs
            
            visible_variables = {"context": context, **local_vars, **sess_state.state_outputs}
            if event_name == "CHAT":
                target_inputs = {k: v for k, v in target_inputs.items() if v.user_input and v.source == "IM"}
            else:
                target_inputs = {k: v for k, v in target_inputs.items() if v.user_input and v.source != "IM"}
            
            for input_var in target_inputs.values():
                for k in input_var.model_dump():
                    setattr(input_var, k, tree_map(lambda x: calc_expression(x, visible_variables), getattr(input_var, k)))
                
            # target_inputs = tree_map(lambda x: calc_expression(x, local_vars), target_inputs)
            event_mapping[event_item["event_key"]] = {
                "target_state": target_state,
                "target_inputs": target_inputs,
                "target_inputs_transition": target_inputs_transition, # the target_inputs from the transition
            }
            
        message_count = sess_state.message_count
        event_mapping = {f'MESSAGE_{message_count}_{k}' if k != "CHAT" else k: v for k, v in event_mapping.items()}
        sess_state.event_mapping.update(event_mapping)
        return sess_state, render