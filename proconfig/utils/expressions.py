import re
from dotenv import dotenv_values
import numpy as np
import json
import execjs
import logging
from proconfig.utils.pytree import tree_map
from proconfig.utils.misc import is_serializable_type
from easydict import EasyDict as edict
import time
from typing import Any
from proconfig.core.exception import ShellException

package_ctx = {
    'np': np,
    'json': json,
    'time': time,
}

def evaluate_expression_python(expression, context, check_valid=True):
    try:
        # Replace variables in the expression with their values from the context
        context = {k: edict(v) if type(v) == dict else v for k, v in context.items()}
        combined_ctx = {**context, **package_ctx}
        evaluated_expression = eval(expression, {}, combined_ctx)
        if isinstance(evaluated_expression, edict):
            evaluated_expression = {**evaluated_expression}
        return evaluated_expression
    except Exception as e:
        logging.warning(f"Error evaluating expression '{expression}': {e}")
        if check_valid:
            error = {
                'error_code': 'SHELL-1107',
                'error_head': 'Expression Evaluation Error', 
                'msg': f"Error evaluating expression '{expression}'. context keys: [{context.keys()}]",
            }
            raise ShellException(**error)
        else:
            return None

def evaluate_expression_js(expression, ctx, **kwargs):
    if expression == '':
        return ''
    
    id2var = {}
    def convert_unserializable_to_ref(var):
        if var is None:
            return None
        if not is_serializable_type(var):
            var_id = str(id(var))
            id2var[var_id] = var
            return var_id
        return var
    
    def retrive_data_from_ref(var_id):
        return id2var.get(var_id, var_id)
            
    new_ctx = tree_map(convert_unserializable_to_ref, ctx)

    variable_list = list(new_ctx.keys())
    context = execjs.compile(
        f'''
        function evaluateExpression({', '.join(variable_list)}) {{
            var json_data = {{result: {expression}}}
            return JSON.stringify(json_data);
        }}
        '''
    )    
    try:
        value_list = [new_ctx[v] for v in variable_list]
        result_json = context.call("evaluateExpression", *value_list)
        result = json.loads(result_json)['result']
        result = tree_map(retrive_data_from_ref, result)
        return result
    except Exception as e:
        print("expression:", expression)
        error = {
            'error_code': 'SHELL-1107',
            'error_head': 'Expression Evaluation Error', 
            'msg': f"Error evaluating expression '{expression}'. context keys: [{context.keys()}]",
        }
        raise ShellException(**error)
        
    
    
def evaluate_expression(expression, context, language, **kwargs):
    if language == "python":
        return evaluate_expression_python(expression, context, **kwargs)
    elif language == "js":
        return evaluate_expression_js(expression, context, **kwargs)
    else:
        raise NotImplementedError()


def evaluate_expressions_with_context(text, context, language="python", **kwargs):
    # Regular expression to find expressions wrapped with ${}
    expression_pattern = re.compile("\{\{([\s\S]+?\}*)\}\}")

    # Find all matches in the text
    matches = expression_pattern.findall(text)
    if len(matches) == 1 and text.startswith("{{") and text.endswith("}}"):
        expression = text[2:-2].strip()
        return evaluate_expression(expression, context, language=language, **kwargs)

    # Iterate through matches and evaluate each expression
    for match in matches:
        # Evaluate the expression and replace it in the original text
        expression = match.strip()
        value = evaluate_expression(expression, context, language=language, **kwargs)
        
        if value is not None:
            # Replace the expression in the text with the evaluated value
            text = text.replace(f"{{{{{match}}}}}", str(value))
    return text

CONFIG = dotenv_values(".env")
def calc_expression(expression: Any, ctx: dict, **kwargs):
    language = CONFIG.get("EXPRESSON_LANGUAGE", "python")
    if isinstance(expression, str) and r'{{' in expression and r'}}' in expression:
        return evaluate_expressions_with_context(expression, ctx.copy(), language=language, **kwargs)
    else:
        return expression
    
    # if CONFIG["EXPRESSON_LANGUAGE"] == "python":
    #     return calc_expression()
    #     raise NotImplementedError()
    # elif CONFIG["EXPRESSON_LANGUAGE"] == "javascript":
    #     return calc_expression_js(expression, ctx, **kwargs)
    # else:
    #     raise NotImplementedError()


