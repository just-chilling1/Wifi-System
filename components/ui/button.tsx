import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-normal text-center text-sm font-semibold transition-[background,box-shadow,filter,color,border-color,transform] duration-[160ms] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 min-w-0 max-w-full [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-sapphire-700/25 aria-invalid:ring-destructive/20 aria-invalid:border-destructive sm:whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          'bg-grad-sapphire text-white shadow-sapphire hover:bg-grad-sapphire-hover hover:shadow-sapphire rounded-full font-medium',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 rounded-full',
        outline:
          'border border-[var(--ds-line-strong)] bg-surface !text-ink shadow-sm hover:bg-primary-light hover:border-primary hover:!text-sapphire-700 hover:shadow-hover rounded-full font-medium',
        secondary:
          'border border-[var(--ds-line-strong)] bg-surface !text-ink shadow-sm hover:bg-primary-light hover:border-primary hover:!text-sapphire-700 hover:shadow-hover rounded-full font-medium',
        ghost:
          'text-ink-3 hover:text-ink hover:bg-surface-hover rounded-md',
        link: 'text-sapphire-700 underline-offset-4 hover:underline rounded-md',
        ink: 'bg-grad-ink text-primary-foreground shadow-raised hover:bg-grad-ink-hover rounded-full font-medium',
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
