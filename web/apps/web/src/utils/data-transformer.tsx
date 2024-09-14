import { TValues } from '@shellagent/form-engine';
// 数据兼容

// 兼容input.choices

export const transformChoicesToValues = (input: TValues = {}) => {
  const transformedInput: Record<string, any> = {};
  Object.keys(input).forEach(key => {
    if (input[key].choices) {
      transformedInput[key] = {
        ...input[key],
        choices: input[key].choices.map((choice: any) => choice.value),
      };
    } else {
      transformedInput[key] = input[key];
    }
  });
  return transformedInput;
};

export const transformValuesToChoices = (input: TValues = {}) => {
  const transformedInput: Record<string, any> = {};
  Object.keys(input).forEach(key => {
    if (input[key].choices) {
      transformedInput[key] = {
        ...input[key],
        choices: input[key].choices.map((value: any) => ({ value })),
      };
    } else {
      transformedInput[key] = input[key];
    }
  });
  return transformedInput;
};
