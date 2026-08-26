import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-light shadow-soft',
        accent:
          'bg-accent text-accent-foreground hover:bg-accent-dark shadow-soft',
        outline:
          'border border-border bg-transparent hover:bg-surface text-ink',
        ghost: 'hover:bg-primary/5 text-ink',
        whatsapp: 'bg-[#25D366] text-white hover:bg-[#1fb959] shadow-soft',
        link: 'underline-offset-4 hover:underline text-primary p-0 h-auto',
        destructive: 'bg-status-sold text-white hover:opacity-90',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 px-4 text-[0.85rem]',
        lg: 'h-13 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
