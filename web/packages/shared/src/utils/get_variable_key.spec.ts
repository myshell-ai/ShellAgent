import { getNewKey, getExisiedKey } from './get_variable_key';

describe('form-utils', () => {
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

    it('should handle Chinese characters in name', () => {
      const values = [
        {
          api: '',
          comfy_workflow_id: 'd5ce4bf9fa4942a980e7391e407f7f14',
          type: 'task',
          display_name: 'ComfyUI#1',
          name: 'comfy_ui1',
          mode: 'widget',
          inputs: {},
          outputs: {},
          custom: true,
          widget_class_name: 'ComfyUIWidget',
        },
      ];

      const result = getNewKey({
        name: '你好😂',
        nameKey: 'name',
        values,
        prefix: 'Blocks',
      });

      expect(result).toEqual({
        name: '你好😂',
        key: 'untitled_blocks_1',
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
