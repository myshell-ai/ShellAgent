export interface JsonSchema {
  $ref?: string;
  $defs?: { [key: string]: JsonSchema };
  [key: string]: any; // Additional properties are allowed in JSON Schema
}

const resolveRefs = (schema: JsonSchema, root: JsonSchema): JsonSchema => {
  if (typeof schema === 'object' && schema !== null) {
    if (schema.$ref) {
      const refPath = schema.$ref.split('/').slice(1); // Split and remove the initial "#"
      let resolved = root;
      refPath.forEach(segment => {
        resolved = resolved?.[segment];
      });
      return resolveRefs(resolved, root); // Recursively resolve the referenced schema
    }
    const resolvedSchema: any = Array.isArray(schema) ? [] : {};
    Object.keys(schema).forEach(key => {
      resolvedSchema[key] = resolveRefs(schema[key], root);
    });
    return resolvedSchema;
  }
  return schema;
};

export { resolveRefs };
