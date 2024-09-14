'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden bg-surface-container-hovered',
  {
    variants: {
      size: {
        xs: 'w-5 h-5 rounded', // 20 4
        sm: 'w-6 h-6 rounded-md', // 24 6
        md: 'w-8 h-8 rounded-lg', // 32 8
        lg: 'w-9 h-9 rounded-lg', // 36 8
        xl: 'w-12 h-12 rounded-xl', // 48 10 no
        '2xl': 'w-14 h-14 rounded-xl', // 56 12
        '3xl': 'w-16 h-16 rounded-xl', // 64 12
        '4xl': 'w-18 h-18 rounded-2xl', // 72 14 no
        '5xl': 'w-21 h-21 rounded-2xl', // 84 16
        '6xl': 'w-30 h-30 rounded-4xl', // 120 24
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> &
    VariantProps<typeof avatarVariants>
>(({ className, size = 'md', ...passProps }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarVariants({ size }), className)}
    {...passProps}
  />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center bg-surface-container-pressed',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> &
    VariantProps<typeof avatarVariants>
>(({ className, size, src, ...passProps }, ref) => (
  <AvatarRoot size={size} className={className}>
    <AvatarImage ref={ref} {...passProps} src={src} />
    <AvatarFallback />
  </AvatarRoot>
));

Avatar.displayName = 'Avatar';

export { Avatar, AvatarRoot, AvatarImage, AvatarFallback };
