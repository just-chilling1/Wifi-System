import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal text-center text-sm font-semibold tracking-[-0.01em] transition-[background-color,box-shadow,color,border-color,transform] duration-[160ms] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 min-w-0 max-w-full [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-primary/40 aria-invalid:ring-destructive/20 aria-invalid:border-destructive sm:whitespace-nowrap rounded-[12px]",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sapphire hover:bg-primary-hover active:bg-primary-active',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border border-[var(--border-strong)] bg-[var(--layer-elevated)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-brand)]',
        secondary:
          'border border-transparent bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)]',
        ghost:
          'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
        link: 'text-primary underline-offset-4 hover:text-accent hover:underline',
        ink: 'border border-[var(--border-brand)] bg-[var(--layer-feature)] text-[var(--brand-50)] shadow-sapphire hover:bg-[var(--brand-600)]',
      },
      size: {
        default: 'h-11 min-h-11 px-6 py-2 has-[>svg]:px-4',
        sm: 'h-9 min-h-9 gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-12 min-h-12 px-8 has-[>svg]:px-5 text-[15px]',
        icon: 'size-10 shrink-0 rounded-full',
        'icon-sm': 'size-8 shrink-0 rounded-full',
        'icon-lg': 'size-11 shrink-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
