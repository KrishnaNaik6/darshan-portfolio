import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 text-zinc-900 shadow hover:bg-white font-semibold',
        destructive:
          'bg-red-600 text-white shadow-sm hover:bg-red-500',
        outline:
          'border border-zinc-800 bg-transparent text-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-700',
        secondary:
          'bg-zinc-800 text-zinc-200 shadow-sm hover:bg-zinc-700 hover:text-white',
        ghost:
          'text-zinc-300 hover:bg-zinc-800/60 hover:text-white',
        link:
          'text-zinc-100 underline-offset-4 hover:underline',
        accent:
          'bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-semibold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-md px-8 text-base tracking-wide',
        icon: 'h-10 w-10',
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
