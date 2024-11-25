import { reservedStateName } from '@shellagent/shared/protocol/node';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { removeBrackets } from '@shellagent/shared/utils';
import type { FieldValues } from '@shellagent/ui';
import { omit } from 'lodash-es';

import { contextTempReg } from '@/stores/app/utils/data-transformer';

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
      // 兼容context
      if (key === varName && contextTempReg.test(varName)) {
        delete parent[key];
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
    // 兼容context
    if (key === oldVarName && contextTempReg.test(oldVarName)) {
      const displayName = removeBrackets(
        newVarName?.replace(contextTempReg, 'Context/$1'),
      );
      parent[newVarName] = { ...parent[oldVarName], display_name: displayName };
      delete parent[oldVarName];
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

export const handleReorderTask = (
  nodeData: Record<string, FieldValues>,
  stateId: string,
  currentTasks: string[],
  previousTasks: string[],
) => {
  const blocks = nodeData?.[stateId]?.blocks;
  if (!blocks || !Array.isArray(blocks)) return;

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
};
