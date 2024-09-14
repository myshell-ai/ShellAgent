/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/display-name */
import { cva, type VariantProps } from 'class-variance-authority';
import { sanitize } from 'isomorphic-dompurify';
import { omit } from 'lodash-es';
import * as React from 'react';

import { cn } from '../../lib/utils';

type DisplayProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof displayVariants>;
type HeadingProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof headingVariants>;
type SubHeadingProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof subHeadingVariants>;
type TextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof textVariants>;
type DescriptionProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof descriptionVariants>;

const colorMap = {
  default: 'text-default',
  subtle: 'text-subtle',
  subtler: 'text-subtler',
  subtlest: 'text-subtlest',
  disabled: 'text-disabled',
  inverse: 'text-inverse',
  'inverse-primary': 'text-inverse-primary',
  'inverse-surface': 'text-inverse-surface',
  static: 'text-static',
  'static-black': 'text-static-black',
  brand: 'text-brand',
  critical: 'text-critical',
  'critical-bolder': 'text-critical-bolder',
  warning: 'text-warning',
  'warning-bolder': 'text-warning-bolder',
  success: 'text-success',
  'success-bolder': 'text-success-bolder',
};
const lineClampMap = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6',
};

const displayVariants = cva('font-semibold', {
  variants: {
    size: {
      '2xl': 'text-7xl',
      xl: 'text-5xl',
      lg: 'text-3xl',
      md: 'text-2xl',
      sm: 'text-xl',
      xs: 'text-lg',
    },
    color: colorMap,
    lineClamp: lineClampMap,
  },
  defaultVariants: {
    size: 'lg',
    color: 'default',
  },
});

const headingVariants = cva('font-medium', {
  variants: {
    size: {
      h1: 'text-2xl',
      h2: 'text-xl',
      h3: 'text-lg',
      h4: 'text-base',
      h5: 'text-sm',
    },
    color: colorMap,
    lineClamp: lineClampMap,
  },
  defaultVariants: {
    size: 'h1',
    color: 'default',
  },
});

const subHeadingVariants = cva('text-default', {
  variants: {
    size: {
      sm: 'text-xs',
      lg: 'text-sm',
    },
    color: colorMap,
    lineClamp: lineClampMap,
  },
  defaultVariants: {
    size: 'lg',
    color: 'default',
  },
});

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      lg: 'text-base',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    },
    color: colorMap,
    lineClamp: lineClampMap,
  },
  defaultVariants: {
    size: 'lg',
    weight: 'regular',
    color: 'default',
  },
});

const descriptionVariants = cva('', {
  variants: {
    size: {
      lg: 'text-xs',
      sm: 'text-2xs',
    },
    weight: {
      regular: 'font-normal',
      medium: 'font-medium',
    },
    color: colorMap,
    lineClamp: lineClampMap,
  },
  defaultVariants: {
    size: 'lg',
    weight: 'regular',
    color: 'subtler',
  },
});

const HComponentMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
} as const;

const TextComponentMap = {
  p: 'p',
  blockquote: 'blockquote',
  span: 'span',
  code: 'code',
  bold: 'b',
  italic: 'i',
  strikethrough: 's',
  underline: 'u',
} as const;

type BlockProps = {
  underline?: boolean;
  strikethrough?: boolean;
  strong?: boolean;
  italic?: boolean;
  dangerous?: boolean;
};
const renderBlock = (
  {
    underline = false,
    strikethrough = false,
    strong = false,
    italic = false,
  }: BlockProps,
  defaultValue: 'p' | 'span' = 'p',
) => {
  const underlineValue = underline && 'underline';
  const strikethroughValue = strikethrough && 'strikethrough';
  const strongValue = strong && 'bold';
  const italicValue = italic && 'italic';

  return TextComponentMap[
    underlineValue ||
      strikethroughValue ||
      strongValue ||
      italicValue ||
      defaultValue
  ];
};

