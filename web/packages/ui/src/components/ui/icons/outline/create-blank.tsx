import * as React from 'react';
import { Icon, IconProps } from '../../icon';

const CreateBlank = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return (
    <Icon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.6875 2.5C4.51491 2.5 4.375 2.63991 4.375 2.8125V17.1875C4.375 17.3601 4.51491 17.5 4.6875 17.5H13.4375C13.7827 17.5 14.0625 17.7798 14.0625 18.125C14.0625 18.4702 13.7827 18.75 13.4375 18.75H4.6875C3.82455 18.75 3.125 18.0504 3.125 17.1875V2.8125C3.125 1.94955 3.82456 1.25 4.6875 1.25H8.75C13.2373 1.25 16.875 4.88769 16.875 9.375V12.5C16.875 12.8452 16.5952 13.125 16.25 13.125C15.9048 13.125 15.625 12.8452 15.625 12.5V9.6875C15.625 8.47938 14.6456 7.5 13.4375 7.5H12.1875C11.3246 7.5 10.625 6.80044 10.625 5.9375V4.6875C10.625 3.47938 9.64562 2.5 8.4375 2.5H4.6875ZM11.4642 3.05654C11.7263 3.54183 11.875 4.09729 11.875 4.6875V5.9375C11.875 6.11009 12.0149 6.25 12.1875 6.25H13.4375C14.0277 6.25 14.5832 6.39875 15.0685 6.6608C14.374 5.04624 13.0788 3.75102 11.4642 3.05654Z"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.8333 13.75C16.0635 13.75 16.25 13.9365 16.25 14.1667V15.4167H17.5C17.7301 15.4167 17.9167 15.6032 17.9167 15.8333C17.9167 16.0635 17.7301 16.25 17.5 16.25H16.25V17.5C16.25 17.7301 16.0635 17.9167 15.8333 17.9167C15.6032 17.9167 15.4167 17.7301 15.4167 17.5V16.25H14.1667C13.9365 16.25 13.75 16.0635 13.75 15.8333C13.75 15.6032 13.9365 15.4167 14.1667 15.4167H15.4167V14.1667C15.4167 13.9365 15.6032 13.75 15.8333 13.75Z"
        />
      </svg>
    </Icon>
  );
});

export { CreateBlank };