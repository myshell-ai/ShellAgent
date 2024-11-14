import { reservedStateName } from '@shellagent/shared/protocol/node';
import type { FieldValues } from '@shellagent/ui';
import { omit } from 'lodash-es';

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
    const [stateId, varName] = path.split('.');
    let stateNode: FieldValues | undefined;

    if (reservedStateName.start === stateId) {
      stateNode = omit(updatedNodeData, [reservedStateName.start]);
    } else {
      stateNode = updatedNodeData[stateId];
    }
    if (!stateNode) return;

    processNestedObject(stateNode, (value, key, parent) => {
      if (typeof value === 'string') {
        const refRegex = new RegExp(`{{\\s*${varName}\\s*}}`, 'g');
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
  prefix.forEach(prefix => {
    const [stateId, varName] = prefix.split('.');
    let stateNode: FieldValues | undefined;

    if (reservedStateName.start === stateId) {
      stateNode = omit(updatedNodeData, [reservedStateName.start]);
    } else {
      stateNode = updatedNodeData[stateId];
    }
    if (!stateNode) return;

    processNestedObject(stateNode, (value, key, parent) => {
      if (typeof value === 'string') {
        const refRegex = new RegExp(`{{\\s*${varName}[\\w.]*\\s*}}`, 'g');
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
  const [stateId, oldVarName] = oldPath.split('.');
  const [, newVarName] = newPath.split('.');

  let stateNode: FieldValues | undefined;

  if (reservedStateName.start === stateId) {
    stateNode = omit(updatedNodeData, [reservedStateName.start]);
  } else {
    stateNode = updatedNodeData[stateId];
  }
  if (!stateNode) return;

  processNestedObject(stateNode, (value, key, parent) => {
    if (typeof value === 'string') {
      const oldRefRegex = new RegExp(`{{\\s*${oldVarName}\\s*}}`, 'g');
      if (oldRefRegex.test(value)) {
        parent[key] = value.replace(oldRefRegex, `{{ ${newVarName} }}`);
      }
    }
  });
};

export const handleRemoveState = (
  updatedNodeData: Record<string, FieldValues>,
  stateName: string,
) => {
  Object.entries(updatedNodeData).forEach(([nodeId, node]: [string, any]) => {
    if (nodeId === stateName || node.type !== 'state') return;

    processNestedObject(node, (value, key, parent) => {
      if (typeof value === 'string') {
        const refRegex = new RegExp(`{{\\s*${stateName}\\.[\\w.]*\\s*}}`, 'g');
        if (refRegex.test(value)) {
          parent[key] = '';
        }
      }
    });
  });
};
