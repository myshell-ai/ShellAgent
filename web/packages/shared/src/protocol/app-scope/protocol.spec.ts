import {
  buttonSchema,
  buttonsSchema,
  customEventSchema,
  customKeySchema,
  customSnakeCase,
  outputContextNameSchema,
  outputNameSchema,
  outputVariablesSchema,
  renderSchema,
  reservedKeySchema,
  scopesSchema,
  stateSchema,
  taskSchema,
  taskVariablesSchema,
  // taskVariableSchema,
  variableSchema,
  variablesSchema,
} from './protocol';

describe('protocol', () => {
  describe('customSnakeCase', () => {
    it('customSnakeCase', () => {
      expect(customSnakeCase('123')).toBe('123');
      expect(customSnakeCase('123a')).toBe('123a');
      expect(customSnakeCase('123a123')).toBe('123a123');
      expect(customSnakeCase('123a123b')).toBe('123a123b');
      expect(customSnakeCase('a_1')).toBe('a_1');
      expect(customSnakeCase('GPT2')).toBe('gpt2');
      expect(customSnakeCase('State#2')).toBe('state_2');
      // Can use a mask input
      expect(customSnakeCase('Image Canvas')).toBe('image_canvas');
    });

    it('CJK', () => {
      expect(customSnakeCase('中文')).toMatchInlineSnapshot(`"zhong_wen"`);
      expect(customSnakeCase('中文abc')).toMatchInlineSnapshot(
        `"zhong_wen_abc"`,
      );
      expect(customSnakeCase('中文aBc')).toMatchInlineSnapshot(
        `"zhong_wen_a_bc"`,
      );
      expect(customSnakeCase('123中文abc')).toMatchInlineSnapshot(
        `"123_zhong_wen_abc"`,
      );
    });

    it('emoj', () => {
      expect(customSnakeCase('😀')).toMatchInlineSnapshot(`"grinning_face"`);
      expect(customSnakeCase('😀😀123')).toMatchInlineSnapshot(
        `"grinning_face_grinning_face_123"`,
      );
    });

    it('custonSnakeCase emoj', () => {
      expect(customSnakeCase('Hello🌟World')).toMatchInlineSnapshot(
        `"hello_glowing_star_world"`,
      );
    });

    it('custonSnakeCase emoj special', () => {
      expect(customSnakeCase('👍🏻')).toMatchInlineSnapshot(`"1f44d"`);
      expect(customSnakeCase('ab👍🏻cd')).toMatchInlineSnapshot(`"ab_1f44d_cd"`);
      expect(customSnakeCase('中文👍🏻cd🌟英文')).toMatchInlineSnapshot(
        `"zhong_wen_1f44d_cd_glowing_star_ying_wen"`,
      );
    });
  });

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
      it('not reserved', () => {
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
    describe('valid', () => {
      it('simple', () => {
        variableSchema.parse({
          type: 'text',
          display_name: 'hi',
        });
      });

      it('recursive', () => {
        const a = variableSchema.parse({
          type: 'text',
          display_name: 'hi',
        });
      });
    });

    describe('compound type', () => {
      variableSchema.parse({
        type: 'string|object',
        display_name: 'Hello',
      });
    });

    describe('not valid', () => {
      it('type not right', () => {
        expect(() => {
          variableSchema.parse({
            type: 'text_not',
            display_name: 'hi',
            // value: 'hello',
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
            },
            {
              "code": "custom",
              "message": "text_not is not valid, only allowed compound type, e.g. string|object",
              "path": [
                "type"
              ]
            }
          ]"
        `);
      });
    });
  });

  describe('task', () => {
    it('simple', () => {
      taskSchema.parse({
        name: 'gpt',
        display_name: 'hi',
        variables: {
          reply: {
            type: 'text',
            display_name: 'hi',
          },
        },
      });
    });
  });

  // describe('task variable', () => {
  //   it('simple', () => {
  //     taskVariableSchema.parse({
  //       type: 'task',
  //     });

  //     taskVariableSchema.parse({
  //       type: 'task',
  //     });
  //   });

  //   it('recursive', () => {
  //     taskVariableSchema.parse({
  //       type: 'task',
  //     });
  //   });
  // });

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
      // customKeySchema.parse('1.a');
      // customKeySchema.parse('type.a');
      // customKeySchema.parse('a.1a');
      // customKeySchema.parse('.a');
      // customKeySchema.parse('a.1a');
    });

    it('should not be lowercase', () => {
      expect(() => {
        customKeySchema.parse('Payload');
      }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Payload is not snake_case",
            "path": []
          }
        ]"
      `);
    });

    it('should be snakecase', () => {
      expect(() => {
        customKeySchema.parse('Hello world');
      }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Hello world is not snake_case",
            "path": []
          }
        ]"
      `);
    });

    it('not contain dot', () => {
      expect(() => {
        customKeySchema.parse('user_prompt.');
      }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "user_prompt. is invalid, contains dots",
            "path": []
          }
        ]"
      `);
    });
  });

  describe('taskVariablesSchema', () => {
    taskVariablesSchema.parse({
      type: 'any string',
      display_name: 'hi',
    });
  });
});

describe('state variables', () => {
  it('valid', () => {
    variablesSchema.parse({
      test: {
        type: 'text',
        display_name: 'hi',
      },
    });
  });

  it('reserved', () => {
    expect(() => {
      variablesSchema.parse({
        properties: {
          type: 'text',
          display_name: 'hi',
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

  it('not lowercase', () => {
    expect(() => {
      variablesSchema.parse({
        Properties: {
          type: 'text',
          display_name: 'hi',
        },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Properties is not snake_case",
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

  describe('invalid', () => {
    it('not start context.', () => {
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
    });

    it('not start context.', () => {
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

    it('hit reserved', () => {
      expect(() => outputContextNameSchema.parse('context.type'))
        .toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "type is a reserved key",
              "path": []
            }
          ]"
        `);
    });
  });
});

describe('output name', () => {
  it('simple', () => {
    outputNameSchema.parse('context.a');
    outputNameSchema.parse('hello');
  });

  it('not snakecase', () => {
    expect(() => outputNameSchema.parse('Hello world'))
      .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Hello world is invalid, should start with context.",
            "path": []
          }
        ]"
      `);

    expect(() => outputNameSchema.parse('context.Hello world'))
      .toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "Hello world is not snake_case",
            "path": []
          }
        ]"
      `);
  });
});

describe('output variables', () => {
  it('valid', () => {
    outputVariablesSchema.parse({
      a: {
        type: 'text',
        display_name: 'hi',
      },
    });
  });
});

describe('custom event name', () => {
  describe('invalid', () => {
    it('not concatenated with dots', () => {
      expect(() => {
        customEventSchema.parse('hello');
      }).toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "hello should concatenated by dots",
              "path": []
            }
          ]"
        `);
    });

    it('hit reserved', () => {
      expect(() => {
        customEventSchema.parse('hello.type');
      }).toThrowErrorMatchingInlineSnapshot(`
          "[
            {
              "code": "custom",
              "message": "type is a reserved key",
              "path": []
            }
          ]"
        `);
    });
  });

  it('valid', () => {
    customEventSchema.parse('hello.a');
  });
});

describe('button', () => {
  it('valid', () => {
    buttonSchema.parse({
      event: 'button_a.on_click',
      payload: {
        b: {
          type: 'text',
          display_name: 'hi',
        },
      },
    });
  });
});

describe('buttons', () => {
  it('valid', () => {
    buttonsSchema.parse({
      a: {
        event: 'button_a.on_click',
        payload: {
          b: {
            type: 'text',
            display_name: 'hi',
          },
        },
      },
    });
  });

  it('invalid', () => {
    expect(() => {
      buttonsSchema.parse({
        id: {
          event: 'button_a.on_click',
          payload: {
            b: {
              type: 'text',
              display_name: 'hi',
            },
          },
        },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
        "[
          {
            "code": "custom",
            "message": "id is a reserved key",
            "path": [
              "id"
            ]
          }
        ]"
      `);
  });
});

describe('render', () => {
  it('valid', () => {
    renderSchema.parse({
      buttons: {
        a: {
          event: 'button_a.on_click',
          payload: {
            b: {
              type: 'text',
              display_name: 'hi',
            },
          },
        },
      },
    });
  });
});

describe('state', () => {
  it('valid', () => {
    const a = stateSchema.parse({
      name: 'state_1',
      display_name: 'hi',
      children: {
        inputs: {
          variables: {
            a: {
              type: 'text',
              display_name: 'hi',
            },
          },
        },
        // tasks: {
        //   'task_1': {
        //     variables: {
        //       a: {
        //         type: 'task',
        //       },
        //     },
        //   }
        // },
        tasks: [
          {
            name: 'gpt',
            display_name: 'hi',
            variables: {
              reply: {
                type: 'text',
                display_name: 'hi',
              },
            },
          },
        ],
        outputs: {
          variables: {
            a: {
              type: 'text',
              display_name: 'hi',
            },
          },
          render: {
            buttons: {
              a: {
                event: 'button_a.on_click',
                payload: {
                  b: {
                    type: 'text',
                    display_name: 'hi',
                  },
                },
              },
            },
          },
        },
      },
    });
  });

  it('most simple', () => {
    const a = stateSchema.parse({
      name: 'state_1',
      display_name: 'hi',
      children: {
        inputs: {
          variables: {},
        },
        tasks: [],
        outputs: {
          variables: {},
          render: {
            buttons: {},
          },
        },
      },
    });
  });
});

describe('scopes', () => {
  it('valid', () => {
    scopesSchema.parse({
      scopes: {
        context: {
          variables: {
            global_a: {
              type: 'text',
              display_name: 'Hello',
            },
          },
        },
        edges: [],
        states: {
          state_1: {
            name: 'state_1',
            display_name: 'hi',
            children: {
              inputs: {
                variables: {
                  a: {
                    type: 'text',
                    display_name: 'Hello',
                  },
                },
              },
              tasks: [
                {
                  name: 'gpt',
                  display_name: 'GPT',
                  variables: {
                    reply: {
                      type: 'text',
                      display_name: 'reply',
                    },
                  },
                },
              ],
              outputs: {
                variables: {
                  a: {
                    type: 'text',
                    display_name: 'hi',
                  },
                },
                render: {
                  buttons: {
                    a: {
                      event: 'button_a.on_click',
                      payload: {
                        b: {
                          type: 'text',
                          display_name: 'hi',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  });
  it('case#1', () => {
    expect(() => {
      stateSchema.parse({
        name: 'state_1',
        display_name: 'State#1',
        children: {
          inputs: {
            variables: {
              1111: { type: 'text', display_name: '1111' },
              2222: { type: undefined, display_name: '2222_1' },
              '2222_': { type: 'text', display_name: '2222_' },
            },
          },
          tasks: [],
          outputs: { variables: {}, render: { buttons: {} } },
        },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "[
        {
          "code": "custom",
          "message": "should not be empty",
          "path": [
            "children",
            "inputs",
            "variables",
            "2222",
            "type"
          ]
        }
      ]"
    `);
  });
});
