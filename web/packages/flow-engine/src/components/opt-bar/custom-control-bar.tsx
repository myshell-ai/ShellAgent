import {
  ArrowsPointingOutIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { Tooltip, TooltipTrigger, TooltipContent } from '@shellagent/ui';
import React from 'react';
import { useReactFlow } from 'reactflow';

import 'reactflow/dist/style.css';
import { useReactFlowStore } from '../../store/flow/provider';

export const CustomControlBar = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { onLayoutedByDagre } = useReactFlowStore(state => ({
    onLayoutedByDagre: state.onLayoutedByDagre,
  }));

  const onLayout = () => {
    onLayoutedByDagre();
    setTimeout(() => {
      fitView();
    });
  };

  return (
    <div className="flex absolute bottom-3 z-10 left-4 rounded-xl bg-white p-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            aria-label="Zoom In"
            className="rounded-lg flex justify-center items-center cursor-pointer w-7 h-7 hover:bg-surface-hovered"
            onClick={() => zoomIn()}>
            <MagnifyingGlassPlusIcon className="w-5.5 h-5.5 text-subtle" />
          </div>
        </TooltipTrigger>
        <TooltipContent>Zoom In</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            aria-label="Zoom Out"
            className="rounded-lg flex justify-center items-center cursor-pointer w-7 h-7 hover:bg-surface-hovered"
            onClick={() => zoomOut()}>
            <MagnifyingGlassMinusIcon className="w-5.5 h-5.5 text-subtle" />
          </div>
        </TooltipTrigger>
        <TooltipContent>Zoom Out</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            aria-label="Fit View"
            className="rounded-lg flex justify-center items-center cursor-pointer w-7 h-7 hover:bg-surface-hovered"
            onClick={() => fitView()}>
            <ArrowsPointingOutIcon className="w-5 h-5 text-subtle" />
          </div>
        </TooltipTrigger>
        <TooltipContent>Fit View</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            aria-label="Auto Beautify Layout"
            className="rounded-lg flex justify-center items-center cursor-pointer w-7 h-7 hover:bg-surface-hovered"
            onClick={() => onLayout()}>
            <MapIcon className="w-5.5 h-5.5 text-subtle" />
          </div>
        </TooltipTrigger>
        <TooltipContent>Auto Beautify Layout</TooltipContent>
      </Tooltip>
    </div>
  );
};
