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

    it('应该正确替换简单值的 key', () => {
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

    it('应该合并对象值', () => {
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

  describe('getDiffPath', () => {
    it('应该检测新增的字段', () => {
      const source = { a: 1 };
      const target = { a: 1, b: 2 };

      const result = getDiffPath(source, target);

      expect(result).toEqual([
        {
          path: 'b',
          type: DiffTypeEnum.Added,
          newValue: 2,
        },
      ]);
    });

    it('应该检测删除的字段', () => {
      const source = { a: 1, b: 2 };
      const target = { a: 1 };

      const result = getDiffPath(source, target);

      expect(result).toEqual([
        {
          path: 'b',
          type: DiffTypeEnum.Deleted,
          oldValue: 2,
        },
      ]);
    });

    it('应该检测修改的字段', () => {
      const source = { a: 1 };
      const target = { a: 2 };

      const result = getDiffPath(source, target);

      expect(result).toEqual([
        {
          path: 'a',
          type: DiffTypeEnum.Modified,
          oldValue: 1,
          newValue: 2,
        },
      ]);
    });

    it('应该处理嵌套对象', () => {
      const source = { nested: { a: 1 } };
      const target = { nested: { a: 2 } };

      const result = getDiffPath(source, target);

      expect(result).toEqual([
        {
          path: 'nested.a',
          type: DiffTypeEnum.Modified,
          oldValue: 1,
          newValue: 2,
        },
      ]);
    });

    it('应该处理类型变化', () => {
      const source = { a: 1 };
      const target = { a: '1' };

      const result = getDiffPath(source, target);

      expect(result).toEqual([
        {
          path: 'a',
          type: DiffTypeEnum.Modified,
          oldValue: 1,
          newValue: '1',
        },
      ]);
    });
  });
});
