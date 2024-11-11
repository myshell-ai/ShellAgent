import { FormRef } from '@shellagent/ui';
import { DiffTypeEnum, getDiffPath, replaceKey } from './form-utils';

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
        '3': {
          type: 'text',
          value: '2',
          name: '3',
        },
        '1111': {
          type: 'text',
          value: '',
          name: 'aaaaa',
        },
      };
      const newValue = {
        '3': {
          type: 'text',
          value: '2',
          name: '3',
        },
        aaaaa: {
          type: 'text',
          value: '',
          name: 'aaaaa',
        },
      };

      const result = getDiffPath(oldValue, newValue);

      expect(result).toEqual([
        {
          path: '1111',
          type: DiffTypeEnum.Renamed,
          oldValue: oldValue['1111'],
          newValue: newValue.aaaaa,
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
          oldValue: oldValue['untitled_input_3'],
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
          oldValue: oldValue['untitled_input_2'],
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
          oldValue: oldValue['untitled_input_5'].name,
          newValue: newValue['untitled_input_5'].name,
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
          oldValue: oldValue['untitled_input_5'].name,
          newValue: newValue['untitled_input_5'].name,
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
          oldValue: oldValue['untitled_input_10'].user_input,
          newValue: newValue['untitled_input_10'].user_input,
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
          oldValue: oldValue['untitled_input_5'],
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
          oldValue: oldValue,
          newValue: newValue,
          fromIndex: 0,
          toIndex: 1,
        },
      ]);
    });
  });
});
