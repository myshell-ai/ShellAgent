/** @jsxImportSource @emotion/react */

import React from 'react';
import { css } from '@emotion/react';

export interface ChatLuiButtonProps {
  label: string;
  onClick: () => void;
}

export const ChatLuiButton = (props: ChatLuiButtonProps) => {
  return (
    <button
      type="button"
      css={css`
        font-size: 14px;
        border-width: 1px;
        border-style: solid;
        color: rgb(32, 34, 35);
        border-color: rgb(228, 233, 240);
      `}
      className="min-w-9 shadow-button_shadow rounded-3xl px-4 py-2 flex space-x-1.5 justify-center items-center disabled:cursor-not-allowed disabled:opacity-70"
      onClick={props.onClick}>
      {props.label}
    </button>
  );
};
