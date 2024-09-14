import { Automata, Task } from '../src/block';

/**
 * “@new” 表示和线上pro config不同的改动细节。
 * FIXME 需要根据情况手动改
 */

const bot = {
  type: 'automata',
  name: 'Grinning Face',
  // "id": "Grinning Face", 弃用 @new
  properties: {
    // "skip_idle_state": true, 开源版默认不需要 @new
    cache: false,
  },
  initial: 'home_page_state',
  context: {
    bot_name: 'Grinning Face',
    template_video_a:
      'https://cdn.myshell.ai/video/chat/embed_obj/40295/202407150108/1.mp4',
    template_video_b:
      'https://cdn.myshell.ai/video/chat/embed_obj/40295/202407150109/2.mp4',
    template_video_c:
      'https://cdn.myshell.ai/video/chat/embed_obj/40295/202407150109/3.mp4',
  },
  // "states": 弃用 @new
  blocks: {
    home_page_state: {
      type: 'state', // 改为required @new
      render: {
        text: "**Upload your portrait here.** ***Below is a placeholder picture for the welcome message, if needed.*** \n\n <img src='https://image.myshell.ai/image/chat/embed_obj/40295/202408041055/guidance.png' width='1024' /> \n\n * Let's start!*",
        buttons: [
          {
            content: 'upload image',
            description:
              'Upload your image here then choose the grinning face you prefer.',
            on_click: 'goto_upload_image_state',
          },
        ],
      },
      transitions: {
        goto_upload_image_state: 'upload_image_state',
      },
    },
    upload_image_state: {
      // this state we save the user input into context variable.
      // and do nothing else. That's designed for retry.
      // input can be input by user or history memory. See `transform_to_retry_style_state`
      type: 'state', // 改为required @new
      inputs: {
        // set the inputs you want user to input. Note that `"user_input" = true` means user will see this input
        // default_value is the default input value.
        image: {
          type: 'image',
          description: 'Upload your own portrait.',
          user_input: true,
        },
      },
      outputs: {
        // save these variable as global variable. so other state can fetch them while execution
        'context.image': '{{image}}',
      },
      render: {
        text: "<table style='width: 100%; table-layout: fixed;'><tr><td style='text-align: center;'><video width='400' controls><source src={{context.template_video_a}} type='video/mp4'></video><div style='text-align: center; margin-top: 5px; font-size: 16px; font-weight: bold;'>(a) Template Video Item A</div></td><td style='text-align: center;'><video width='400' controls><source src={{context.template_video_b}} type='video/mp4'></video><div style='text-align: center; margin-top: 5px; font-size: 16px; font-weight: bold;'>(b) Template Video Item B</div></td><td style='text-align: center;'><video width='400' controls><source src={{context.template_video_c}} type='video/mp4'></video><div style='text-align: center; margin-top: 5px; font-size: 16px; font-weight: bold;'>(c) Template Video Item C</div></td></tr></table>",
        buttons: [
          {
            content: 'Choose Template A',
            description: 'Choose Template A',
            on_click: {
              event: 'goto_save_template_to_context',
              payload: {
                video: '{{context.template_video_a}}',
              },
            },
          },
          {
            content: 'Choose Template B',
            description: 'Choose Template B',
            on_click: {
              event: 'goto_save_template_to_context',
              payload: {
                video: '{{context.template_video_b}}',
              },
            },
          },
          {
            content: 'Choose Template C',
            description: 'Choose Template C',
            on_click: {
              event: 'goto_save_template_to_context',
              payload: {
                video: '{{context.template_video_c}}',
              },
            },
          },
        ],
      },
      transitions: {
        goto_save_template_to_context: {
          target: 'save_template_to_context',
          target_inputs: {
            video: '{{payload.video}}',
          },
        },
      },
    },
    reselect_template_video: {
      type: 'state', // 改为required @new
      inputs: {
        image: {
          type: 'image',
          user_input: false,
        },
      },
      outputs: {
        // reset the global variable for a second try.
        'context.image': '{{image}}',
      },
      render: {
        text: "<table style='width: 100%; table-layout: fixed;'><tr><td style='text-align: center;'><video width='400' controls><source src={{context.template_video_a}} type='video/mp4'></video><div style='text-align: center; margin-top: 5px; font-size: 16px; font-weight: bold;'>(a) Template Video Item A</div></td><td style='text-align: center;'><video width='400' controls><source src={{context.template_video_b}} type='video/mp4'></video><div style='text-align: center; margin-top: 5px; font-size: 16px; font-weight: bold;'>(b) Template Video Item B</div></td><td style='text-align: center;'><video width='400' controls><source src={{context.template_video_c}} type='video/mp4'></video><div style='text-align: center; margin-top: 5px; font-size: 16px; font-weight: bold;'>(c) Template Video Item C</div></td></tr></table>",
        buttons: [
          {
            content: 'Choose Template A',
            description: 'Choose Template A',
            on_click: {
              event: 'goto_save_template_to_context',
              payload: {
                video: '{{context.template_video_a}}',
              },
            },
          },
          {
            content: 'Choose Template B',
            description: 'Choose Template B',
            on_click: {
              event: 'goto_save_template_to_context',
              payload: {
                video: '{{context.template_video_b}}',
              },
            },
          },
          {
            content: 'Choose Template C',
            description: 'Choose Template C',
            on_click: {
              event: 'goto_save_template_to_context',
              payload: {
                video: '{{context.template_video_c}}',
              },
            },
          },
        ],
      },
      transitions: {
        goto_save_template_to_context: {
          target: 'save_template_to_context',
          target_inputs: {
            video: '{{payload.video}}',
          },
        },
      },
    },
    save_template_to_context: {
      type: 'state', // 改为required @new
      inputs: {
        video: {
          type: 'video',
          user_input: false,
        },
      },
      outputs: {
        'context.selected_video': '{{video}}',
      },
      transitions: {
        // always transition to the next state without msg. So no render will work (even you define here) if transition is Always
        ALWAYS: 'functional_state',
      },
    },
    functional_state: {
      // here we start to execute the task based on the input in context.
      type: 'state', // 改为required @new
      // 'tasks': 弃用。@new
      blocks: [
        {
          type: 'task',
          key: 'any_image_workflow',
          mode: 'workflow',
          workflow_id: '', // FIXME
          // 这里之前讨论的是用inputs来传参
          // 因为不想多造一个新字段。但放properties不太好，因为传参的字段可能和一些系统properties如cache产生冲突
          // 如果觉得和inputs含义有冲突，造个params来替代也是可以的。
          inputs: {
            prompt: '{{context.prompt}}',
          },
        },
        // {
        //   name: 'any_module_example_task',
        //   module_type: 'AnyWidgetModule',
        //   module_config: {
        //     widget_id: '1810665405267341312',
        //     input_image: '{{context.image}}', // this field will received value from user input
        //     input_video: '{{context.selected_video}}', // The input video url
        //     output_name: 'result',
        //   },
        // },
        // {
        //   name: 'add_watermark',
        //   module_type: 'AnyWidgetModule',
        //   module_config: {
        //     widget_id: '1790681225172652032',
        //     video: '{{result.url}}', // 网址。输入视频
        //     bot_name: 'Grinning Face', // 机器人名称，将添加到水印中
        //     position: 'right', // 水印的位置
        //     color: 'blue', // 水印的颜色
        //     output_name: 'watermarked_video',
        //   },
        // },
      ],
      outputs: {
        // save the result image into global context. (In most cases, output_name.url is the url for returned image)
        'context.generated_video': '{{any_image_workflow.}}', // FIXME
      },
      transitions: {
        // display the image directly
        ALWAYS: 'retry_page_state',
      },
    },
    retry_page_state: {
      type: 'state', // 改为required @new
      render: {
        // here we display the result and set some button for user to choose
        text: "Your own grinning face here.: \n  <video src='{{context.generated_video}}' width='600' controls autoplay muted> </video>",
        buttons: [
          {
            // try a new image, here we do not need to save any memory, just transition
            content: 'Try with Another Image',
            description:
              'Try another input image and re-select the template video',
            on_click: 'goto_upload_image_state',
          },
          {
            // here if we need to generate again, means the same parameter will be execute a second time.
            // For safety (push the button in previous button). We create a snapshot of the variable now
            content: 'Re-Select Video',
            description: 'Say something here to describe this button',
            on_click: {
              event: 'goto_re_select_state',
              payload: {
                // snapshot of your variable. Note that "image" is just a local name, you can change it as you like
                // Eg. "image_snapshot" : "{{context.image}}", is just ok. The value in context.image will be save to `payload.image_snapshot`
                image: '{{context.image}}',
              },
            },
          },
          {
            // here if we need to generate again, means the same parameter will be execute a second time.
            // For safety (push the button in previous button). We create a snapshot of the variable now
            content: 'Generate again',
            description: 'Say something here to describe this button',
            on_click: {
              event: 'goto_retry_state',
              payload: {
                // snapshot of your variable. Note that "image" is just a local name, you can change it as you like
                // Eg. "image_snapshot" : "{{context.image}}", is just ok. The value in context.image will be save to `payload.image_snapshot`
                image: '{{context.image}}',
                video: '{{context.selected_video}}',
              },
            },
          },
        ],
      },
      transitions: {
        goto_upload_image_state: 'upload_image_state',
        goto_re_select_state: {
          target: 'reselect_template_video',
          target_inputs: {
            // The value will be set to the target state's input, if the input with same name set `user_input=false`
            image: '{{payload.image}}',
          },
        },
        goto_retry_state: {
          target: 'transform_to_retry_style_state',
          target_inputs: {
            // The value will be set to the target state's input, if the input with same name set `user_input=false`
            image: '{{payload.image}}',
            video: '{{payload.video}}',
          },
        },
      },
    },
    transform_to_retry_style_state: {
      type: 'state', // 改为required @new
      inputs: {
        image: {
          type: 'image',
          user_input: false,
        },
        video: {
          type: 'video',
          user_input: false,
        },
      },
      outputs: {
        // reset the global variable for a second try.
        'context.image': '{{image}}',
        'context.selected_video': '{{video}}',
      },
      transitions: {
        ALWAYS: 'functional_state',
      },
    },
  },
} satisfies Automata;
