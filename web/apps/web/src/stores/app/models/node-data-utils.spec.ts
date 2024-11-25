import {
  processNestedObject,
  handleRemoveRefOpts,
  handleRemoveRefOptsPrefix,
  handleRenameRefOpt,
  handleRemoveState,
  handleReorderTask,
} from './node-data-utils';

describe('node-data-utils', () => {
  describe('processNestedObject', () => {
    it('应该正确处理嵌套对象', () => {
      const testObj = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      };

      const result: any[] = [];
      processNestedObject(testObj, (value, key) => {
        result.push({ key, value });
      });

      expect(result).toEqual([
        { key: 'a', value: 1 },
        { key: 'b', value: { c: 2, d: { e: 3 } } },
        { key: 'c', value: 2 },
        { key: 'd', value: { e: 3 } },
        { key: 'e', value: 3 },
      ]);
    });
  });

  describe('handleRemoveRefOpts', () => {
    it('应该移除指定的引用选项', () => {
      const nodeData = {
        state1: {
          outputs: '{{ var2 }}',
          nested: {
            field3: '{{ var1 }}',
          },
        },
      };

      handleRemoveRefOpts(nodeData, ['state1.inputs.var1']);

      expect(nodeData.state1.outputs).toBe('{{ var2 }}');
      expect(nodeData.state1.nested.field3).toBe('');
    });
  });

  describe('handleRemoveRefOptsPrefix', () => {
    it('应该移除带有指定前缀的引用选项', () => {
      const nodeData = {
        state1: {
          field1: '{{ user.name }}',
          field2: '{{ user.age }}',
          field3: '{{ other }}',
        },
      };

      handleRemoveRefOptsPrefix(nodeData, ['state1.user']);

      expect(nodeData.state1.field1).toBe('');
      expect(nodeData.state1.field2).toBe('');
      expect(nodeData.state1.field3).toBe('{{ other }}');
    });
  });

  describe('handleRenameRefOpt', () => {
    it('应该正确重命名引用选项', () => {
      const nodeData = {
        state1: {
          outputs: '{{ oldVar }}',
          nested: {
            field3: '{{ oldVar }}',
          },
        },
      };

      handleRenameRefOpt(
        nodeData,
        'state1.inputs.oldVar',
        'state1.inputs.newVar',
      );

      expect(nodeData.state1.outputs).toBe('{{ newVar }}');
      expect(nodeData.state1.nested.field3).toBe('{{ newVar }}');
    });

    it('应该正确处理带有前缀的重命名', () => {
      const nodeData = {
        '@@@start': {
          id: '@@@start',
          type: 'start',
          context: {
            untitled_context_1: {
              type: 'text',
              value: '',
              name: 'Untitled',
            },
          },
        },
        state1: {
          id: 'state1',
          type: 'state',
          name: 'State#1',
          render: {},
          inputs: {},
          outputs: {
            untitled_outputs_1: {
              type: 'text',
              value: '{{ gpt1.reply }}',
              name: 'Untitled',
            },
          },
          blocks: [
            {
              type: 'task',
              display_name: 'GPT#1',
              name: '123',
              mode: 'widget',
              inputs: {
                model: 'gpt-4o',
                system_prompt: '',
                user_prompt: '',
                input_image: null,
                memory: [],
                function_parameters: [],
                memory_mode: 'auto',
                temperature: 0.7,
                top_p: 1,
                max_tokens: null,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 0,
                callback: null,
                widget_run_id: null,
                function_name: 'any_function_name',
                function_description: 'any_function_description',
              },
              outputs: {
                display: {
                  reply: 'string|object',
                },
              },
              widget_class_name: 'GPTWidget',
              render: null,
            },
          ],
        },
      };

      handleRenameRefOpt(
        nodeData,
        'state1.blocks.gpt1',
        'state1.blocks.123',
        true,
      );

      expect(nodeData).toStrictEqual({
        '@@@start': {
          id: '@@@start',
          type: 'start',
          context: {
            untitled_context_1: {
              type: 'text',
              value: '',
              name: 'Untitled',
            },
          },
        },
        state1: {
          id: 'state1',
          type: 'state',
          name: 'State#1',
          render: {},
          inputs: {},
          outputs: {
            untitled_outputs_1: {
              type: 'text',
              value: '{{ 123.reply }}',
              name: 'Untitled',
            },
          },
          blocks: [
            {
              type: 'task',
              display_name: 'GPT#1',
              name: '123',
              mode: 'widget',
              inputs: {
                model: 'gpt-4o',
                system_prompt: '',
                user_prompt: '',
                input_image: null,
                memory: [],
                function_parameters: [],
                memory_mode: 'auto',
                temperature: 0.7,
                top_p: 1,
                max_tokens: null,
                stream: false,
                presence_penalty: 0,
                frequency_penalty: 0,
                callback: null,
                widget_run_id: null,
                function_name: 'any_function_name',
                function_description: 'any_function_description',
              },
              outputs: {
                display: {
                  reply: 'string|object',
                },
              },
              widget_class_name: 'GPTWidget',
              render: null,
            },
          ],
        },
      });
      // expect(nodeData.state1.blocks[0].name).toBe('xxx');
    });
  });

  describe('rename context', () => {
    it('应该正确重命名引用选项', () => {
      const nodeData = {
        '@@@start': {
          id: '@@@start',
          type: 'start',
          context: {
            untitled1: {
              type: 'text',
              value: '',
              name: 'Untitled1',
            },
          },
        },
        state1: {
          id: 'state1',
          type: 'state',
          name: 'State#1',
          render: {},
          inputs: {
            '1234': {
              name: '1234',
              type: 'text',
              user_input: true,
            },
          },
          outputs: {
            '12345': {
              type: 'image',
              value: '{{ __context__untitled1__ }}',
              name: '12345',
            },
          },
          blocks: [],
        },
      };

      handleRenameRefOpt(
        nodeData,
        '@@@start.__context__untitled1__',
        '@@@start.__context__image__',
      );

      expect(nodeData.state1.outputs['12345'].value).toBe(
        '{{ __context__image__ }}',
      );
    });
  });

  describe('handleRemoveState', () => {
    it('应该移除指定状态的所有引用', () => {
      const nodeData = {
        state1: {
          field1: '{{ removedState.field }}',
          type: 'normal',
        },
        state2: {
          field2: '{{ removedState.nested.field }}',
          type: 'state',
        },
        removedState: {
          field: 'value',
          type: 'state',
        },
      };

      handleRemoveState(nodeData, 'removedState');

      expect(nodeData.state1.field1).toBe('');
      expect(nodeData.state2.field2).toBe('');
    });
  });

  describe('handleReorderTask', () => {
    it('当任务顺序改变时应该正确处理引用', () => {
      const nodeData = {
        state1: {
          blocks: [
            {
              name: 'twitter1',
              inputs: {
                query: '{{ gpt1.reply }}',
                action: 'scrape_tweets',
              },
              outputs: {
                display: {
                  data: 'string|array',
                },
              },
            },
            {
              name: 'gpt1',
              inputs: {
                user_prompt: '{{ twitter1.data }}',
              },
              outputs: {
                display: {
                  reply: 'string|object',
                },
              },
            },
          ],
        },
      };

      handleReorderTask(
        nodeData,
        'state1',
        ['twitter1', 'gpt1'], // 新顺序
        ['gpt1', 'twitter1'], // 原顺序
      );

      // twitter1 引用了 gpt1，但 gpt1 现在在后面，所以应该被清除
      expect(nodeData.state1.blocks[0].inputs.query).toBe('');
      // gpt1 引用了 twitter1，twitter1 现在在前面，所以应该保留
      expect(nodeData.state1.blocks[1].inputs.user_prompt).toBe(
        '{{ twitter1.data }}',
      );
    });

    it('应该处理复杂的嵌套路径引用', () => {
      const nodeData = {
        state1: {
          blocks: [
            {
              name: 'task1',
              inputs: {
                nested: {
                  field: '{{ task2.outputs.data.nested.field }}',
                },
              },
            },
            {
              name: 'task2',
              inputs: {
                nested: {
                  field: '{{ task1.outputs.data.nested.field }}',
                },
              },
            },
          ],
        },
      };

      handleReorderTask(
        nodeData,
        'state1',
        ['task1', 'task2'],
        ['task2', 'task1'],
      );

      expect(nodeData.state1.blocks[0].inputs.nested.field).toBe('');
      expect(nodeData.state1.blocks[1].inputs.nested.field).toBe(
        '{{ task1.outputs.data.nested.field }}',
      );
    });

    it('应该处理多个引用的情况', () => {
      const nodeData = {
        state1: {
          blocks: [
            {
              name: 'task1',
              inputs: {
                query: '{{ task2.data.field1 }} and {{ task2.data.field2 }}',
              },
            },
            {
              name: 'task2',
              inputs: {
                query: '{{ task1.data.field1 }} and {{ task1.data.field2 }}',
              },
            },
          ],
        },
      };

      handleReorderTask(
        nodeData,
        'state1',
        ['task1', 'task2'],
        ['task2', 'task1'],
      );

      expect(nodeData.state1.blocks[0].inputs.query).toBe('');
      expect(nodeData.state1.blocks[1].inputs.query).toBe(
        '{{ task1.data.field1 }} and {{ task1.data.field2 }}',
      );
    });

    it('应该处理不存在的任务引用', () => {
      const nodeData = {
        state1: {
          blocks: [
            {
              name: 'task1',
              inputs: {
                query: '{{ nonexistent.data }}',
              },
            },
            {
              name: 'task2',
              inputs: {
                query: '{{ task1.data }}',
              },
            },
          ],
        },
      };

      handleReorderTask(
        nodeData,
        'state1',
        ['task1', 'task2'],
        ['task1', 'task2'],
      );

      expect(nodeData.state1.blocks[0].inputs.query).toBe('');
      expect(nodeData.state1.blocks[1].inputs.query).toBe('{{ task1.data }}');
    });

    it('应该保留之前合法的引用关系', () => {
      const nodeData = {
        state1_copy2: {
          blocks: [
            {
              type: 'task',
              display_name: 'Twitter#1',
              name: 'twitter1',
              mode: 'widget',
              inputs: {
                action: 'scrape_tweets',
                query: '{{ gpt1.reply }}',
                sort_order: 'relevancy',
                twitter_handle: '',
              },
              outputs: {
                display: {
                  data: 'string|array',
                },
              },
            },
            {
              type: 'task',
              display_name: 'GPT#1',
              name: 'gpt1',
              mode: 'widget',
              inputs: {
                model: 'gpt-4',
                user_prompt: '{{ twitter1.data }}',
              },
              outputs: {
                display: {
                  reply: 'string|object',
                },
              },
            },
          ],
        },
      };

      handleReorderTask(
        nodeData,
        'state1_copy2',
        ['twitter1', 'gpt1'], // 新顺序
        ['gpt1', 'twitter1'], // 原顺序
      );

      // twitter1 引用了 gpt1，但 gpt1 现在在后面，所以应该被清除
      expect(nodeData.state1_copy2.blocks[0].inputs.query).toBe('');
      // gpt1 引用了 twitter1，twitter1 现在在前面，所以应该保留
      expect(nodeData.state1_copy2.blocks[1].inputs.user_prompt).toBe(
        '{{ twitter1.data }}',
      );
    });
  });
});
