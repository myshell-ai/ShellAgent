import { TValues } from '@shellagent/form-engine';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { customSnakeCase } from '@shellagent/shared/utils';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';

import { FormRef } from '@shellagent/ui';
import { useEffect, useRef, useCallback } from 'react';
import { get, set, cloneDeep, isEqual, debounce } from 'lodash-es';
import { replaceKey, getDiffPath, DiffTypeEnum } from './form-utils';

export function useFieldWatch(
  formRef: React.RefObject<FormRef>,
  params?: {
    stateId?: string;
  },
) {
  const prevValuesRef = useRef<Record<string, TValues | undefined>>({});
  const appBuilder = useInjection(AppBuilderModel);

  // 处理 context 变化的函数
  const handleContextChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, name: string) => {
      if (name === reservedKeySchema.Enum.context) {
        const oldContext: TValues = get(prevValue, name);
        const newContext: TValues = get(newValue, name);
        const diffPath = getDiffPath(oldContext, newContext);
        diffPath.forEach(diff => {
          switch (diff.type) {
            case DiffTypeEnum.Deleted:
              appBuilder.hanldeRefScene({
                scene: RefSceneEnum.Enum.remove_ref_opts,
                params: {
                  paths: [`${name}.${diff.path}`],
                },
              });
              break;
            default:
              break;
          }
        });
      } else {
        // 修改context key
        const prevContextValue: TValues = get(prevValue, name);
        const newContextValue: TValues = get(newValue, name);

        if (prevContextValue?.name && newContextValue?.name) {
          if (prevContextValue.name !== newContextValue.name) {
            const oldKey = name.split('.')[1];
            const newKey = customSnakeCase(newContextValue.name || '');
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: name,
                newPath: `${reservedKeySchema.Enum.context}.${newKey}`,
              },
            });
            // todo 会触发DiffTypeEnum.Deleted
            replaceKey(formRef, {
              parentPath: reservedKeySchema.Enum.context,
              oldKey,
              newKey,
              value: newContextValue,
            });
          }
        }
      }
    }, 100),
    [appBuilder.hanldeRefScene],
  );

  // 处理 inputs 变化的函数
  const handleInputsChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, inputsKey: string) => {
      // 补充
      const oldInputs = get(prevValue, ['inputs', inputsKey]);
      const newInputs = get(newValue, ['inputs', inputsKey]);

      if (oldInputs?.name && newInputs?.name) {
        if (oldInputs?.name !== newInputs?.name) {
          replaceKey(formRef, {
            parentPath: reservedKeySchema.Enum.inputs,
            oldKey: inputsKey,
            newKey: customSnakeCase(newInputs?.name || ''),
            value: newInputs,
          });
        }
      }
    }, 300),
    [],
  );

  // 处理 outputs 变化的函数
  const handleOutputsChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, outputsKey: string) => {
      const oldOutputs = get(prevValue, ['outputs', outputsKey]);
      const newOutputs = get(newValue, ['outputs', outputsKey]);

      if (oldOutputs?.name && newOutputs?.name) {
        if (oldOutputs?.name !== newOutputs?.name) {
          replaceKey(formRef, {
            parentPath: reservedKeySchema.Enum.outputs,
            oldKey: outputsKey,
            newKey: customSnakeCase(newOutputs?.name || ''),
            value: newOutputs,
          });
        }
      }
    }, 300),
    [],
  );

  // 处理 blocks 变化的函数
  const handleBlocksChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, blocksKey: string) => {
      const oldBlocks = get(prevValue, ['blocks', blocksKey]);
      const newBlocks = get(newValue, ['blocks', blocksKey]);

      if (oldBlocks?.name && newBlocks?.name) {
        if (oldBlocks?.name !== newBlocks?.name) {
          replaceKey(formRef, {
            parentPath: reservedKeySchema.Enum.blocks,
            oldKey: blocksKey,
            newKey: customSnakeCase(newBlocks?.name || ''),
            value: newBlocks,
          });
        }
      }
    }, 300),
    [],
  );

  // 处理 render 变化的函数
  const handleRenderChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, renderKey: string) => {
      const oldRender = get(prevValue, ['render', renderKey]);
      const newRender = get(newValue, ['render', renderKey]);

      if (oldRender?.name && newRender?.name) {
        if (oldRender?.name !== newRender?.name) {
          replaceKey(formRef, {
            parentPath: reservedKeySchema.Enum.render,
            oldKey: renderKey,
            newKey: customSnakeCase(newRender?.name || ''),
            value: newRender,
          });
        }
      }
    }, 300),
    [],
  );

  const handleChange = (
    newValue: TValues,
    prevValue: TValues,
    name?: string,
  ) => {
    if (!name) return;

    if (name.startsWith(reservedKeySchema.Enum.context)) {
      handleContextChange(newValue, prevValue, name);
    } else if (name.startsWith(`${reservedKeySchema.Enum.inputs}.`)) {
      const inputsKey = name.split('.')[1];
      handleInputsChange(newValue, prevValue, inputsKey);
    } else if (name.startsWith(reservedKeySchema.Enum.outputs)) {
      const outputsKey = name.split('.')[1];
      handleOutputsChange(newValue, prevValue, outputsKey);
    } else if (name.startsWith(reservedKeySchema.Enum.blocks)) {
      const blocksKey = name.split('.')[1];
      handleBlocksChange(newValue, prevValue, blocksKey);
    } else if (name.startsWith(reservedKeySchema.Enum.render)) {
      const renderKey = name.split('.')[1];
      handleRenderChange(newValue, prevValue, renderKey);
    }
  };

  useEffect(() => {
    if (!formRef.current) return;
    const currentValues = formRef.current.getValues();
    prevValuesRef.current = cloneDeep(currentValues);
  }, []);

  useEffect(() => {
    if (!formRef.current) return;

    const subscription = formRef.current.watch((newValue, { name }) => {
      if (!name) return;

      const prevValue = prevValuesRef.current;

      if (!isEqual(newValue, prevValue)) {
        console.log('?????', name, newValue);
        handleChange(newValue, prevValue, name);
      }

      prevValuesRef.current = cloneDeep(newValue);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [formRef, handleChange]);
}
