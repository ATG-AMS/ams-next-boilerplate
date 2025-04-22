/* eslint-disable tailwindcss/no-custom-classname */
import React from 'react';
import { cn } from '@/lib/utils';
import { Slot } from '@/components/atoms/Slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center text-ellipsis whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-background text-foreground shadow hover:bg-background/30 hover:text-primary dark:bg-slate-600 dark:text-white hover:dark:text-green-600',
        primary:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        'semi-destructive':
          'bg-background text-foreground shadow hover:bg-destructive/90 hover:text-destructive-foreground',
        outline:
          'border border-border bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        'outline-primary':
          'border border-primary bg-transparent text-primary shadow-sm hover:bg-primary/10',
        dark: 'bg-black text-white shadow hover:bg-black/90 hover:text-gray-300',
      },
      size: {
        default: 'h-8 px-4 py-2',
        sm: 'h-7 rounded-md px-4 text-xs',
        lg: 'h-9 rounded-md px-4',
        withIcon:
          'flex h-9 items-center justify-between gap-1 whitespace-nowrap rounded-md px-3',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
