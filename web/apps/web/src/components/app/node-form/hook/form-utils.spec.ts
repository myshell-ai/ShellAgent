import { FormRef } from '@shellagent/ui';

import {
  DiffTypeEnum,
  getDiffPath,
  replaceKey,
  getNewKey,
  getExisiedKey,
} from './form-utils';

describe('form-utils', () => {
  describe('replaceKey', () => {
    let mockFormRef: { current: Partial<FormRef> };

    beforeEach(() => {
      mockFormRef = {
        current: {
          getValues: jest.fn(),
          setValue: jest.fn(),
        },
      };
    });

    it('should correctly replace key for simple value', () => {
      mockFormRef.current.getValues = jest.fn().mockReturnValue({
        oldKey: 'value',
        other: 'otherValue',
      });

      replaceKey(mockFormRef as any, {
        parentPath: 'parent',
        oldKey: 'oldKey',
        newKey: 'newKey',
      });

      expect(mockFormRef.current.setValue).toHaveBeenCalledWith('parent', {
        newKey: 'value',
        other: 'otherValue',
      });
    });

    it('should merge object values', () => {
      mockFormRef.current.getValues = jest.fn().mockReturnValue({
        oldKey: { existing: 'value' },
      });

      replaceKey(mockFormRef as any, {
        parentPath: 'parent',
        oldKey: 'oldKey',
        newKey: 'newKey',
        value: { new: 'value' },
      });

      expect(mockFormRef.current.setValue).toHaveBeenCalledWith('parent', {
        newKey: { existing: 'value', new: 'value' },
      });
    });
  });

  describe('getDiffPath Context', () => {
    // context

    // add
    it('context add from empty', () => {
      const oldValue = {};
      const newValue = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_context_1',
          type: DiffTypeEnum.Added,
          newValue: newValue.untitled_context_1,
        },
      ]);
    });

    it('context add from non-empty', () => {
      const oldValue = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
      };

      const newValue = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
        untitled_context_2: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_context_2',
          type: DiffTypeEnum.Added,
          newValue: newValue.untitled_context_2,
        },
      ]);
    });

    // delete
    it('context delete from non-empty', () => {
      const oldValue = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
        untitled_context_2: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
      };
      const newValue = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_context_2',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue.untitled_context_2,
        },
      ]);
    });

    it('context delete to empty', () => {
      const oldValue = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
      };
      const newValue = {};

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_context_1',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue.untitled_context_1,
        },
      ]);
    });

    // modify
    it('context modified to non-empty', () => {
      const oldValue = {
        type: 'text',
        value: '',
        name: 'aaaa',
      };
      const newValue = {
        type: 'text',
        value: '',
        name: 'ccccc',
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'name',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue.name,
          newValue: newValue.name,
        },
      ]);
    });

    it('context modified to empty', () => {
      const oldValue = {
        '4': {
          name: '4',
          type: 'text',
          user_input: true,
        },
        '12': {
          name: '12',
          type: 'text',
          user_input: true,
        },
        '111': {
          name: '111',
          type: 'text',
          user_input: true,
        },
      };
      const newValue = {
        '4': {
          name: '4',
          type: 'text',
          user_input: true,
        },
        '12': {
          name: '12',
          type: 'text',
          user_input: true,
        },
        '111': {
          name: '',
          type: 'text',
          user_input: true,
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '111.name',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue['111'].name,
          newValue: newValue['111'].name,
        },
      ]);
    });

    it('context rename', () => {
      const oldValue = {
        test_context: {
          type: 'text',
          value: '',
          name: 'test context1',
        },
      };
      const newValue = {
        test_context1: {
          type: 'text',
          value: '',
          name: 'test context1',
        },
      };
      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'test_context',
          type: DiffTypeEnum.Renamed,
          oldValue: oldValue.test_context,
          newValue: newValue.test_context1,
        },
      ]);
    });
  });

  describe('getDiffPath Inputs', () => {
    // add
    it('inputs add from empty', () => {
      const oldValue = {};
      const newValue = {
        untitled_input_2: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_input_2',
          type: DiffTypeEnum.Added,
          newValue: newValue.untitled_input_2,
        },
      ]);
    });

    it('inputs add from non-empty', () => {
      const oldValue = {
        untitled_input_2: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
      };
      const newValue = {
        untitled_input_2: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
        untitled_input_3: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_input_3',
          type: DiffTypeEnum.Added,
          newValue: newValue.untitled_input_3,
        },
      ]);
    });

    it('inputs delete from non-empty', () => {
      const oldValue = {
        untitled_input_2: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
        untitled_input_3: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
      };
      const newValue = {
        untitled_input_2: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_input_3',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue.untitled_input_3,
        },
      ]);
    });

    it('inputs delete to empty', () => {
      const oldValue = {
        untitled_input_2: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
      };
      const newValue = {};

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_input_2',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue.untitled_input_2,
        },
      ]);
    });

    it('inputs modified to non-empty', () => {
      const oldValue = {
        untitled_input_5: {
          name: 'tes',
          type: 'text',
          user_input: true,
          source: 'form',
        },
      };
      const newValue = {
        untitled_input_5: {
          name: 'test',
          type: 'text',
          user_input: true,
          source: 'form',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_input_5.name',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue.untitled_input_5.name,
          newValue: newValue.untitled_input_5.name,
        },
      ]);
    });

    it('inputs modified to empty', () => {
      const oldValue = {
        untitled_input_5: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
          source: 'form',
        },
      };
      const newValue = {
        untitled_input_5: {
          name: '',
          type: 'text',
          user_input: true,
          source: 'form',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_input_5.name',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue.untitled_input_5.name,
          newValue: newValue.untitled_input_5.name,
        },
      ]);
    });

    it('inputs modified boolean', () => {
      const oldValue = {
        untitled_input_10: {
          name: 'Untitled Input',
          type: 'text',
          user_input: true,
        },
      };
      const newValue = {
        untitled_input_10: {
          name: 'Untitled Input',
          type: 'text',
          user_input: false,
        },
      };
      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_input_10.user_input',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue.untitled_input_10.user_input,
          newValue: newValue.untitled_input_10.user_input,
        },
      ]);
    });

    it('inputs rename', () => {
      const oldValue = {
        untitled_input_5: {
          name: 'test',
          type: 'text',
          user_input: true,
          source: 'form',
        },
      };
      const newValue = {
        test: {
          name: 'test',
          type: 'text',
          user_input: true,
          source: 'form',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_input_5',
          type: DiffTypeEnum.Renamed,
          oldValue: oldValue.untitled_input_5,
          newValue: newValue.test,
        },
      ]);
    });
  });

  describe('getDiffPath Tasks', () => {
    it('tasks add from empty', () => {
      const oldValue: any[] = [];
      const newValue = [
        {
          type: 'task',
          display_name: 'ComfyUI#1',
          name: 'comfy_ui_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          custom: true,
          widget_class_name: 'ComfyUIWidget',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '0',
          type: DiffTypeEnum.Added,
          newValue: newValue[0],
        },
      ]);
    });

    it('tasks add from non-empty', () => {
      const oldValue: any[] = [
        {
          type: 'task',
          display_name: 'ComfyUI#1',
          name: 'comfy_ui_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          custom: true,
          widget_class_name: 'ComfyUIWidget',
        },
      ];
      const newValue = [
        {
          type: 'task',
          display_name: 'ComfyUI#1',
          name: 'comfy_ui_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          custom: true,
          widget_class_name: 'ComfyUIWidget',
        },
        {
          type: 'task',
          display_name: 'GPT#1',
          name: 'gpt_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          widget_class_name: 'GPTWidget',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '1',
          type: DiffTypeEnum.Added,
          newValue: newValue[1],
        },
      ]);
    });

    it('tasks delete from non-empty', () => {
      const oldValue = [
        {
          api: '',
          comfy_workflow_id: 'a65adc8b35b341c3a742d57265e9cf55',
          type: 'task',
          display_name: 'ComfyUI#1',
          name: 'comfy_ui_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          custom: true,
          widget_class_name: 'ComfyUIWidget',
        },
        {
          type: 'task',
          display_name: 'GPT#1',
          name: 'gpt_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          widget_class_name: 'GPTWidget',
        },
      ];
      const newValue = [
        {
          api: '',
          comfy_workflow_id: 'a65adc8b35b341c3a742d57265e9cf55',
          type: 'task',
          display_name: 'ComfyUI#1',
          name: 'comfy_ui_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          custom: true,
          widget_class_name: 'ComfyUIWidget',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '1',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue[1],
        },
      ]);
    });

    it('tasks delete from empty', () => {
      const oldValue = [
        {
          api: '',
          comfy_workflow_id: 'a65adc8b35b341c3a742d57265e9cf55',
          type: 'task',
          display_name: 'ComfyUI#1',
          name: 'comfy_ui_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          custom: true,
          widget_class_name: 'ComfyUIWidget',
        },
      ];
      const newValue: any[] = [];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '0',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue[0],
        },
      ]);
    });

    it('tasks rename', () => {
      const oldValue = {
        id: 'state_1',
        type: 'state',
        name: 'State#1',
        render: {
          text: '',
        },
        inputs: {
          input: {
            name: 'input',
            type: 'text',
            user_input: true,
          },
          untitled_input_9: {
            name: 'Untitled Input',
            type: 'text',
            user_input: true,
          },
        },
        outputs: {
          untitled_output_1: {
            type: 'text',
            value: '{{ __context__untitled_context_4__ }}',
            name: 'Untitled Output',
          },
        },
        blocks: [
          {
            inputs: {
              model: 'gpt-4o',
              system_prompt: '{{ untitled_input_1 }}',
              user_prompt: '{{ __context__1__ }}',
              input_image: '12345',
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
            render: null,
            type: 'task',
            display_name: 'GPT#1',
            name: 'gpt_1',
            mode: 'widget',
            widget_class_name: 'GPTWidget',
          },
        ],
      };
      const newValue = {
        id: 'state_1',
        type: 'state',
        name: 'State#1',
        render: {
          text: '',
        },
        inputs: {
          input: {
            name: 'input',
            type: 'text',
            user_input: true,
          },
          untitled_input_9: {
            name: 'Untitled Input',
            type: 'text',
            user_input: true,
          },
        },
        outputs: {
          untitled_output_1: {
            type: 'text',
            value: '{{ __context__untitled_context_4__ }}',
            name: 'Untitled Output',
          },
        },
        blocks: [
          {
            inputs: {
              model: 'gpt-4o',
              system_prompt: '{{ untitled_input_1 }}',
              user_prompt: '{{ __context__test_context__ }}',
              input_image: '12345',
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
            render: null,
            type: 'task',
            display_name: 'GPT#1',
            name: 'gpt_1',
            mode: 'widget',
            widget_class_name: 'GPTWidget',
          },
        ],
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'blocks.0.inputs.user_prompt',
          type: DiffTypeEnum.Modified,
          oldValue: '{{ __context__1__ }}',
          newValue: '{{ __context__test_context__ }}',
        },
      ]);
    });

    it('tasks reordered', () => {
      const oldValue = [
        {
          inputs: {
            model: 'gpt-4o',
            system_prompt: '',
            user_prompt: '',
            input_image: '1',
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
          render: null,
          type: 'task',
          display_name: 'gpt4',
          name: 'gpt4',
          mode: 'widget',
          widget_class_name: 'GPTWidget',
        },
        {
          type: 'task',
          display_name: 'Twitter#1',
          name: 'twitter_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          widget_name: '@myshell/1784206090390036480',
          widget_class_name: 'XWidget',
        },
      ];
      const newValue = [
        {
          type: 'task',
          display_name: 'Twitter#1',
          name: 'twitter_1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          widget_name: '@myshell/1784206090390036480',
          widget_class_name: 'XWidget',
        },
        {
          inputs: {
            model: 'gpt-4o',
            system_prompt: '',
            user_prompt: '',
            input_image: '1',
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
          render: null,
          type: 'task',
          display_name: 'gpt4',
          name: 'gpt4',
          mode: 'widget',
          widget_class_name: 'GPTWidget',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '',
          type: DiffTypeEnum.Reordered,
          oldValue,
          newValue,
          fromIndex: 1,
          toIndex: 0,
        },
      ]);
    });
  });

  describe('getDiffPath Ouputs', () => {
    // add
    it('outputs add from empty', () => {
      const oldValue = {};
      const newValue = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled Context',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_context_1',
          type: DiffTypeEnum.Added,
          newValue: newValue.untitled_context_1,
        },
      ]);
    });

    it('outputs add from non-empty', () => {
      const oldValue = {
        untitled_output_1: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
      };

      const newValue = {
        untitled_output_1: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
        untitled_output_2: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_output_2',
          type: DiffTypeEnum.Added,
          newValue: newValue.untitled_output_2,
        },
      ]);
    });

    // delete
    it('outputs delete from non-empty', () => {
      const oldValue = {
        untitled_output_1: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
        untitled_output_2: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
      };
      const newValue = {
        untitled_output_1: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_output_2',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue.untitled_output_2,
        },
      ]);
    });

    it('outputs delete to empty', () => {
      const oldValue = {
        untitled_output_1: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
      };
      const newValue = {};

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_output_1',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue.untitled_output_1,
        },
      ]);
    });

    // modify
    it('outputs modified to non-empty', () => {
      const oldValue = {
        untitled_output_3: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
      };
      const newValue = {
        untitled_output_3: {
          type: 'text',
          value: '{{ __context__1__ }}',
          name: 'Untitled Output',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_output_3.value',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue.untitled_output_3.value,
          newValue: newValue.untitled_output_3.value,
        },
      ]);
    });

    it('outputs modified to empty', () => {
      const oldValue = {
        untitled_output_3: {
          type: 'text',
          value: '{{ __context__1__ }}',
          name: 'Untitled Output',
        },
      };
      const newValue = {
        untitled_output_3: {
          type: 'text',
          value: '',
          name: 'Untitled Output',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: 'untitled_output_3.value',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue.untitled_output_3.value,
          newValue: newValue.untitled_output_3.value,
        },
      ]);
    });

    it('outputs rename', () => {
      const oldValue = {
        '222': {
          type: 'text',
          value: '',
          name: '333',
          name_mode: 'ui',
        },
      };
      const newValue = {
        '333': {
          type: 'text',
          value: '',
          name: '333',
          name_mode: 'ui',
        },
      };
      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '222',
          type: DiffTypeEnum.Renamed,
          oldValue: oldValue['222'],
          newValue: newValue['333'],
        },
      ]);
    });

    it('outputs rename context', () => {
      const oldValue = {
        __context__1__: {
          type: 'text',
          value: '',
          name: '{{ __context__1__ }}',
          name_mode: 'ref',
        },
      };
      const newValue = {
        __context__2__: {
          type: 'text',
          value: '',
          name: '{{ __context__2__ }}',
          name_mode: 'ref',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '__context__1__',
          type: DiffTypeEnum.Renamed,
          /* eslint-disable no-underscore-dangle, func-names */
          oldValue: oldValue.__context__1__,
          /* eslint-disable no-underscore-dangle, func-names */
          newValue: newValue.__context__2__,
        },
      ]);
    });
  });

  describe('getDiffPath Render Buttons', () => {
    it('buttons add', () => {
      const oldValue = [
        {
          content: 'button1',
          on_click: {
            event: 'button_1.on_click',
            payload: {},
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];
      const newValue = [
        {
          content: 'button1',
          on_click: {
            event: 'button_1.on_click',
            payload: {},
          },
          id: 'button_1.on_click',
          description: '',
        },
        {
          content: 'Button#1',
          on_click: {
            event: 'button_1.on_click',
            payload: {},
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '1',
          type: DiffTypeEnum.Added,
          newValue: newValue[1],
        },
      ]);
    });

    it('buttons delete', () => {
      const oldValue = [
        {
          content: 'Button#1',
          on_click: {
            event: 'button_1.on_click',
            payload: {},
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];
      const newValue: any[] = [];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '0',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue[0],
        },
      ]);
    });

    it('buttons modified value', () => {
      const oldValue = [
        {
          content: 'Button#1',
          on_click: {
            event: 'button_1.on_click',
            payload: {},
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];
      const newValue = [
        {
          content: 'Button#1',
          on_click: {
            event: 'button_1.on_click',
            payload: {},
          },
          id: 'button_1.on_click',
          description: '123',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '0.description',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue[0].description,
          newValue: newValue[0].description,
        },
      ]);
    });

    it('buttons rename', () => {
      const oldValue = [
        {
          content: '12',
          on_click: {
            event: 'button_1.on_click',
            payload: {
              untitled_payload_1: {
                type: 'text',
                value: '',
                name: 'Untitled Payload',
              },
            },
          },
          id: 'button_1.on_click',
          description: '123',
        },
      ];

      const newValue = [
        {
          content: '123',
          on_click: {
            event: 'button_1.on_click',
            payload: {
              untitled_payload_1: {
                type: 'text',
                value: '',
                name: 'Untitled Payload',
              },
            },
          },
          id: 'button_1.on_click',
          description: '123',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '0.content',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue[0].content,
          newValue: newValue[0].content,
        },
      ]);
    });

    it('buttons payload add', () => {
      const oldValue = [
        {
          content: 'click',
          on_click: {
            event: 'button_1.on_click',
            payload: {},
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];
      const newValue = [
        {
          content: 'click',
          on_click: {
            event: 'button_1.on_click',
            payload: {
              untitled_payload_2: {
                type: 'text',
                value: '',
                name: 'Untitled Payload',
              },
            },
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '0.on_click.payload.untitled_payload_2',
          type: DiffTypeEnum.Added,
          newValue: newValue[0].on_click.payload.untitled_payload_2,
        },
      ]);
    });

    it('buttons payload delete', () => {
      const oldValue = [
        {
          content: 'click',
          on_click: {
            event: 'button_1.on_click',
            payload: {
              untitled_payload_2: {
                type: 'text',
                value: '',
                name: 'Untitled Payload',
              },
            },
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];

      const newValue = [
        {
          content: 'click',
          on_click: {
            event: 'button_1.on_click',
            payload: {},
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '0.on_click.payload.untitled_payload_2',
          type: DiffTypeEnum.Deleted,
          oldValue: oldValue[0].on_click.payload.untitled_payload_2,
        },
      ]);
    });

    it('buttons payload rename', () => {
      const oldValue = [
        {
          content: 'click',
          on_click: {
            event: 'button_1.on_click',
            payload: {
              untitled_payload_3: {
                type: 'text',
                value: '',
                name: 'payload',
              },
            },
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];

      const newValue = [
        {
          content: 'click',
          on_click: {
            event: 'button_1.on_click',
            payload: {
              untitled_payload_3: {
                type: 'text',
                value: '',
                name: 'payload test',
              },
            },
          },
          id: 'button_1.on_click',
          description: '',
        },
      ];

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '0.on_click.payload.untitled_payload_3.name',
          type: DiffTypeEnum.Modified,
          oldValue: oldValue[0].on_click.payload.untitled_payload_3.name,
          newValue: newValue[0].on_click.payload.untitled_payload_3.name,
        },
      ]);
    });
  });

  describe('getNewKey', () => {
    it('context empty name', () => {
      const context = {
        '1': {
          type: 'text',
          value: '',
          name: '1',
        },
        '1_4': {
          type: 'text',
          value: '',
          name: '1',
        },
        untitled_context_1: {
          type: 'text',
          value: '',
          name: '1',
        },
      };
      const result = getNewKey({
        name: '1',
        nameKey: 'name',
        values: context,
        prefix: 'Context',
      });
      expect(result).toEqual({
        name: '1',
        key: '1_5',
      });
    });

    it('should handle empty values object', () => {
      const context = {};
      const result = getNewKey({
        name: 'test',
        nameKey: 'name',
        values: context,
        prefix: 'Context',
      });
      expect(result).toEqual({
        name: 'test',
        key: 'test',
      });
    });

    it('should handle untitled name', () => {
      const context = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled',
        },
        untitled_context_2: {
          type: 'text',
          value: '',
          name: 'Untitled',
        },
      };
      const result = getNewKey({
        name: 'Untitled',
        nameKey: 'name',
        values: context,
        prefix: 'Context',
      });
      expect(result).toEqual({
        name: 'Untitled',
        key: 'untitled_context_3',
      });
    });

    it('should handle empty name input', () => {
      const context = {
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'Untitled',
        },
      };
      const result = getNewKey({
        name: '',
        nameKey: 'name',
        values: context,
        prefix: 'Context',
      });
      expect(result).toEqual({
        name: 'Untitled',
        key: 'untitled_context_2',
      });
    });

    it('should handle non-sequential numbers', () => {
      const context = {
        test_1: {
          type: 'text',
          value: '',
          name: 'test',
        },
        test_3: {
          type: 'text',
          value: '',
          name: 'test',
        },
        test_7: {
          type: 'text',
          value: '',
          name: 'test',
        },
      };
      const result = getNewKey({
        name: 'test',
        nameKey: 'name',
        values: context,
        prefix: 'Context',
      });
      expect(result).toEqual({
        name: 'test',
        key: 'test_8',
      });
    });

    it('should handle mixed format keys', () => {
      const context = {
        test: {
          type: 'text',
          value: '',
          name: 'test',
        },
        test_1: {
          type: 'text',
          value: '',
          name: 'test',
        },
        untitled_context_1: {
          type: 'text',
          value: '',
          name: 'test',
        },
      };
      const result = getNewKey({
        name: 'test',
        nameKey: 'name',
        values: context,
        prefix: 'Context',
      });
      expect(result).toEqual({
        name: 'test',
        key: 'test_2',
      });
    });

    it('should handle special characters in name', () => {
      const context = {
        test_special_1: {
          type: 'text',
          value: '',
          name: 'Test Special!@#',
        },
      };
      const result = getNewKey({
        name: 'Test Special!@#',
        nameKey: 'name',
        values: context,
        prefix: 'Context',
      });
      expect(result).toEqual({
        name: 'Test Special!@#',
        key: 'test_special_2',
      });
    });

    it('should handle mixed numeric and untitled names', () => {
      const inputs = {
        '1': {
          name: '1',
          type: 'text',
          user_input: true,
        },
        '1_1': {
          name: '1',
          type: 'text',
          user_input: true,
        },
        '1_2': {
          name: '',
          type: 'text',
          user_input: true,
        },
      };

      const result = getNewKey({
        name: '',
        nameKey: 'name',
        values: inputs,
        prefix: 'Input',
      });

      expect(result).toEqual({
        name: 'Untitled',
        key: 'untitled_input_1',
      });
    });

    it('should handle untitled name with prefix', () => {
      const context = {
        '1': {
          type: 'text',
          value: '',
          name: '1',
        },
        '1_1': {
          type: 'text',
          value: '',
          name: '1',
        },
        untitled_context_1: {
          type: 'text',
          value: '',
          name: '1',
        },
      };
      const result = getNewKey({
        name: '2',
        nameKey: 'name',
        values: context,
        prefix: 'Context',
      });
      expect(result).toEqual({
        name: '2',
        key: '2',
      });
    });
  });

  describe('getExisiedKey', () => {
    it('should find key in array values', () => {
      const values = [
        { name: 'test1', value: 1 },
        { name: 'test2', value: 2 },
      ];

      const result = getExisiedKey({ values, name: 'test2' });
      expect(result).toBe('test2');
    });

    it('should return undefined if name not found in array', () => {
      const values = [
        { name: 'test1', value: 1 },
        { name: 'test2', value: 2 },
      ];

      const result = getExisiedKey({ values, name: 'test3' });
      expect(result).toBeUndefined();
    });

    it('should find key in object values', () => {
      const values = {
        key1: { name: 'test1', value: 1 },
        key2: { name: 'test2', value: 2 },
      };

      const result = getExisiedKey({ values, name: 'test2' });
      expect(result).toBe('key2');
    });

    it('should return undefined if name not found in object', () => {
      const values = {
        key1: { name: 'test1', value: 1 },
        key2: { name: 'test2', value: 2 },
      };

      const result = getExisiedKey({ values, name: 'test3' });
      expect(result).toBeUndefined();
    });

    it('should handle empty values', () => {
      expect(getExisiedKey({ values: [], name: 'test' })).toBeUndefined();
      expect(getExisiedKey({ values: {}, name: 'test' })).toBeUndefined();
    });
  });
});
