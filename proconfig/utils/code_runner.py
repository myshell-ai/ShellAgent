import re
import numpy as np
import json
import execjs


def evaluate_js_code(code_string, params):
    context = execjs.compile(
        f'''
        function evaluateExpression(params) {{
            {code_string}
            var json_data = {{result: main(params)}}
            return JSON.stringify(json_data);
        }}
        '''
    )    
    try:
        result_json = context.call("evaluateExpression", params)
        result = json.loads(result_json)['result']
        return result
    except Exception as e:
        print(e)
        return None
    
    
def evaluate_python_code(code_string, params):
    function_dict = {}
    exec(f"""
{code_string}
function_dict['code'] = main
"""
    )
    exec(code_string)
    try:
        result = function_dict['code'](params)
        return result
    except Exception as e:
        print(e)
        raise(e)
        
    
if __name__ == '__main__':
    # Example usage
    code_string = "function main(params) {\n const { a, b } = params;\n const sum = params.shit + params.b;\n return sum;\n}"
    params = {"a": 1, "b": 2, "shit": -1}
    result = evaluate_js_code(code_string, params)
    code_string = """def main(params):\n\treturn params["a"] + params["b"]"""
    result2 = evaluate_python_code(code_string, params)
    print(result, result2)