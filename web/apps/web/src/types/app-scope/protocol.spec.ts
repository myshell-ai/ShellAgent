import { z } from 'zod';
import { customKeySchema, variableSchema, variablesSchema } from './protocol';

describe('protocol', () => {
  describe('variable', () => {
    it('simple', () => {
      variableSchema.parse({
        type: 'text',
        value: 'hello',
      });
    });

    it('recursive', () => {
      variableSchema.parse({
        type: 'text',
        value: {
          type: 'text',
          value: 'hello',
        },
      });
    });

    it('type value', () => {
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
  });

  describe('custom key', () => {
    it('reserved', () => {
      expect(() => {
        customKeySchema.parse('type');
      }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "type is a reserved key",
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
            "message": "id is a reserved key",
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
            "message": "properties is a reserved key",
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
            "message": "payload is a reserved key",
            "path": []
          }
        ]"
      `);
    });

    it('valid', () => {
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

    it('lowercase', () => {
      expect(() => {
        customKeySchema.parse('Payload');
      }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Payload is not lowercase",
            "path": []
          }
        ]"
      `);
    });
  });

  describe('state variables', () => {
    it('valid', () => {
      variablesSchema.parse({
        test: {
          type: 'text',
          value: 'test',
        },
      });
    });

    it('reserved', () => {
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
            "message": "properties is a reserved key",
            "path": [
              "properties"
            ]
          }
        ]"
      `);
    });

    it('lowercase', () => {
      expect(() => {
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
                "message": "Properties is not lowercase",
                "path": [
                  "Properties"
                ]
              }
            ]"
          `);
    });
  });

  it('test state', () => {});
});
