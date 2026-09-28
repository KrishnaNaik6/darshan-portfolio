import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
        secondary:
          'border-zinc-700/60 bg-zinc-800/80 text-zinc-300',
        outline:
          'border-zinc-700 text-zinc-400',
        video:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold',
        image:
          'border-amber-500/30 bg-amber-500/10 text-amber-400 font-semibold',
        graphic:
          'border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-semibold',
        featured:
          'border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 font-semibold shadow-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
