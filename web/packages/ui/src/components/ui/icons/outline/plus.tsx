import * as React from 'react';
import { Icon, IconProps } from '../../icon';

const Plus = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return (
    <Icon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none">
        <path
          d="M9.00003 3.9375C9.31069 3.9375 9.56253 4.18934 9.56253 4.5V8.4375L13.5 8.4375C13.8107 8.4375 14.0625 8.68934 14.0625 9C14.0625 9.31066 13.8107 9.5625 13.5 9.5625L9.56253 9.5625V13.5C9.56253 13.8107 9.31069 14.0625 9.00003 14.0625C8.68937 14.0625 8.43753 13.8107 8.43753 13.5V9.5625L4.50003 9.5625C4.18937 9.5625 3.93753 9.31066 3.93753 9C3.93753 8.68934 4.18937 8.4375 4.50003 8.4375L8.43753 8.4375V4.5C8.43753 4.18934 8.68937 3.9375 9.00003 3.9375Z"
          fill="#3E5CFA"
        />
      </svg>
    </Icon>
  );
});

export { Plus };
