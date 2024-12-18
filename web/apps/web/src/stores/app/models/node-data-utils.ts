import { reservedStateName } from '@shellagent/shared/protocol/node';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { removeBrackets } from '@shellagent/shared/utils';
import type { FieldValues } from '@shellagent/ui';
import { omit, cloneDeep } from 'lodash-es';

const contextTempReg = /__context__([a-z0-9_]+)__/g;

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
  nodeData: Record<string, FieldValues>,
  paths: string[],
): Record<string, FieldValues> => {
  const updatedNodeData = cloneDeep(nodeData);

  paths.forEach(path => {
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
          `{{\\s*(${reservedKeys}\\.)?${varName}\\s*}}`,
          'g',
        );
        parent[key] = value.replace(refRegex, '');
      }
      // 兼容context
      if (key === varName && contextTempReg.test(varName)) {
        delete parent[key];
      }
    });
  });

  return updatedNodeData;
};

export const handleRemoveRefOptsPrefix = (
  nodeData: Record<string, FieldValues>,
  prefix: string[],
): Record<string, FieldValues> => {
  const updatedNodeData = cloneDeep(nodeData);

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
        parent[key] = value.replace(refRegex, '');
      }
    });
  });

  return updatedNodeData;
};

export const handleRenameRefOpt = (
  nodeData: Record<string, FieldValues>,
  oldPath: string,
  newPath: string,
  byPrefix?: boolean,
): Record<string, FieldValues> => {
  const updatedNodeData = cloneDeep(nodeData);

  const pathRegex = new RegExp(
    `^(.+?)\\.(?:(${reservedKeys}|blocks)\\.)?(.+)$`,
  );
  const oldPathMatch = oldPath.match(pathRegex);
  const newPathMatch = newPath.match(pathRegex);
  if (!oldPathMatch || !newPathMatch) return updatedNodeData;

  const [, stateId, pathType, oldVarName] = oldPathMatch;
  const [, , , newVarName] = newPathMatch;

  let stateNode: FieldValues | undefined;

  if (reservedStateName.start === stateId) {
    stateNode = omit(updatedNodeData, [reservedStateName.start]);
  } else {
    stateNode = updatedNodeData[stateId];
  }
  if (!stateNode) return updatedNodeData;

  processNestedObject(stateNode, (value, key, parent) => {
    if (typeof value === 'string') {
      const refRegex = new RegExp(
        byPrefix
          ? `{{\\s*(${reservedKeys}\\.)?${oldVarName}[\\w.]*\\s*}}`
          : `{{\\s*(${reservedKeys}\\.)?${oldVarName}\\s*}}`,
        'g',
      );
      if (refRegex.test(value)) {
        if (byPrefix) {
          const suffix =
            value.match(new RegExp(`${oldVarName}([\\w.]*)\\s*}}`))?.[1] || '';
          parent[key] = value.replace(refRegex, `{{${newVarName}${suffix}}}`);
        } else {
          parent[key] = value.replace(refRegex, `{{${newVarName}}}`);
        }
      }
    }
    // 兼容context
    if (key === oldVarName && contextTempReg.test(oldVarName)) {
      const displayName = removeBrackets(
        newVarName?.replace(contextTempReg, 'Context/$1'),
      );
      parent[newVarName] = { ...parent[oldVarName], display_name: displayName };
      delete parent[oldVarName];
    }
  });

  return updatedNodeData;
};

export const handleRemoveState = (
  nodeData: Record<string, FieldValues>,
  stateId: string,
): Record<string, FieldValues> => {
  const updatedNodeData = cloneDeep(nodeData);

  processNestedObject(updatedNodeData, (value, key, parent) => {
    if (typeof value === 'string') {
      const refRegex = new RegExp(`{{\\s*${stateId}\\.[^}]+\\s*}}`, 'g');
      parent[key] = value.replace(refRegex, '');
    }
  });

  return updatedNodeData;
};

export const handleReorderTask = (
  nodeData: Record<string, FieldValues>,
  stateId: string,
  currentTasks: string[],
  previousTasks: string[],
): Record<string, FieldValues> => {
  const updatedNodeData = cloneDeep(nodeData);

  const blocks = updatedNodeData?.[stateId]?.blocks;
  if (!blocks || !Array.isArray(blocks)) return updatedNodeData;

  // 遍历所有任务块
  currentTasks.forEach((taskName, currentIndex) => {
    const previousIndex = previousTasks.indexOf(taskName);
    const taskBlock = blocks.find(block => block.name === taskName);
    if (!taskBlock) return;

    // 检查并清理不合法的引用
    processNestedObject(taskBlock, (value, key, parent) => {
      if (typeof value === 'string') {
        // 匹配形如 {{ taskName.any.nested.path }}
        const refRegex = /{{[\s]*([\w]+)(?:\.[^}]+)?[\s]*}}/g;
        const matches = Array.from(value.matchAll(refRegex));

        const shouldClear = matches.some(match => {
          const referencedTask = match[1];
          const referencedTaskCurrentIndex =
            currentTasks.indexOf(referencedTask);
          const referencedTaskPreviousIndex =
            previousTasks.indexOf(referencedTask);

          return (
            referencedTaskCurrentIndex === -1 || // 任务不存在
            referencedTaskCurrentIndex > currentIndex || // 引用了后面的任务
            (referencedTaskPreviousIndex > previousIndex && // 之前在后面
              referencedTaskCurrentIndex > currentIndex) // 现在也在后面
          );
        });

        // 如果需要清除引用，将值设为空字符串
        if (shouldClear) {
          parent[key] = '';
        }
      }
    });
  });

  return updatedNodeData;
};
