import { getVariableKey } from './uuid';

describe('getVariableKey', () => {
  it('should return empty string for invalid input', () => {
    expect(getVariableKey('')).toBe('');
    expect(getVariableKey('test')).toBe('');
  });

  it('should add context by order', () => {
    const value = {
      untitled_context_1: { name: 'Untitled' },
      untitled_context_2: { name: 'Untitled' },
      untitled_context_3: { name: 'Untitled' },
    };

    const newItem = {
      type: 'text',
      value: '',
      name: 'Untitled',
    };
    const result = getVariableKey(
      '{{name}} Context_{{counter}}',
      value,
      newItem,
    );
    expect(result).toBe('untitled_context_4');
  });

  it('should handle context not by order', () => {
    const value = {
      untitled_context_1: { name: 'Untitled' },
      untitled_context_3: { name: 'Untitled' },
    };

    const newItem = {
      type: 'text',
      value: '',
      name: 'Untitled',
    };
    const result = getVariableKey(
      '{{name}} Context_{{counter}}',
      value,
      newItem,
    );
    expect(result).toBe('untitled_context_4');
  });

  it('should handle empty object value', () => {
    const value = {};
    const newItem = {
      type: 'text',
      value: '',
      name: 'Test',
    };
    const result = getVariableKey(
      '{{name}} Context_{{counter}}',
      value,
      newItem,
    );
    expect(result).toBe('test_context_1');
  });

  it('should handle non-sequential counter values', () => {
    const value = {
      test_context_1: { name: 'Test' },
      test_context_5: { name: 'Test' },
    };
    const newItem = {
      type: 'text',
      value: '',
      name: 'Test',
    };
    const result = getVariableKey(
      '{{name}} Context_{{counter}}',
      value,
      newItem,
    );
    expect(result).toBe('test_context_6');
  });

  it('should handle different variable patterns', () => {
    const value = {
      test_form_1: { name: 'Test' },
    };
    const newItem = {
      type: 'text',
      value: '',
      name: 'Test',
    };
    const result = getVariableKey('{{name}}_form_{{counter}}', value, newItem);
    expect(result).toBe('test_form_2');
  });
});
