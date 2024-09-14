import React from 'react';
import { Viewport } from 'reactflow';

export const getCanvasCenter = (
  ref: React.RefObject<HTMLDivElement> | null,
  viewport: Viewport,
) => {
  const { x, y, zoom } = viewport;

  // 获取画布的宽高
  const wrapperBounds = ref?.current?.getBoundingClientRect();
  const canvasWidth = wrapperBounds?.width || 0;
  const canvasHeight = wrapperBounds?.height || 0;

  // 计算中心坐标
  const centerX = (canvasWidth / 2 - x) / zoom;
  const centerY = (canvasHeight / 2 - y) / zoom;

  return { x: centerX, y: centerY };
};
