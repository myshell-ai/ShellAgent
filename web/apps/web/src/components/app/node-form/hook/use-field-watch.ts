import { TValues } from '@shellagent/form-engine';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { customSnakeCase, removeBrackets } from '@shellagent/shared/utils';
import { useInjection } from 'inversify-react';
import { AppBuilderModel } from '@/components/app/app-builder.model';

import { FormRef } from '@shellagent/ui';
import { useEffect, useRef, useCallback } from 'react';
import { get, cloneDeep, isEqual, debounce, isNil } from 'lodash-es';
import {
  replaceKey,
  getDiffPath,
  DiffTypeEnum,
  getNewName,
} from './form-utils';
import { useSchemaContext } from '@/stores/app/schema-provider';
import { contextTempReg } from '@/stores/app/utils/data-transformer';
import { refReg } from '@/utils/common-helper';

export function useFieldWatch(formRef: React.RefObject<FormRef>) {
  const prevValuesRef = useRef<Record<string, TValues | undefined>>({});
  const appBuilder = useInjection(AppBuilderModel);

  const stateId = useSchemaContext(state => state.id);

  // 处理 context 变化的函数
  const handleContextChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, name: string) => {
      const oldContext = get(prevValue, reservedKeySchema.Enum.context);
      const newContext = get(newValue, reservedKeySchema.Enum.context);

      getDiffPath(oldContext, newContext).forEach(diff => {
        const { type, path, oldValue, newValue: diffNewValue } = diff;

        switch (type) {
          case DiffTypeEnum.Deleted:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.remove_ref_opts,
              params: {
                paths: [`__${reservedKeySchema.Enum.context}__${path}__`],
              },
            });
            break;
          case DiffTypeEnum.Modified:
            if (
              path?.split('.').pop() === 'name' &&
              oldValue &&
              diffNewValue &&
              oldValue !== diffNewValue
            ) {
              replaceKey(formRef, {
                parentPath: reservedKeySchema.Enum.context,
                oldKey: name.split('.')[1],
                newKey: customSnakeCase(diffNewValue),
                value: get(newContext, name.split('.')[1]),
              });
            }
            break;
          case DiffTypeEnum.Renamed:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: `__${reservedKeySchema.Enum.context}__${path}__`,
                newPath: `__${
                  reservedKeySchema.Enum.context
                }__${customSnakeCase(diffNewValue?.name || '')}__`,
              },
            });
            break;
          default:
            break;
        }
      });
    }, 100),
    [appBuilder.hanldeRefScene],
  );

  // 处理 inputs 变化的函数
  const handleInputsChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, name: string) => {
      const oldInputs = get(prevValue, reservedKeySchema.Enum.inputs);
      const newInputs = get(newValue, reservedKeySchema.Enum.inputs);

      getDiffPath(oldInputs, newInputs).forEach(diff => {
        const { type, path, oldValue, newValue: diffNewValue } = diff;

        switch (type) {
          case DiffTypeEnum.Deleted:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.remove_ref_opts,
              params: { paths: [`${stateId}.${path}`] },
            });
            break;
          case DiffTypeEnum.Modified:
            if (
              path?.split('.').pop() === 'name' &&
              !isNil(oldValue) &&
              !isNil(diffNewValue) &&
              oldValue !== diffNewValue
            ) {
              const newName = getNewName(newInputs, 'Inputs');
              replaceKey(formRef, {
                parentPath: reservedKeySchema.Enum.inputs,
                oldKey: name.split('.')[1],
                newKey: customSnakeCase(diffNewValue || newName),
                value: diffNewValue
                  ? get(newInputs, name.split('.')[1])
                  : {
                      ...(get(newInputs, name.split('.')?.[1]) || {}),
                      name: newName,
                    },
              });
            }
            break;

          case DiffTypeEnum.Renamed:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: `${stateId}.${path}`,
                newPath: `${stateId}.${customSnakeCase(
                  diffNewValue?.name || '',
                )}`,
              },
            });
            break;
        }
      });
    }, 300),
    [stateId, appBuilder.hanldeRefScene],
  );

  // 处理 outputs 变化的函数
  const handleOutputsChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, name: string) => {
      const oldOuputs = get(prevValue, reservedKeySchema.Enum.outputs);
      const newOutputs = get(newValue, reservedKeySchema.Enum.outputs);

      getDiffPath(oldOuputs, newOutputs).forEach(diff => {
        const { type, path, oldValue, newValue: diffNewValue } = diff;

        switch (type) {
          case DiffTypeEnum.Deleted:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.remove_ref_opts,
              params: { paths: [`${stateId}.${path}`] },
            });
            break;
          case DiffTypeEnum.Modified:
            if (
              path?.split('.').pop() === 'name' &&
              oldValue &&
              diffNewValue &&
              oldValue !== diffNewValue
            ) {
              replaceKey(formRef, {
                parentPath: reservedKeySchema.Enum.outputs,
                oldKey: name.split('.')[1],
                newKey: customSnakeCase(diffNewValue),
                value: refReg.test(diffNewValue) // outputs context
                  ? {
                      ...(get(newOutputs, name.split('.')?.[1]) || {}),
                      name: removeBrackets(
                        diffNewValue?.replace(contextTempReg, 'Context/$1'),
                      ),
                    }
                  : get(newOutputs, name.split('.')[1]),
              });
            }
            break;
          case DiffTypeEnum.Renamed:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: `${stateId}.${path}`,
                newPath: `${stateId}.${customSnakeCase(
                  diffNewValue?.name || '',
                )}`,
              },
            });
            break;
        }
      });
    }, 100),
    [stateId, appBuilder.hanldeRefScene],
  );

  // 处理 blocks 变化的函数
  const handleBlocksChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, name: string) => {
      const oldBlocks = get(prevValue, reservedKeySchema.Enum.blocks);
      const newBlocks = get(newValue, reservedKeySchema.Enum.blocks);

      getDiffPath(oldBlocks, newBlocks).forEach(diff => {
        const { type, path, oldValue, newValue: diffNewValue } = diff;

        const index = Number(path?.split('.')?.[0]);
        const blockName = oldBlocks[index]?.name;

        switch (type) {
          case DiffTypeEnum.Deleted:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.remove_ref_opts,
              params: { paths: [`${stateId}.${blockName}`] },
            });
            break;

          case DiffTypeEnum.Modified:
            if (path?.split('.').pop() === 'display_name') {
              const blockDisplayName = `blocks.${
                name?.split('.')?.[1]
              }.display_name`;
              const blockName = `blocks.${name?.split('.')?.[1]}.name`;
              const newName = getNewName(newBlocks, 'Blocks');
              if (!diffNewValue) {
                formRef.current?.setValue(blockDisplayName, newName);
              }
              formRef.current?.setValue(
                blockName,
                customSnakeCase(diffNewValue || newName),
              );
              appBuilder.hanldeRefScene({
                scene: RefSceneEnum.Enum.rename_ref_opt,
                params: {
                  oldPath: `${stateId}.${oldValue}`,
                  newPath: `${stateId}.${customSnakeCase(diffNewValue)}`,
                },
              });
            }

            break;
          case DiffTypeEnum.Reordered:
            // todo 待验证
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.remove_ref_opts_prefix,
              params: {
                prefix: [`${stateId}.${blockName}`],
              },
            });

            break;
          default:
            break;
        }
      });
    }, 100),
    [appBuilder.hanldeRefScene, stateId],
  );

  // 处理 render 变化的函数
  const handleRenderChange = useCallback(
    debounce((newValue: TValues, prevValue: TValues, name: string) => {
      const oldButtons = get(prevValue, [
        reservedKeySchema.Enum.render,
        reservedKeySchema.Enum.buttons,
      ]);
      const newButtons = get(newValue, [
        reservedKeySchema.Enum.render,
        reservedKeySchema.Enum.buttons,
      ]);

      console.log('render>>>', oldButtons, newButtons, name);

      getDiffPath(oldButtons, newButtons).forEach(diff => {
        const { type, path, oldValue, newValue: diffNewValue } = diff;

        switch (type) {
          case DiffTypeEnum.Deleted:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.remove_ref_opts,
              params: { paths: [`${stateId}.${path}`] },
            });
            break;

          case DiffTypeEnum.Modified:
            if (path?.split('.').pop() === 'content') {
              const newName = getNewName(newButtons, 'Buttons');
              let event = `${customSnakeCase(
                `${diffNewValue || newName}`,
              )}.on_click`;
              if (!diffNewValue) {
                formRef.current?.setValue(`${name}.content`, newName);
              }
              formRef.current?.setValue(`${name}.id`, event);
              formRef.current?.setValue(`${name}.on_click.event`, event);

              // TODO 处理payload rename
              appBuilder.hanldeRefScene({
                scene: RefSceneEnum.Enum.rename_ref_opt,
                params: {
                  oldPath: `${stateId}.${oldValue}`,
                  newPath: `${stateId}.${customSnakeCase(diffNewValue)}`,
                },
              });
            }

            break;
          default:
            break;
        }
      });
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
    } else if (
      name.startsWith(reservedKeySchema.Enum.inputs) &&
      newValue?.type === 'state'
    ) {
      handleInputsChange(newValue, prevValue, name);
    } else if (name.startsWith(reservedKeySchema.Enum.outputs)) {
      handleOutputsChange(newValue, prevValue, name);
    } else if (name.startsWith(reservedKeySchema.Enum.blocks)) {
      handleBlocksChange(newValue, prevValue, name);
    } else if (name.startsWith(reservedKeySchema.Enum.render)) {
      handleRenderChange(newValue, prevValue, name);
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
        handleChange(newValue, prevValue, name);
      }

      prevValuesRef.current = cloneDeep(newValue);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [formRef, handleChange]);
}
