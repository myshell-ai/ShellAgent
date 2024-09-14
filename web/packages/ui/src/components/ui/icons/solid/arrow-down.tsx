import * as React from 'react';
import { Icon, IconProps } from '../../icon';

const ArrowDown = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return (
    <Icon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none">
        <path
          d="M6.7559 8.8908C6.35713 9.35126 5.64281 9.35126 5.24404 8.8908L1.37077 4.41832C0.80989 3.77068 1.26994 2.76367 2.1267 2.76367L9.87325 2.76367C10.73 2.76367 11.1901 3.77068 10.6292 4.41833L6.7559 8.8908Z"
          fill="#8C9196"
        />
      </svg>
    </Icon>
  );
});

export default ArrowDown;
