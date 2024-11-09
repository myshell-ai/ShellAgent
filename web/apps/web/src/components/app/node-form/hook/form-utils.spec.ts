import { FormRef } from '@shellagent/ui';
import { DiffTypeEnum, getDiffPath, replaceKey } from './form-utils';

describe('form-utils', () => {
  // describe('replaceKey', () => {
  //   let mockFormRef: { current: Partial<FormRef> };

  //   beforeEach(() => {
  //     mockFormRef = {
  //       current: {
  //         getValues: jest.fn(),
  //         setValue: jest.fn(),
  //       },
  //     };
  //   });

  //   it('should correctly replace key for simple value', () => {
  //     mockFormRef.current.getValues = jest.fn().mockReturnValue({
  //       oldKey: 'value',
  //       other: 'otherValue',
  //     });

  //     replaceKey(mockFormRef as any, {
  //       parentPath: 'parent',
  //       oldKey: 'oldKey',
  //       newKey: 'newKey',
  //     });

  //     expect(mockFormRef.current.setValue).toHaveBeenCalledWith('parent', {
  //       newKey: 'value',
  //       other: 'otherValue',
  //     });
  //   });

  //   it('should merge object values', () => {
  //     mockFormRef.current.getValues = jest.fn().mockReturnValue({
  //       oldKey: { existing: 'value' },
  //     });

  //     replaceKey(mockFormRef as any, {
  //       parentPath: 'parent',
  //       oldKey: 'oldKey',
  //       newKey: 'newKey',
  //       value: { new: 'value' },
  //     });

  //     expect(mockFormRef.current.setValue).toHaveBeenCalledWith('parent', {
  //       newKey: { existing: 'value', new: 'value' },
  //     });
  //   });
  // });

  describe('getDiffPath', () => {
    it('should detect added fields from empty object', () => {
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

    it('should detect added fields from non-empty object', () => {
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

    it('should detect deleted fields to non-empty object', () => {
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

    it('should detect deleted fields to empty object', () => {
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

    it('should detect modified fields', () => {
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

    it('should detect modified fields to empty string', () => {
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

    it('should detect rename fields key', () => {
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
});