# def calc_expression_python(expression: Any, ctx: dict):
#     """
#     Calculate the value of the expression.
#     """
#     if isinstance(expression, str) and expression.startswith("${") and expression.endswith("}"):
#         # TODO: Check security issues.
#         # Calculate the expression
#         expression = expression[2:-1]
#         combined_ctx = {**ctx, **package_ctx}
#         return eval(expression, combined_ctx.copy())
#     elif isinstance(expression, str) and expression.startswith(r"{{") and expression.endswith(r"}}"):
#         # TODO: Check security issues.
#         # Calculate the expression
#         expression = expression[2:-2]
#         combined_ctx = {**ctx, **package_ctx}
#         return eval(expression, combined_ctx.copy())
#     elif isinstance(expression, str) and r'{{' in expression:
#         combined_ctx = {**ctx, **package_ctx}
#         return evaluate_expressions_with_context(expression, combined_ctx.copy())
#     else:
#         return expression
    
def calc_expression_js(expression: Any, ctx: dict, **kwargs):
    if isinstance(expression, str) and r'{{' in expression and r'}}' in expression:
        return evaluate_expressions_with_context(expression, ctx.copy(), language="js", **kwargs)
    else:
        return expression
    
if __name__ == '__main__':
    # Example usage
    context = {'a': 5, 'b': 3, 'ab': {'haha': 1}, 'shit': '3', 'context': {'a': 3, 'b': 4}}
    text_with_expressions = r"The result is {{a}} and {{a * 2}}. unkown variables {{shit > 10}}"
    # result = calc_expression_js(text_with_expressions, context)
    # result = calc_expression('{{a * 2}}', context)
    # print(type(result), result)

    # # Example usage
    # context = {'a': 5, 'b': 3, 'ab': {'haha': 1}, 'prompts': ['Haha this is the first prompt'], 'prompt': 'This is a prompt', 'context': {'a': 3, 'b': 4}}
    # # text_with_expressions = r"The result is {{json.dumps(ab)}} and {{a * 2}}. unkown variables {{shit > 10}}, context.a: {{context.a}}"

    # print(calc_expression('{{[...prompts, prompt]}}', context))
    # # print(calc_expression(text_with_expressions, context))
    # print(calc_expression("{{[]}}", {}))
    
    expression = '{{`![](https://files.catbox.moe/01dvwg.png) *As you enter the casino, a girl in black bunny girl suit welcomes you.* \n\n **"Welcome to the Golden Casino! I am Rina, a guide to your fascinating journey. I will always be in this lobby, so you can find me anytime if you need any help."**\n\n**Current money : ${context.money}\\$**`}}'
    context = {'context': {'money': 100}, 'randnum': 785}
    expression = '{{(Number(randnum)==000||Number(randnum)==111||Number(randnum)==222||Number(randnum)==333||Number(randnum)==444||Number(randnum)==555||Number(randnum)==666||Number(randnum)==777||Number(randnum)==888)?context.total_lose_counter:(Number(randnum)==999?context.total_lose_counter:context.total_lose_counter-1)}}'
    # expression = '{{Number(randnum)==000||Number(randnum)==111||Number(randnum)==222||Number(randnum)==333||Number(randnum)==444||Number(randnum)==555||Number(randnum)==666||Number(randnum)==777||Number(randnum)==888}}'
    
    expression = "{{condition_chain[0]}}"
    context = {'prompt': 'a photorealistic red car running one the highway', 'context': {'sd_ckpt_path': 'models/checkpoints/stable_diffusion/AOM3A1.safetensors'}, 'condition_chain': [[['139782939184080', {'pooled_output': '139782939184720', 'control': '139782939102176', 'control_apply_to_uncond': False}]], '7584864']}
    # print(calc_expression(expression, context))
    
    
    expression = "Your own grinning face here.: \n  <video src=' {{ context.generated_video }} ' width='600' controls autoplay muted> </video>"
    context = {"context": {"generated_video": 123}}
    
    print(calc_expression(expression, context))