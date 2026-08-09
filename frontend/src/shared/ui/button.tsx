import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { forwardRef, type ButtonHTMLAttributes } from "react"

import { cn } from "@/shared/lib"

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:opacity-90",
        secondary: "dark:bg-white/10 bg-recap/10 text-recap dark:text-white dark:hover:bg-white/15 hover:bg-recap/20",
        light: "bg-white text-foreground hover:-translate-y-0.5 hover:bg-white/90",
        outline: "border border-line bg-surface text-foreground hover:border-foreground/30",
        ghost: "text-current hover:bg-muted-surface",
      },
      size: {
        sm: "min-h-9 px-4 text-xs",
        md: "min-h-11 px-6",
        lg: "min-h-14 px-8 text-base",
        xl: "min-h-16 px-10 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, className, variant, size, ...props }, ref) => {
    const Component = asChild ? Slot : "button"
    return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  },
)
Button.displayName = "Button"
