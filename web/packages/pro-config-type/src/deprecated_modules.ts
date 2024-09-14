import { CustomKey } from './common';

export type MemoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

/**
 * Available models: gpt-35-turbo-16k (gpt3.5) gpt-4-1116-preview (gpt4-turbo)
 */
export type LLMModel = 'gpt-35-turbo-16k' | 'gpt-4-1116-preview';

/**
 * The LLMModule is used for executing LLM calls.
 *
 * Its input can be specified via expression variables in the config.
 * Its output is specified by the output_name and defaults to 'reply' if not specified.
 *
 * @example
 * ```
 * const simpleConfig= {
 *   model: "gpt-35-turbo-16k",
 *   system_prompt: "You are a bot that can talk jokes to me.",
 *   user_prompt: "{{user_input}}",
 * };
 *
 * const chat_page = {
 *   inputs: {
 *     user_input: {
 *       type: "IM",
 *       user_input: true,
 *     },
 *   },
 *   tasks: {
 *     example_task: {
 *       module_type: "LLMModule",
 *       module_config: simpleConfig,
 *       output_name: "reply"
 *     },
 *     // ...maybe some module for querying weather, etc.
 *   },
 *   render: {
 *     text: "{{reply}}",
 *   }
 * };
 * ```
 * This example demonstrates an AtomicState, which accepts input from users within an IM, runs the LLM, and displays the LLM's response in render.text.
 */
export type LLMModule = {
  module_type: 'LLMModule';
  module_config: LLMConfig;
};

/**
 * Most fields are compatible with OpenAI API {@link https://platform.openai.com/docs/api-reference/chat/create}
 */
type LLMConfig = {
  model: LLMModel;
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  /**
   * Memory is the LLM's storage used to retain certain information across multiple rounds of dialogue.
   * For function calls, it can also act as a few shots input.
   */
  memory?: MemoryItem[];
  /**
   * need_memory is a flag provided by myshell, used to indicate the need for memory.
   * If memory is required, the previous interaction memory with this module will be passed into the memory each time the function is called.
   * It's worth noting that if the user specifies a few shot in the memory field, need_memory will not take effect.
   *
   * Motivation: Some LLMFunction calls do not require Memory. They only need to make one function call to judge the user's intention and format the output data.
   * In this case, memory is not needed. For the ChatBot scenario, a few shots may not be that necessary. Therefore, automatic memory and few-shot conflict may occur. )
   */
  need_memory?: boolean;
  /**
   * These two fields are used in multi-turn dialogues to prompt the user and the system.
   * system_prompt is placed in the first element {"role":"assistant","content":{{system_prompt}}} of the Message array of the LLM Request Body each time this module is called.
   */
  system_prompt: string;
  /**
   * user_prompt is placed in the last element {"role":"user","content":{{user_prompt}}} of the Message array of the LLM Request Body each time this module is called.
   */
  user_prompt: string;
  /** Defaults to 'reply' */
  output_name?: CustomKey;
};

type FunctionParameter = {
  name: string;
  // TODO: Extend this union type based on the expected types of parameters.
  type: 'list' | 'string' | 'number';
  description: string;
};

