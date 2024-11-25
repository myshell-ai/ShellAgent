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

        let shouldClear = false;
        for (const match of matches) {
          const referencedTask = match[1];
          const referencedTaskCurrentIndex =
            currentTasks.indexOf(referencedTask);
          const referencedTaskPreviousIndex =
            previousTasks.indexOf(referencedTask);

          // 在以下情况下需要清除引用：
          // 1. 引用的任务不存在于当前任务列表中
          // 2. 引用了当前任务后面的任务
          // 3. 在之前的顺序中，引用的任务在当前任务之后，且在新顺序中仍然保持这种关系
          if (
            referencedTaskCurrentIndex === -1 || // 任务不存在
            referencedTaskCurrentIndex > currentIndex || // 引用了后面的任务
            (referencedTaskPreviousIndex > previousIndex && // 之前在后面
              referencedTaskCurrentIndex > currentIndex) // 现在也在后面
          ) {
            shouldClear = true;
            break;
          }
        }

        // 如果需要清除引用，将值设为空字符串
        if (shouldClear) {
          parent[key] = '';
        }
      }
    });
  });
};
