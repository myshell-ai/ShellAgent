import { TValues } from '@shellagent/form-engine';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { customSnakeCase } from '@shellagent/shared/utils';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';

import { FormRef } from '@shellagent/ui';
import { useEffect, useRef, useCallback } from 'react';
import { get, set, cloneDeep, isEqual, debounce, isString } from 'lodash-es';
import { replaceKey, getDiffPath, DiffTypeEnum } from './form-utils';
import { useSchemaContext } from '@/stores/app/schema-provider';

export function useFieldWatch(
  formRef: React.RefObject<FormRef>,
  params?: {
    stateId?: string;
  },
) {
  const prevValuesRef = useRef<Record<string, TValues | undefined>>({});
  const appBuilder = useInjection(AppBuilderModel);

  const stateId = useSchemaContext(state => state.id);

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

        if (
          isString(prevContextValue?.name) &&
          isString(newContextValue?.name)
        ) {
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
    debounce((newValue: TValues, prevValue: TValues, name: string) => {
      if (name === reservedKeySchema.Enum.inputs) {
        const oldInputs: TValues = get(prevValue, name);
        const newInputs: TValues = get(newValue, name);
        const diffPath = getDiffPath(oldInputs, newInputs);
        diffPath.forEach(diff => {
          switch (diff.type) {
            case DiffTypeEnum.Deleted:
              appBuilder.hanldeRefScene({
                scene: RefSceneEnum.Enum.remove_ref_opts,
                params: {
                  paths: [`${stateId}.${name}.${diff.path}`],
                },
              });
              break;
            default:
              break;
          }
        });
      } else {
        const inputName = name.split('.')[1];
        const prevInputsValue: TValues = get(prevValue, [
          reservedKeySchema.Enum.inputs,
          inputName,
        ]);
        const newInputsValue: TValues = get(newValue, [
          reservedKeySchema.Enum.inputs,
          inputName,
        ]);

        if (isString(prevInputsValue?.name) && newInputsValue?.name) {
          if (prevInputsValue.name !== newInputsValue.name) {
            const newKey = customSnakeCase(newInputsValue.name || '');
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: `${stateId}.${reservedKeySchema.Enum.inputs}.${inputName}`,
                newPath: `${stateId}.${reservedKeySchema.Enum.inputs}.${newKey}`,
              },
            });
            // todo 会触发DiffTypeEnum.Deleted
            replaceKey(formRef, {
              parentPath: reservedKeySchema.Enum.inputs,
              oldKey: inputName,
              newKey,
              value: newInputsValue,
            });
          }
        }
      }
    }, 300),
    [stateId, appBuilder.hanldeRefScene],
  );

  // 处理 outputs 变化的函数
  const handleOutputsChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, name: string) => {
      if (name === reservedKeySchema.Enum.outputs) {
        const oldOuputs: TValues = get(prevValue, name);
        const newOuputs: TValues = get(newValue, name);
        const diffPath = getDiffPath(oldOuputs, newOuputs);
        diffPath.forEach(diff => {
          switch (diff.type) {
            case DiffTypeEnum.Deleted:
              appBuilder.hanldeRefScene({
                scene: RefSceneEnum.Enum.remove_ref_opts,
                params: {
                  paths: [`${stateId}.${name}.${diff.path}`],
                },
              });
              break;
            default:
              break;
          }
        });
      } else {
        const outputName = name.split('.')[1];
        const prevOutputsValue: TValues = get(prevValue, [
          reservedKeySchema.Enum.outputs,
          outputName,
        ]);
        const newOutputsValue: TValues = get(newValue, [
          reservedKeySchema.Enum.outputs,
          outputName,
        ]);

        if (
          isString(prevOutputsValue?.name) &&
          isString(newOutputsValue?.name)
        ) {
          if (prevOutputsValue.name !== newOutputsValue.name) {
            const newKey = customSnakeCase(newOutputsValue.name || '');
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: name,
                newPath: `${reservedKeySchema.Enum.context}.${newKey}`,
              },
            });
            // todo 会触发DiffTypeEnum.Deleted
            replaceKey(formRef, {
              parentPath: reservedKeySchema.Enum.outputs,
              oldKey: outputName,
              newKey,
              value: newOutputsValue,
            });
          }
        }
      }
    }, 100),
    [],
  );

  // 处理 blocks 变化的函数
  const handleBlocksChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, blocksKey: string) => {},
    300),
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
    } else if (name.startsWith(reservedKeySchema.Enum.inputs)) {
      handleInputsChange(newValue, prevValue, name);
    } else if (name.startsWith(reservedKeySchema.Enum.outputs)) {
      handleOutputsChange(newValue, prevValue, name);
    } else if (name.startsWith(reservedKeySchema.Enum.blocks)) {
      handleBlocksChange(newValue, prevValue, name);
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
