import * as React from 'react';
import { Icon, IconProps } from '../../icon';

const MyshellLogo = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  return (
    <Icon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="41"
        height="26"
        viewBox="0 0 41 26"
        fill="none">
        <path
          d="M10.0374 0C3.36645 0 1.05759 15.5097 0.554639 19.7099C0.511659 20.0689 0.954542 20.2556 1.22234 20.0128C14.3612 8.10026 20.4489 26 25.6634 26C22.7447 26 20.6062 17.7684 17.9194 10.5686C15.8312 4.97264 13.4117 0 10.0374 0Z"
          fill="url(#paint0_linear_507_10589)"
        />
        <path
          d="M39.4882 19.5911C39.7402 19.9001 40.2385 19.6967 40.1769 19.3028C39.5772 15.4662 37.598 5.31671 33.4439 5.31671C30.8909 5.31671 30.2385 10.4551 29.5841 15.6096L29.5821 15.6259C35.1642 15.6259 37.2846 16.8882 39.4882 19.5911Z"
          fill="url(#paint1_linear_507_10589)"
        />
        <path
          d="M17.9194 10.5683C20.6062 17.7681 22.7447 25.9997 25.6633 25.9997C28.2623 25.9997 28.9242 20.8072 29.582 15.6256L29.5841 15.6093C30.2385 10.4548 30.8909 5.31641 33.4439 5.31641C28.3217 5.31641 25.6633 24.0546 17.9194 10.5683Z"
          fill="#DDB1FF"
        />
        <defs>
          <linearGradient
            id="paint0_linear_507_10589"
            x1="0.551727"
            y1="9.20834"
            x2="40.4481"
            y2="9.20834"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#3239DC" />
            <stop offset="0.0001" stopColor="#0026AB" />
            <stop offset="1" stopColor="#7859F2" />
            <stop offset="1" stopColor="#5A38E2" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_507_10589"
            x1="0.551727"
            y1="9.20834"
            x2="40.4481"
            y2="9.20834"
            gradientUnits="userSpaceOnUse">
            <stop stopColor="#3239DC" />
            <stop offset="0.0001" stopColor="#0026AB" />
            <stop offset="1" stopColor="#7859F2" />
            <stop offset="1" stopColor="#5A38E2" />
          </linearGradient>
        </defs>
      </svg>
    </Icon>
  );
});

export { MyshellLogo };
