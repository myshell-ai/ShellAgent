import React, { memo } from 'react';
import { MiniMap } from 'reactflow';

import { CustomControlBar } from './custom-control-bar';
// import Pannel from "./pannel";
interface OptBarProps {
  children?: React.ReactNode;
}

const OptBar: React.FC<OptBarProps> = ({ children }) => {
  return (
    <>
      <MiniMap
        position="bottom-left"
        style={{
          width: 102,
          height: 72,
        }}
        className="!absolute !left-4 !bottom-14 z-[9999] !m-0 !w-[102px] !h-[72px] !border-[0.5px] !border-black/8 !rounded-lg !shadow-lg"
      />
      <div className="flex items-center mt-1 gap-2 absolute bottom-4 z-[9]">
        {/* <Pannel /> */}
        {children}
      </div>
      <CustomControlBar />
    </>
  );
};

export default memo(OptBar);
