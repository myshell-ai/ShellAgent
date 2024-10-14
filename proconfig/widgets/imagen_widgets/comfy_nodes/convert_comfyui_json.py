import json
from proconfig.widgets.base import build_widgets, BaseWidget, WIDGETS
from typing import get_origin, Literal
from proconfig.utils.misc import convert_unserializable_display, tree_map
import os
import logging
import copy

empty_proconfig = {
  "type": "workflow",
  "context": {},
  "inputs": {},
  "outputs": {},
  "blocks": [
  ]
}

native_types = [int, float, str, list, dict, bool]

# build task
def build_task(node, node_id_to_widget_map, node_id_map, link_map):
    name = f"node_{node['id']}"
    widget_class_name = "ComfyUI/" + node["type"]
    
    if node["type"] == "KSampler":
        del node["widgets_values"][1]
    elif node["type"] == "KSamplerAdvanced":
        del node["widgets_values"][2]
        
    widget = node_id_to_widget_map[node['id']]
    
    if widget is not None:
        # get the native types
        widgets_values = node.get("widgets_values", []).copy()
        inputs_kwargs = {}
        for field_name, field_info in widget.InputsSchema.model_fields.items():
            if len(widgets_values) == 0:
                break
            if field_info.json_schema_extra and field_info.json_schema_extra.get("hidden", False):
                continue
            if field_info.annotation in native_types or get_origin(field_info.annotation) == Literal:
                if isinstance(widgets_values, list):
                    inputs_kwargs[field_name] = widgets_values.pop(0)
                elif isinstance(widgets_values, dict):
                    inputs_kwargs[field_name] = widgets_values[field_name]
                else:
                    import pdb; pdb.set_trace()
        
        try:
            assert len(inputs_kwargs) <= len(node.get("widgets_values", []))
        except:
            import pdb; pdb.set_trace()
    else:
        inputs_kwargs = {}
        # for the missing widgets, inputs_kwargs are disabled
        pass
        
    for input_count, input_item in enumerate(node.get("inputs", {})):
        link_id = input_item["link"]
        input_name = input_item['name'] or f"input_var_{input_count}"
        if link_id is None:
            if widget is None:
                inputs_kwargs[input_name] = None
            continue
        from_node_id = link_map[link_id][1]
        from_node_output_index = link_map[link_id][2]
        from_widget = node_id_to_widget_map[from_node_id]
        if from_widget is not None:
            output_names = list(from_widget.OutputsSchema.model_fields.keys())
        else:
            output_names = [out["name"] for out in node_id_map[from_node_id].get("outputs", {})]
        output_name = output_names[from_node_output_index]
        
        inputs_kwargs[input_name] = "{{" + f"node_{from_node_id}.{output_name}" + "}}"
    
    if widget is not None:
        block = {
            "type": "task",
            "name": name,
            "widget_class_name": widget_class_name,
            "inputs": inputs_kwargs
        }
    else:
        input_names = [inp["name"] for inp in node.get("inputs", {})]
        input_types = [inp["type"] for inp in node.get("inputs", {})]
        output_names = [out["name"] for out in node.get("outputs", {})]
        output_types = [out["type"] for out in node.get("outputs", {})]
        block = {
            "type": "task",
            "mode": "undefined",
            "name": name,
            "widget_class_name": widget_class_name,
            "inputs": inputs_kwargs, # Dict[str, Any]
            "input_names": input_names, # List[str]
            "input_types": input_types, # List[str]
            "output_names": output_names, # List[str]
            "output_types": output_types, # List[str]
        }
    return block
    
def convert_comfyui_to_proconfig(comfyui_config):
    link_map = {link[0]: link for link in comfyui_config["links"]}
    nodes = sorted(comfyui_config["nodes"], key=lambda x: x["order"])
    print("number of nodes:", len(nodes))
    proconfig = copy.deepcopy(empty_proconfig)
    node_id_to_widget_map = {}
    node_id_map = {}
    for node in nodes:
        node_class_name = "ComfyUI/" + node["type"]
        node_id_map[node['id']] = node
        try:
            node_id_to_widget_map[node['id']] = build_widgets(node_class_name)
        except:
            node_id_to_widget_map[node['id']] = None
            # raise NotImplementedError(f"Node {node_class_name} is not supported")
    for node in nodes:
        proconfig["blocks"].append(build_task(node, node_id_to_widget_map, node_id_map, link_map))
    print("number of blocks:", len(proconfig["blocks"]))
    return proconfig


# comfyui config:
'''
{
    nodes: [
      {
        "id": 8,
        "type": "VAEDecode",
        "pos": [
          1235.7215957031258,
          577.1878720703122
        ],
        "size": {
          "0": 210,
          "1": 46
        },
        "flags": {},
        "order": 5, # topological order, 
        "mode": 0,
        "inputs": [
          {
            "name": "samples",
            "type": "LATENT",
            "link": 7
          },
          {
            "name": "vae",
            "type": "VAE",
            "link": 21
          }
        ],
        "outputs": [
          {
            "name": "IMAGE",
            "type": "IMAGE",
            "links": [
              9
            ],
            "slot_index": 0
          }
        ],
        "properties": {
          "Node name for S&R": "VAEDecode"
        }
      },
      {
        "id": 3,
        "type": "KSampler",
        "pos": [
          845,
          172
        ],
        "size": {
          "0": 315,
          "1": 262
        },
        "flags": {},
        "order": 5,
        "mode": 0,
        "inputs": [
          {
            "name": "model",
            "type": "MODEL",
            "link": 18
          },
          {
            "name": "positive",
            "type": "CONDITIONING",
            "link": 4
          },
          {
            "name": "negative",
            "type": "CONDITIONING",
            "link": 6
          },
          {
            "name": "latent_image",
            "type": "LATENT",
            "link": 2
          }
        ],
        "outputs": [
          {
            "name": "LATENT",
            "type": "LATENT",
            "links": [
              7,
              10
            ],
            "slot_index": 0
          }
        ],
        "properties": {
          "Node name for S&R": "KSampler"
        },
        "widgets_values": [
          1117646484706391,
          "randomize",
          12,
          8,
          "dpmpp_sde",
          "normal",
          1
        ]
      },
    ],
    links: [
      [
        21, # link ID
        16, # link from
        2, # link from slot index
        8, # link to
        1, # link to slot index
        "VAE"
      ],
    ]
}
'''

if __name__ == '__main__':
    import sys
    config_path = sys.argv[1]
    # "configs/comfyui/loras.json"
    
    config_converted_path = config_path.replace("comfyui", "comfyui_converted")
    os.makedirs(os.path.dirname(config_converted_path), exist_ok=True)
    
    comfyui_config = json.load(open(config_path))
    converted_proconfig = convert_comfyui_to_proconfig(comfyui_config)
    
    # test run
    
    from proconfig.core import Workflow
    workflow = Workflow.model_validate(converted_proconfig)
    json.dump(converted_proconfig, open(config_converted_path, "w"), indent=2)
    
    def callback(**kwargs):
        kwargs = tree_map(convert_unserializable_display, kwargs)
        try:
            print(json.dumps(kwargs))
        except Exception as e:
            import pdb; pdb.set_trace()
    
    workflow.callback = callback
    # workflow.as_list = True

    from runners.workflow_runner import run
    outputs = run(workflow)
    print(outputs)