import {
  processNestedObject,
  handleRemoveRefOpts,
  handleRemoveRefOptsPrefix,
  handleRenameRefOpt,
  handleRemoveState,
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
          field1: '{{ var1 }}',
          field2: '{{ var2 }}',
          nested: {
            field3: '{{ var1 }}',
          },
        },
      };

      handleRemoveRefOpts(nodeData, ['state1.var1']);

      expect(nodeData.state1.field1).toBe('');
      expect(nodeData.state1.field2).toBe('{{ var2 }}');
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
          field1: '{{ oldVar }}',
          field2: 'static text',
          nested: {
            field3: '{{ oldVar }}',
          },
        },
      };

      handleRenameRefOpt(nodeData, 'state1.oldVar', 'state1.newVar');

      expect(nodeData.state1.field1).toBe('{{ newVar }}');
      expect(nodeData.state1.field2).toBe('static text');
      expect(nodeData.state1.nested.field3).toBe('{{ newVar }}');
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
});
