import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { reservedStateName } from '@shellagent/shared/protocol/node';
import type { FieldValues } from '@shellagent/ui';
import { omit } from 'lodash-es';

const reservedKeys = Object.keys(reservedKeySchema.enum).join('|');

export function processNestedObject(
  obj: any,
  processor: (value: any, key: string, parent: any) => void,
) {
  if (!obj || typeof obj !== 'object') return;

  Object.entries(obj).forEach(([key, value]) => {
    processor(value, key, obj);
    if (typeof value === 'object') {
      processNestedObject(value, processor);
    }
  });
}

export const handleRemoveRefOpts = (
  updatedNodeData: Record<string, FieldValues>,
  paths: string[],
) => {
  paths.forEach(path => {
    const pathMatch = path.match(
      new RegExp(`^(.+?)\\.(?:(${reservedKeys})\\.)?(.+)$`),
    );
    if (!pathMatch) return;

    const [, stateId, prefix, varName] = pathMatch;
    let stateNode: FieldValues | undefined;

    if (reservedStateName.start === stateId) {
      stateNode = omit(updatedNodeData, [reservedStateName.start]);
    } else {
      stateNode = updatedNodeData[stateId];
    }
    if (!stateNode) return;

    processNestedObject(stateNode, (value, key, parent) => {
      if (typeof value === 'string') {
        const refRegex = new RegExp(
          `{{\\s*(${reservedKeys}\\.)?${varName}\\s*}}`,
          'g',
        );
        if (refRegex.test(value)) {
          parent[key] = '';
        }
      }
    });
  });
};

export const handleRemoveRefOptsPrefix = (
  updatedNodeData: Record<string, FieldValues>,
  prefix: string[],
) => {
  prefix.forEach(path => {
    const pathMatch = path.match(
      new RegExp(`^(.+?)\\.(?:(${reservedKeys})\\.)?(.+)$`),
    );
    if (!pathMatch) return;

    const [, stateId, , varName] = pathMatch;
    let stateNode: FieldValues | undefined;

    if (reservedStateName.start === stateId) {
      stateNode = omit(updatedNodeData, [reservedStateName.start]);
    } else {
      stateNode = updatedNodeData[stateId];
    }
    if (!stateNode) return;

    processNestedObject(stateNode, (value, key, parent) => {
      if (typeof value === 'string') {
        const refRegex = new RegExp(
          `{{\\s*(${reservedKeys}\\.)?${varName}[\\w.]*\\s*}}`,
          'g',
        );
        if (refRegex.test(value)) {
          parent[key] = '';
        }
      }
    });
  });
};

export const handleRenameRefOpt = (
  updatedNodeData: Record<string, FieldValues>,
  oldPath: string,
  newPath: string,
) => {
  const oldPathMatch = oldPath.match(
    new RegExp(`^(.+?)\\.(?:(${reservedKeys})\\.)?(.+)$`),
  );
  const newPathMatch = newPath.match(
    new RegExp(`^(.+?)\\.(?:(${reservedKeys})\\.)?(.+)$`),
  );
  if (!oldPathMatch || !newPathMatch) return;

  const [, stateId, , oldVarName] = oldPathMatch;
  const [, , , newVarName] = newPathMatch;

  let stateNode: FieldValues | undefined;

  if (reservedStateName.start === stateId) {
    stateNode = omit(updatedNodeData, [reservedStateName.start]);
  } else {
    stateNode = updatedNodeData[stateId];
  }
  if (!stateNode) return;

  processNestedObject(stateNode, (value, key, parent) => {
    if (typeof value === 'string') {
      const oldRefRegex = new RegExp(
        `{{\\s*(${reservedKeys}\\.)?${oldVarName}\\s*}}`,
        'g',
      );
      if (oldRefRegex.test(value)) {
        parent[key] = `{{ ${newVarName} }}`;
      }
    }
  });
};

export const handleRemoveState = (
  nodeData: Record<string, FieldValues>,
  stateId: string,
) => {
  processNestedObject(nodeData, (value, key, parent) => {
    if (typeof value === 'string') {
      const refRegex = new RegExp(`{{\\s*${stateId}\\.[^}]+\\s*}}`, 'g');
      if (refRegex.test(value)) {
        parent[key] = '';
      }
    }
  });
};
