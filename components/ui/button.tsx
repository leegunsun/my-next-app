import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-normal ease-linear-ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:opacity-90",
      secondary: "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
      ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
      outline: "border border-border text-foreground hover:bg-muted",
      destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      success: "bg-green-600 text-white hover:bg-green-700",
      warning: "bg-orange-500 text-white hover:bg-orange-600",
      info: "bg-blue-500 text-white hover:bg-blue-600",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-8 text-base",
      xl: "h-14 px-10 text-lg",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
}

function getButtonClasses(variant = "default", size = "default", className = "") {
  const baseClasses = buttonVariants.base
  const variantClasses = buttonVariants.variants.variant[variant as keyof typeof buttonVariants.variants.variant] || buttonVariants.variants.variant.default
  const sizeClasses = buttonVariants.variants.size[size as keyof typeof buttonVariants.variants.size] || buttonVariants.variants.size.default
  
  return cn(baseClasses, variantClasses, sizeClasses, className)
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "outline" | "destructive" | "success" | "warning" | "info" | "link"
  size?: "default" | "sm" | "lg" | "xl" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"
    return (
      <Comp
        className={getButtonClasses(variant, size, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }