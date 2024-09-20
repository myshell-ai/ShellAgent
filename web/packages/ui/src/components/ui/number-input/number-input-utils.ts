import { Decimal } from 'decimal.js';

/**
 * 计算最接近的有效值
 * @param value 当前值
 * @param min 最小值
 * @param max 最大值
 * @param step 步长
 * @returns 最接近的有效值
 */
export function calculateNearestValue(
  value: number,
  min: number | undefined,
  max: number | undefined,
  step: number,
): number {
  if (Number.isNaN(min) || Number.isNaN(max)) {
    return value;
  }
  if (
    step === 1 &&
    Number.isInteger(value) &&
    min !== undefined &&
    value > min &&
    max !== undefined &&
    value < max
  ) {
    return value;
  }
  // 确保值是step的倍数
  const baseValue = min !== undefined ? Math.ceil(min / step) * step : 0;
  const steps = Math.round((value - baseValue) / step);
  let nearestValue = baseValue + steps * step;

  // 确保值在最小值和最大值之间
  if (min !== undefined && nearestValue < min) {
    nearestValue = baseValue;
  }
  if (max !== undefined && nearestValue > max) {
    nearestValue = max;
  }
  // 再次确保结果是step的倍数
  const finalSteps = new Decimal(Math.round((nearestValue - baseValue) / step));
  const decimalBaseValue = new Decimal(baseValue);
  const decimalStep = new Decimal(step);
  nearestValue = decimalBaseValue.add(finalSteps.times(decimalStep)).toNumber();
  return Number.isNaN(nearestValue) ? value : nearestValue;
}
