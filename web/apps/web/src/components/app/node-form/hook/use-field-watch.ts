/* eslint-disable */
import { TValues } from '@shellagent/form-engine';
import { RefSceneEnum } from '@shellagent/shared/protocol/app-scope';
import { reservedKeySchema } from '@shellagent/shared/protocol/pro-config';
import { customSnakeCase, removeBrackets } from '@shellagent/shared/utils';
import { FormRef } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { get, cloneDeep, isEqual, debounce, isNil } from 'lodash-es';
import { useEffect, useRef, useCallback } from 'react';
import { produce } from 'immer';

import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { useSchemaContext } from '@/stores/app/schema-provider';
import { contextTempReg } from '@/stores/app/utils/data-transformer';
import { refReg } from '@/utils/common-helper';

import { replaceKey, getDiffPath, DiffTypeEnum, getNewKey } from './form-utils';

export function useFieldWatch(formRef: React.RefObject<FormRef>) {
  const prevValuesRef = useRef<Record<string, TValues | undefined>>({});
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

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
                paths: [
                  `${stateId}.__${reservedKeySchema.Enum.context}__${path}__`,
                ],
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
              const { key: newKey } = getNewKey({
                name: diffNewValue as string,
                nameKey: 'name',
                values: newContext,
                prefix: 'Context',
              });
              replaceKey(formRef, {
                parentPath: reservedKeySchema.Enum.context,
                oldKey: name.split('.')[1],
                newKey,
                value: get(newContext, name.split('.')[1]),
              });
            }
            break;
          case DiffTypeEnum.Renamed:
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: `${stateId}.__${reservedKeySchema.Enum.context}__${path}__`,
                newPath: `${stateId}.__${
                  reservedKeySchema.Enum.context
                }__${customSnakeCase((diffNewValue?.name as string) || '')}__`,
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
              const { key: newKey, name: newName } = getNewKey({
                name: diffNewValue as string,
                nameKey: 'name',
                values: newInputs,
                prefix: 'Inputs',
              });

              replaceKey(formRef, {
                parentPath: reservedKeySchema.Enum.inputs,
                oldKey: name.split('.')[1],
                newKey,
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
            const { key: newKey } = getNewKey({
              name: diffNewValue?.name as string,
              nameKey: 'name',
              values: newInputs,
              prefix: 'Inputs',
            });
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: `${stateId}.${path}`,
                newPath: `${stateId}.${newKey}`,
              },
            });
            break;
          default:
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
              const { key: newKey } = getNewKey({
                name: diffNewValue as string,
                nameKey: 'name',
                values: newOutputs,
                prefix: 'Outputs',
              });
              replaceKey(formRef, {
                parentPath: reservedKeySchema.Enum.outputs,
                oldKey: name.split('.')[1],
                newKey,
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
            const { key: newKey } = getNewKey({
              name: diffNewValue?.name as string,
              nameKey: 'name',
              values: newOutputs,
              prefix: 'Outputs',
            });
            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.rename_ref_opt,
              params: {
                oldPath: `${stateId}.${path}`,
                newPath: `${stateId}.${newKey}`,
              },
            });
            break;
          default:
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
        const {
          type,
          path,
          oldValue,
          newValue: diffNewValue,
          fromIndex,
          toIndex,
        } = diff;

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

              const { key: newKey, name: newName } = getNewKey({
                name: diffNewValue as string,
                nameKey: 'name',
                values: newBlocks,
                prefix: 'Blocks',
              });
              if (!diffNewValue) {
                formRef.current?.setValue(blockDisplayName, newName);
              }
              formRef.current?.setValue(blockName, newKey);
              appBuilder.hanldeRefScene({
                scene: RefSceneEnum.Enum.rename_ref_opt,
                params: {
                  oldPath: `${stateId}.${oldValue}`,
                  newPath: `${stateId}.${newKey}`,
                },
              });
            }
            break;
          case DiffTypeEnum.Reordered:
            const prefix = oldBlocks
              .slice(
                Math.min(fromIndex!, toIndex!),
                Math.max(fromIndex!, toIndex!),
              )
              .map((block: any) => `${stateId}.${block.name}`);

            appBuilder.hanldeRefScene({
              scene: RefSceneEnum.Enum.remove_ref_opts_prefix,
              params: {
                prefix,
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
      if (
        name ===
        `${reservedKeySchema.Enum.render}.${reservedKeySchema.Enum.buttons}`
      ) {
        // 删除button
        const oldButtons = get(prevValue, [
          reservedKeySchema.Enum.render,
          reservedKeySchema.Enum.buttons,
        ]);
        const newButtons = get(newValue, [
          reservedKeySchema.Enum.render,
          reservedKeySchema.Enum.buttons,
        ]);
        getDiffPath(oldButtons, newButtons).forEach(diff => {
          const { type, path } = diff;
          switch (type) {
            case DiffTypeEnum.Deleted:
              appBuilder.hanldeRefScene({
                scene: RefSceneEnum.Enum.remove_ref_opts,
                params: { paths: [`${stateId}.${name}.${path}`] },
              });
              break;
            default:
              break;
          }
        });
      } else if (
        name.startsWith(
          `${reservedKeySchema.Enum.render}.${reservedKeySchema.Enum.buttons}`,
        )
      ) {
        const oldButtonPayloadValue = get(
          prevValue,
          `${name}.on_click.payload`,
        );
        const newButtonPayloadValue = get(newValue, `${name}.on_click.payload`);

        const oldButtonsValue = get(prevValue, [
          reservedKeySchema.Enum.render,
          reservedKeySchema.Enum.buttons,
        ]);
        const newButtonsValue = get(newValue, [
          reservedKeySchema.Enum.render,
          reservedKeySchema.Enum.buttons,
        ]);

        // 修改button名称
        getDiffPath(oldButtonsValue, newButtonsValue).forEach(diff => {
          const { type, path, newValue: diffNewValue, oldValue } = diff;

          if (type === DiffTypeEnum.Modified) {
            if (path?.split('.').pop() === 'content') {
              const { key: newKey, name: newName } = getNewKey({
                name: diffNewValue as string,
                nameKey: 'content',
                values: newButtonsValue,
                prefix: 'Buttons',
              });

              const event = `${newKey}.on_click`;
              if (!diffNewValue) {
                formRef.current?.setValue(`${name}.content`, newName);
              }
              formRef.current?.setValue(`${name}.id`, event);
              formRef.current?.setValue(`${name}.on_click.event`, event);

              appBuilder.hanldeRefScene({
                scene: RefSceneEnum.Enum.rename_ref_opt,
                params: {
                  oldPath: `${stateId}.${oldValue}`,
                  newPath: `${stateId}.${newKey}`,
                },
              });
            }
          }
        });

        getDiffPath(oldButtonPayloadValue, newButtonPayloadValue).forEach(
          diff => {
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
                  const pathParts = path.split('.');
                  const oldPayloadKey = pathParts[pathParts.length - 2];

                  const values = formRef.current?.getValues();
                  const buttons = get(values, 'render.buttons', []);
                  const buttonIndex = parseInt(name.split('.')[2]);

                  const { key: newKey, name: newName } = getNewKey({
                    name: diffNewValue as string,
                    nameKey: 'name',
                    values: newButtonPayloadValue,
                    prefix: 'Buttons Payload',
                  });

                  const newButtons = produce(buttons, (draft: any) => {
                    const oldPayloadValue = get(
                      draft[buttonIndex]?.on_click?.payload,
                      oldPayloadKey,
                    );

                    if (oldPayloadValue) {
                      draft[buttonIndex].on_click.payload[newKey] = {
                        ...oldPayloadValue,
                        name: diffNewValue || newName,
                      };
                      delete draft[buttonIndex].on_click.payload[oldPayloadKey];
                    }
                  });

                  formRef.current?.setValue('render.buttons', newButtons);
                }
              case DiffTypeEnum.Renamed:
                const { key: newKey } = getNewKey({
                  name: diffNewValue?.name as string,
                  nameKey: 'name',
                  values: newButtonPayloadValue,
                  prefix: 'Buttons Payload',
                });
                // 修改payload name
                appBuilder.hanldeRefScene({
                  scene: RefSceneEnum.Enum.rename_ref_opt,
                  params: {
                    oldPath: `${stateId}.${path}`,
                    newPath: `${stateId}.${newKey}`,
                  },
                });
                break;
              default:
                break;
            }
          },
        );
      }
    }, 300),
    [],
  );

  const handleChange = (
    newValue: TValues,
    prevValue: TValues,
    name?: string,
  ): void => {
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