const dangerouText = (text: string) => {
  return sanitize(`${text}`, {
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['style', 'form', 'input', 'checkbox', 'svg'],
    FORBID_ATTR: ['action'],
  });
};

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps & BlockProps
>((props, ref) => {
  const {
    className,
    size,
    color,
    lineClamp,
    children,
    dangerous,
    ...passProps
  } = props;
  const Comp = HComponentMap[size || 'h1'];

  const text = dangerous && dangerouText(`${children}`);

  return (
    <Comp
      ref={ref}
      className={cn(headingVariants({ size, color, lineClamp }), className)}
      {...passProps}
      {...(dangerous && { dangerouslySetInnerHTML: { __html: `${text}` } })}>
      {!dangerous ? children : null}
    </Comp>
  );
});

export const Display = React.forwardRef<
  HTMLElement & HTMLParagraphElement,
  DisplayProps & BlockProps
>((props, ref) => {
  const {
    className,
    size,
    lineClamp,
    underline,
    strikethrough,
    strong,
    italic,
    children,
    dangerous,
    ...passProps
  } = props;
  const Comp = renderBlock(
    {
      underline,
      strikethrough,
      strong,
      italic,
    },
    'span',
  );
  const text = dangerous && dangerouText(`${children}`);

  return (
    <Comp
      ref={ref}
      className={cn(displayVariants({ size, lineClamp }), className)}
      {...omit(passProps, 'lineClamp')}
      {...(dangerous && { dangerouslySetInnerHTML: { __html: `${text}` } })}>
      {!dangerous ? children : null}
    </Comp>
  );
});

export const Title = Heading;

export const SubHeading = React.forwardRef<
  HTMLParagraphElement,
  SubHeadingProps
>((props, ref) => {
  const { className, size, children, lineClamp, ...passProps } = props;

  return (
    <p
      ref={ref}
      className={cn(subHeadingVariants({ size, lineClamp }), className)}
      {...passProps}>
      {children}
    </p>
  );
});

export const SubTitle = SubHeading;

export const Text = React.forwardRef<
  HTMLElement & HTMLParagraphElement,
  TextProps & BlockProps
>((props, ref) => {
  const {
    className,
    size,
    weight,
    color,
    lineClamp,
    underline,
    strikethrough,
    strong,
    italic,
    children,
    dangerous,
    ...passProps
  } = props;
  const Comp = renderBlock(
    {
      underline,
      strikethrough,
      strong,
      italic,
    },
    'span',
  );
  const text = dangerous && dangerouText(`${children}`);

  return (
    <Comp
      ref={ref}
      className={cn(
        textVariants({ size, weight, color, lineClamp }),
        className,
      )}
      {...omit(passProps, 'lineClamp')}
      {...(dangerous && { dangerouslySetInnerHTML: { __html: `${text}` } })}>
      {!dangerous ? children : null}
    </Comp>
  );
});

export const Paragraph = React.forwardRef<
  HTMLElement & HTMLParagraphElement,
  TextProps & BlockProps
>((props, ref) => {
  const {
    className,
    size,
    weight,
    color,
    lineClamp,
    underline,
    strikethrough,
    strong,
    italic,
    children,
    dangerous,
    ...passProps
  } = props;
  const Comp = renderBlock(
    {
      underline,
      strikethrough,
      strong,
      italic,
    },
    'p',
  );
  const text = dangerous && dangerouText(`${children}`);

  return (
    <Comp
      ref={ref}
      className={cn(
        textVariants({ size, weight, color, lineClamp }),
        className,
      )}
      {...passProps}
      {...(dangerous && { dangerouslySetInnerHTML: { __html: `${text}` } })}>
      {!dangerous ? children : null}
    </Comp>
  );
});

export const Description = React.forwardRef<
  HTMLParagraphElement,
  DescriptionProps & BlockProps
>((props, ref) => {
  const {
    className,
    size,
    weight,
    color,
    lineClamp,
    underline,
    strikethrough,
    strong,
    italic,
    children,
    dangerous,
    ...passProps
  } = props;
  const Comp = renderBlock(
    {
      underline,
      strikethrough,
      strong,
      italic,
    },
    'span',
  );
  const text = dangerous && dangerouText(`${children}`);

  return (
    <Comp
      ref={ref}
      className={cn(
        descriptionVariants({ size, weight, color, lineClamp }),
        className,
      )}
      {...omit(passProps, 'lineClamp')}
      {...(dangerous && { dangerouslySetInnerHTML: { __html: `${text}` } })}>
      {!dangerous ? children : null}
    </Comp>
  );
});