/**
 * LLMFunctionModule is a module used for executing LLM function calls.
 * Function calls can be seen as a formatting wrapper provided by LLM (currently only supports OpenAI series models), allowing parameters to be input via JSON, and outputting a serial JSON as we defined in function_parameters.
 *
 * @see https://www.promptingguide.ai/applications/function_calling
 * @see https://platform.openai.com/docs/api-reference/chat/create
 *
 * The module input can be specified by each parameter in the config.
 * The output of the module is a JSON object, which includes the LLM return results and will be automatically output to the state machine output in the form of key-value pairs.
 *
 * @example
 * ```
 *  const simpleConfig= {
 *    model: "gpt-35-turbo-16k",
 *    system_prompt: "You are a bot that can get weather info.",
 *    user_prompt: "{{user_input}}",
 *    function_name: "get_current_weather",
 *    function_description: "Get the current weather in a given location",
 *    function_parameters: [
 *      {
 *        name: "city",
 *        type: "string",
 *        description: "The city, e.g. San Francisco, CA"
 *      },
 *      {
 *        name: "state",
 *        type: "string",
 *        description: "The state, e.g. CA"
 *      }
 *    ],
 *  };
 *
 *  const chat_page = {
 *    inputs: {
 *      user_input: {
 *        type: "IM",
 *        user_input: true,
 *      }
 *    },
 *    tasks: {
 *      example_task: {
 *        module_type: "LLMFunctionModule",
 *        module_config: simpleConfig,
 *      },
 *      // Maybe some other modules or tasks go here
 *    },
 *    render: {
 *      text: "You want to know the weather of {{city}}, {{state}}. And it's weather is xxxx",
 *    }
 *  };
 * ```
 * This example shows an instance of AtomicState, where it accepts user input from an IM, runs the LLMFunctionModule set by example_task. This module will invoke a function named get_current_weather, which will output two parameters, one is city, and the other is state, then display it in render.text.
 */
export type LLMFunctionModule = {
  module_type: 'LLMFunctionModule';
  module_config: LLMFunctionConfig;
};

/**
 * The fields starting with `function_` are vital for the LLMFunctionModule as they control the function behavior. They will be placed in the tools field of the LLM Request Body.
 *
 * The parameters in the example of @type {LLMFunctionModule} will be mapped to these fields in the OpenAI Request Body.
 * ```
 * "tools": [
 *   {
 *     "type": "function",
 *     "function": {
 *       "name": "get_current_weather",
 *       "description": "Get the current weather in a given location",
 *       "parameters": {
 *         "type": "object",
 *         "properties": {
 *           "city": {
 *             "type": "string",
 *             "description": "The city, e.g. San Francisco",
 *           },
 *           "state": {
 *             "type": "string",
 *             "description": "The state, e.g. CA",
 *           },
 *         },
 *         "required": ["state", "city"],
 *       },
 *     },
 *   },
 * ],
 * "tool_choice": {"type": "function", "function": {"name": "get_current_weather"}},
 * ```
 */
type LLMFunctionConfig = Omit<LLMConfig, 'output_name'> & {
  function_name: string;
  function_description: string;
  function_parameters: FunctionParameter[];
};

/**
 * TtsModule provides creators with the ability to freely assemble TTS (Text-to-Speech) configurations within Myshell.
 *
 * @example
 * ```
 * const chat_page = {
 *   inputs: {
 *     user_input: {
 *       type: 'IM',
 *       user_input: true
 *     }
 *   },
 *   tasks: {
 *     example_chat: {
 *       module_type: 'LLMModule',
 *       module_config: {
 *         model: "gpt-35-turbo-16k",
 *         system_prompt: "You are a bot that can talk jokes to me.",
 *         user_prompt: "{{user_input}}",
 *         output_name: "reply"
 *       }
 *     },
 *     example_tts: {
 *       module_type: 'TtsModule',
 *       module_config: {
 *         content: '{{reply}}',
 *         tts_widget_url: 'https://app.myshell.ai/widget/yi2aIf',
 *         output_name: 'reply_voice'
 *       }
 *     }
 *   },
 *   render: {
 *     audio: '{{reply_voice}}',
 *   }
 * }
 * ```
 * In this example, we demonstrate the usage of directing the output of LLM to TTS, and subsequently placing the TTS output into render.audio.
 */
export type TtsModule = {
  module_type: 'TtsModule';
  module_config: TtsConfig;
};

type TtsConfig = {
  /**
   * Creators can choose their desired voices in the Workshop, then obtain the shared widget link through the share function.
   * For instance, https://app.myshell.ai/widget/yi2aIf can be filled in tts_widget_url as the selected audio component.
   */
  tts_widget_url: string;
  /** The text that needs to read aloud. */
  content: string;
  output_name: string;
};

export type AnyWidgetModule = {
  module_type: 'AnyWidgetModule';
  module_config: {
    widget_id: string;
    output_name?: string;
    [input: string]: unknown;
  };
};
