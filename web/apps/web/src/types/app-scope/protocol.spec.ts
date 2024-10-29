import {
  customKeySchema,
  outputContextNameSchema,
  outputNameSchema,
  reservedKeySchema,
  taskVariableSchema,
  variableSchema,
  variablesSchema,
} from './protocol';

describe('protocol', () => {
  describe('reserved key', () => {
    it('valid', () => {
      reservedKeySchema.parse('type');
      reservedKeySchema.parse('id');
      reservedKeySchema.parse('properties');
      reservedKeySchema.parse('inputs');
      reservedKeySchema.parse('outputs');
      reservedKeySchema.parse('tasks');
      reservedKeySchema.parse('render');
      reservedKeySchema.parse('transitions');
      reservedKeySchema.parse('states');
      reservedKeySchema.parse('context');
      reservedKeySchema.parse('payload');
    });

    describe('invalid', () => {
      it('not', () => {
        expect(() => {
          reservedKeySchema.parse('type1');
        }).toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "received": "type1",
              "code": "invalid_enum_value",
              "options": [
                "type",
                "id",
                "properties",
                "inputs",
                "outputs",
                "tasks",
                "render",
                "transitions",
                "states",
                "context",
                "payload"
              ],
              "path": [],
              "message": "Invalid enum value. Expected 'type' | 'id' | 'properties' | 'inputs' | 'outputs' | 'tasks' | 'render' | 'transitions' | 'states' | 'context' | 'payload', received 'type1'"
            }
          ]"
        `);
      });
    });
  });

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

  describe('task variable', () => {
    it('simple', () => {
      taskVariableSchema.parse({
        type: 'task',
        value: 'hello',
      });
    });

    it('recursive', () => {
      taskVariableSchema.parse({
        type: 'task',
        value: {
          type: 'text',
          value: 'hello',
        },
      });
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

    it('to lowercase', () => {
      expect(() => {
        customKeySchema.parse('Payload');
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

    it('to snakecase', () => {
      const o = customKeySchema.parse('Hello world');
      expect(o).toMatchInlineSnapshot(`"hello_world"`);
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

    it('to lowercase', () => {
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
                "message": "properties is a reserved key",
                "path": [
                  "Properties"
                ]
              }
            ]"
          `);
    });
  });

  describe('output context', () => {
    it('valid', () => {
      outputContextNameSchema.parse('context.a');
    });

    it('invalid', () => {
      expect(() => outputContextNameSchema.parse('Context.a'))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Context.a is invalid, should start with context.",
            "path": []
          }
        ]"
      `);

      expect(() => outputContextNameSchema.parse('hello.a'))
        .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "hello.a is invalid, should start with context.",
            "path": []
          }
        ]"
      `);
    });
  });

  describe('output name', () => {
    it('simple', () => {
      outputNameSchema.parse('context.a');
      outputNameSchema.parse('hello');
      expect(
        outputNameSchema.parse('context.Hello world'),
      ).toMatchInlineSnapshot(`"context_hello_world"`);
    });
  });

  it('test state', () => {});
});
