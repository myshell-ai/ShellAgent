import { customSnakeCase } from './utils';

describe('customSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    expect(customSnakeCase('camelCase')).toBe('camel_case');
    expect(customSnakeCase('thisIsATest')).toBe('this_is_a_test');
  });

  it('should handle PascalCase', () => {
    expect(customSnakeCase('PascalCase')).toBe('pascal_case');
    expect(customSnakeCase('ThisIsATest')).toBe('this_is_a_test');
  });

  it('should handle numbers', () => {
    expect(customSnakeCase('user123Name')).toBe('user123_name');
    expect(customSnakeCase('test2Case')).toBe('test2_case');
  });

  it('should handle already snake_case strings', () => {
    expect(customSnakeCase('already_snake_case')).toBe('already_snake_case');
    expect(customSnakeCase('keep_existing_snake')).toBe('keep_existing_snake');
  });

  it('should handle empty string', () => {
    expect(customSnakeCase('')).toBe('');
  });

  it('should convert Chinese characters to hex', () => {
    expect(customSnakeCase('用户Name')).toBe('7528_6237_name');
    expect(customSnakeCase('user名字Test')).toBe('user_540d_5b57_test');
    expect(customSnakeCase('测试Case测试')).toBe('6d4b_8bd5_case_6d4b_8bd5');
  });

  it('should convert emojis to hex', () => {
    expect(customSnakeCase('user👨Name')).toBe('user_1f468_name');
    expect(customSnakeCase('test🚀Case')).toBe('test_1f680_case');
    expect(customSnakeCase('emoji😊Test')).toBe('emoji_1f60a_test');
  });

  it('should handle mixed Chinese, emojis and English', () => {
    expect(customSnakeCase('用户👨Profile')).toBe('7528_6237_1f468_profile');
    expect(customSnakeCase('test测试🚀Case')).toBe('test_6d4b_8bd5_1f680_case');
  });

  it('should handle special characters and symbols', () => {
    expect(customSnakeCase('hello@world')).toBe('hello_40_world');
    expect(customSnakeCase('test$case')).toBe('test_24_case');
  });
});
