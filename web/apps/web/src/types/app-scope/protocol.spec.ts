import { z } from 'zod';
import { customKeySchema, variableSchema, variablesSchema } from './protocol';

describe('protocol', () => {
  it('test variable', () => {
    variableSchema.parse({
      type: 'text',
      value: 'hello',
    });

    variableSchema.parse({
      type: 'text',
      value: {
        type: 'text',
        value: 'hello',
      },
    });

    expect(() => {
      variableSchema.parse({
        type: 'text_not',
        value: 'hello',
      });
    }).toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "received": "text_not",
              "code": "invalid_enum_value",
              "options": [
                "text",
                "image",
                "audio",
                "video",
                "file",
                "text_file"
              ],
              "path": [
                "type"
              ],
              "message": "Invalid enum value. Expected 'text' | 'image' | 'audio' | 'video' | 'file' | 'text_file', received 'text_not'"
            }
          ]"
        `);
  });

  it('test custom key', () => {
    expect(() => {
      customKeySchema.parse('type');
    }).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "Is a reserved key",
          "path": []
        }
      ]"
    `);

    expect(() => {
      customKeySchema.parse('id');
    }).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "Is a reserved key",
          "path": []
        }
      ]"
    `);

    expect(() => {
      customKeySchema.parse('properties');
    }).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "Is a reserved key",
          "path": []
        }
      ]"
    `);

    expect(() => {
      customKeySchema.parse('payload');
    }).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "Is a reserved key",
          "path": []
        }
      ]"
    `);

    customKeySchema.parse('123');
    customKeySchema.parse('type1');
    customKeySchema.parse('a');
    customKeySchema.parse('ttt');
    customKeySchema.parse('1a');
    customKeySchema.parse('a_1');
    customKeySchema.parse('1.a');
    customKeySchema.parse('type.a');
    customKeySchema.parse('a.1a');
    customKeySchema.parse('.a');
    customKeySchema.parse('a.1a');
  });

  it('test state variables', () => {
    variablesSchema.parse({
      test: {
        type: 'text',
        value: 'test',
      },
    });

    expect(() => {
      variablesSchema.parse({
        properties: {
          type: 'text',
          value: 'test',
        },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "Is a reserved key",
          "path": [
            "properties"
          ]
        }
      ]"
    `);

    /*     expect(() => {
          variablesSchema.parse({
            Properties: {
              type: 'text',
              value: 'test',
            },
          });
        }).toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "Is a reserved key",
              "path": [
                "Properties"
              ]
            }
          ]"
        `); */
  });

  it('test CustomKey', () => {
    const tag = z.string();
    tag.parse('Hello');
    const parsed = tag.safeParse('Hello');
    expect(parsed).toMatchInlineSnapshot('');
  });

  it('test state', () => {});
});
