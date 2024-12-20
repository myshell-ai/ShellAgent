import { QuestionMarkCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  FieldValues,
  useFormContext,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  IconButton,
  Switch,
  Text,
} from '@shellagent/ui';
import { isEmpty, omit } from 'lodash-es';
import React, { useRef, useState } from 'react';
import { FieldModeEnum } from '@shellagent/shared/protocol/extend-config';

import { ISchema } from '../../types';
import { cn } from '../../utils/cn';
import { getDefaultValueBySchema } from '../../utils/generate-schema';
import { createValidator } from '../../utils/validator';
import { EditTitle } from '../edit-title';
import { useFormEngineContext } from '../provider';
import WarningValidate from './warning-validate';

interface IControlProps {
  name: string;
}

/**
 * @param props
 * @returns
 */
const Control: React.FC<IControlProps> = props => {
  const { name } = props;
  const { fields, components, remove, onStatusChange } = useFormEngineContext();
  const { setValue, getValues } = useFormContext();
  const { schema, state, parent } = fields[name] || {};
  const preType = useRef('');
  const {
    'x-type': xType,
    'x-component': xComponent,
    'x-title-editable': xTitleEditable,
    'x-hidden-title': xHiddenTitle,
    'x-hidden-control': xHiddenControl,
    'x-title-component-props': xTitleComponentProps,
    'x-deletable': xDeletable,
    'x-parent-deletable': xParentDeletable,
    'x-component-props': xComponentProps,
    'x-layout': xLayout,
    'x-validator': xValidator,
    'x-validator-render': xValidatorRender,
    'x-disabled': xDisabled,
    'x-read-only': xReadOnly,
    'x-hidden': xHidden,
    'x-value-prop-name': xValuePropsName,
    'x-onchange-prop-name': xOnChangePropsName,
    'x-raw': xRaw,
    'x-raw-default': xRawDefault,
    'x-suffix': xSuffix,
    'x-prefix': xPrefix,
    'x-class': xClass,
    'x-field-type': xFieldType,
    'x-switchable': xSwithable,
    'x-switchable-default': xSwitchableDefault,
    'x-switch-default-value': xSwitchDefaultValue,
    anyOf,
    title,
    description,
    default: defaultValue,
  } = schema;
  const [mode, setMode] = useState(xRawDefault || FieldModeEnum.Enum.ui);

  let titleControl: React.ReactElement<
    unknown,
    string | React.JSXElementConstructor<any>
  > | null = null;

  if (!schema) {
    return null;
  }

  const onDelete = () => {
    remove(xDeletable ? name : parent);
  };

  const [oldValue, setOldValue] = useState();

  const [checked, setChecked] = useState(
    !!getValues(name) || xSwitchableDefault,
  );
  const onCheckedChange = (checked: boolean) => {
    if (!checked) {
      setOldValue(getValues(name));
    }

    setValue(
      name,
      checked
        ? oldValue || getDefaultValueBySchema(schema, true)
        : xSwitchDefaultValue,
    );
    setChecked(checked);
  };

  const { required } = xValidator?.find(item => !!item.required) || {};
  const { control } = useFormContext();
  const validator = createValidator(schema);
  const warningRules = xValidator?.filter(item => item.warningOnly);

  if (!(xComponent && components[xComponent])) {
    return null;
  }

  const passProps = {
    disabled: xDisabled,
    readOnly: xReadOnly,
    defaultValue,
    schemaTypes: anyOf
      ? (anyOf as ISchema[]).map(item => item['x-field-type'])
      : xFieldType
      ? [xFieldType]
      : null,
    ...xComponentProps,
  };

  const layout =
    mode === FieldModeEnum.Enum.raw
      ? 'Vertical'
      : xLayout === 'Horizontal' || mode === FieldModeEnum.Enum.ref
      ? 'Horizontal'
      : undefined;

  if (title) {
    titleControl = (
      <FormLabel required={required} className="break-all">
        {xPrefix
          ? React.createElement(components[xPrefix], {
              ...passProps,
              name,
            })
          : null}
        {title}
      </FormLabel>
    );
  }

  if (xTitleEditable) {
    titleControl = (
      <EditTitle {...xTitleComponentProps} defaultValue={title} path={parent} />
    );
  }
  return (
    <div
      className={cn('w-full', xClass, { hidden: xHidden })}
      data-ui="control">
      <FormField
        control={control}
        name={name}
        rules={{
          validate: v => {
            if (xRaw) {
              return true;
            }
            const result = validator?.safeParse(v);

            // 校验default
            if (v === null && defaultValue === null) {
              return true;
            }

            if (
              result &&
              !result.success &&
              Array.isArray(result.error.issues) &&
              result.error.issues.length
            ) {
              const [{ message }] = result.error.issues;
              if (!required && message === 'Required') {
                return true;
              }

              return message;
            }

            return result?.success;
          },
        }}
        render={({ field, fieldState }) => {
          const newField: { [key: string]: FieldValues } = {};
          const valuePropsName = xValuePropsName || 'value';
          const renderFormItem = () => {
            if (mode === FieldModeEnum.Enum.ref) {
              return React.createElement(components.VariableSelect, {
                triggerClassName: 'h-6',
                ...passProps,
                ...field,
                ...newField,
              });
            }
            if (mode === FieldModeEnum.Enum.raw) {
              return React.createElement(components.ExpressionInput, {
                ...passProps,
                ...field,
                ...newField,
              });
            }
            return React.createElement(components[xComponent], {
              ...passProps,
              ...field,
              ...newField,
              onMouseDownCapture: (e: React.DragEvent) => {
                e.stopPropagation();
              },
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === 'Backspace' || e.key === 'Delete') {
                  e.stopPropagation();
                }
              },
              onWheel: (e: React.WheelEvent) => e.stopPropagation(),
              onWheelCapture: (e: React.WheelEvent) => e.stopPropagation(),
            });
          };
          newField[valuePropsName] = state?.hasOwnProperty('value')
            ? state.value
            : field.value;
          // react-hook-form 通过副作用set空值不会生效，这里手动onChange，后续怎么做更合理以及如何避免rerender
          if (state?.hasOwnProperty('value') && state.value !== field.value) {
            field.onChange({ target: { value: state.value } });
          }
          if (
            name.endsWith('.type') &&
            fields[parent].schema['x-anyof'] &&
            field?.value !== preType.current
          ) {
            const optionSchema = fields[parent].schema['x-anyof']?.find(
              option => option?.properties?.type?.const === field?.value,
            );
            const prevValues = getValues(parent);
            const isEmptyParent = isEmpty(omit(prevValues, ['type']));
            const defaultValues =
              !preType.current && !isEmptyParent
                ? prevValues
                : optionSchema?.default ||
                  getDefaultValueBySchema(
                    omit(optionSchema, ['default']),
                    false,
                  );
            if (defaultValues) {
              setValue(parent, defaultValues);
            }
            preType.current = field?.value;
          }

          if (xOnChangePropsName) {
            newField[xOnChangePropsName] = field.onChange;
          }
          const missOption =
            xComponentProps?.options?.length &&
            newField[valuePropsName] &&
            !xRaw &&
            !xComponentProps?.options?.find(
              (item: { value: string }) =>
                item.value === (newField[valuePropsName] as unknown as string),
            );
          if (missOption !== undefined) {
            onStatusChange?.({ [name]: missOption ? 'missOption' : '' });
          }
          const FormItemWithDesc =
            (!checked && xSwithable) || xHiddenControl ? null : (
              <div className="flex-1">
                <FormControl>{renderFormItem()}</FormControl>
                {fieldState.error ? <FormMessage /> : null}
                {missOption ? (
                  <Text color="critical">
                    {newField[valuePropsName] as unknown as string} is
                    undefined.
                  </Text>
                ) : null}
              </div>
            );
          const Wraning =
            Array.isArray(warningRules) && warningRules.length ? (
              xValidatorRender ? (
                React.createElement(components[xValidatorRender], {
                  rules: warningRules,
                  value: newField[valuePropsName],
                })
              ) : (
                <WarningValidate
                  rules={warningRules}
                  value={newField[valuePropsName]}
                />
              )
            ) : null;

          return (
            <FormItem layout={layout} className="flex-wrap">
              {xRaw || titleControl ? (
                <div className={cn('flex items-center w-full gap-x-2')}>
                  <div
                    className={cn(
                      'flex items-center shrink-0',
                      (titleControl && xType === 'Control') ||
                        (xRaw && xType === 'Block')
                        ? 'w-28 mr-2'
                        : '',
                    )}>
                    {!xHiddenTitle && titleControl && xType === 'Control'
                      ? titleControl
                      : null}
                    {xRaw && xType === 'Block' ? (
                      <FormLabel required={required}>Value</FormLabel>
                    ) : null}
                    {description && xType === 'Control' ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger type="button">
                            <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-subtlest ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <FormDescription>{description}</FormDescription>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    {layout === 'Horizontal' || (xRaw && !titleControl)
                      ? FormItemWithDesc
                      : null}
                  </div>
                  <div className="flex items-center gap-x-1.5 shrink-0">
                    {xRaw && components?.ModeSelect
                      ? React.createElement(components.ModeSelect, {
                          name,
                          onChange: setMode,
                        })
                      : null}
                    {xParentDeletable || xDeletable ? (
                      <IconButton
                        size="sm"
                        color="gray"
                        type="button"
                        variant="ghost"
                        icon={TrashIcon}
                        onClick={onDelete}
                        className="border-0 hover:bg-surface-accent-gray-subtle focus-visible:ring-0"
                      />
                    ) : null}
                    {xSwithable ? (
                      <Switch
                        size="sm"
                        onCheckedChange={onCheckedChange}
                        checked={checked}
                      />
                    ) : null}
                    {xSuffix
                      ? React.createElement(components[xSuffix], {
                          ...passProps,
                          ...field,
                          ...newField,
                        })
                      : null}
                  </div>
                </div>
              ) : null}
              {layout === 'Horizontal' || (xRaw && !titleControl) ? (
                <div className="w-full !ml-0">{Wraning}</div>
              ) : (
                <>
                  {FormItemWithDesc}
                  {Wraning}
                </>
              )}
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default React.memo(Control, () => true);
