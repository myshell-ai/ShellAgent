import * as React from 'react';
import { Icon, IconProps } from '../../icon';

const Code = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return (
    <Icon {...props}>
      <svg
        ref={ref}
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M15.3995 7.375C15.6066 7.01628 15.4837 6.55759 15.125 6.35048C14.7663 6.14337 14.3076 6.26628 14.1005 6.625L8.35048 16.5843C8.14337 16.943 8.26628 17.4017 8.625 17.6088C8.98372 17.8159 9.44241 17.693 9.64952 17.3343L15.3995 7.375Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6 3C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6C21 4.34315 19.6569 3 18 3H6ZM4.5 6C4.5 5.17157 5.17157 4.5 6 4.5H18C18.8284 4.5 19.5 5.17157 19.5 6V18C19.5 18.8284 18.8284 19.5 18 19.5H6C5.17157 19.5 4.5 18.8284 4.5 18V6Z"
        />
      </svg>
    </Icon>
  );
});

export { Code };
