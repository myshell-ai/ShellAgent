import * as React from 'react';
import { Icon, IconProps } from '../../icon';

const CaretRight = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return (
    <Icon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none">
        <path
          d="M8.89092 5.24429C9.35138 5.64306 9.35138 6.35737 8.89092 6.75615L4.41845 10.6294C3.7708 11.1903 2.76379 10.7302 2.76379 9.87349L2.76379 2.12694C2.76379 1.27019 3.7708 0.810134 4.41845 1.37101L8.89092 5.24429Z"
          fill="#8C9196"
        />
      </svg>
    </Icon>
  );
});

export { CaretRight };
