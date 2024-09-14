import * as React from 'react';
import { Icon, IconProps } from '../../icon';

const CaretDown = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return (
    <Icon {...props}>
      <svg
        ref={ref}
        className="w-full h-full"
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5119 17.7818C12.7143 18.7028 11.2857 18.7028 10.4881 17.7818L2.74159 8.83689C1.61984 7.54161 2.53995 5.52759 4.25345 5.52759L19.7466 5.52759C21.4601 5.52759 22.3802 7.54161 21.2584 8.8369L13.5119 17.7818Z" />
      </svg>
    </Icon>
  );
});

export { CaretDown };
