import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-elegant",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-elegant",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Modern Japanese card-style buttons
        category: "bg-card text-card-foreground border border-border hover:border-primary/20 hover:shadow-elegant transform hover:-translate-y-2 hover:scale-105 shadow-soft font-medium tracking-wide transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-red-soft before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        success: "bg-gradient-success text-success-foreground hover:shadow-glow transform hover:scale-105 shadow-soft",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-soft",
        // Exam-specific variants
        exam: "bg-card text-card-foreground border border-border hover:bg-muted/50 hover:shadow-elegant transform hover:-translate-y-0.5",
        fullscreen: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-elegant"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-12 text-base",
        category: "h-20 px-8 py-6 text-lg rounded-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
