import * as React from "react"
import { cn } from "@/lib/utils"

const cardVariants = {
  base: "transition-all duration-normal ease-linear-ease",
  variants: {
    default: "bg-card text-card-foreground border border-border rounded-lg shadow-sm",
    primary: "bg-background-secondary rounded-3xl border-none shadow-sm",
    notification: "bg-overlay-card rounded-xl border border-border-card backdrop-blur-sm",
    elevated: "bg-background-tertiary rounded-3xl shadow-lg border-none",
    glass: "bg-gradient-glass backdrop-blur-sm rounded-xl border border-border-card",
  },
}

function getCardClasses(variant: keyof typeof cardVariants.variants = "default", className?: string) {
  const baseClasses = cardVariants.base
  const variantClasses = cardVariants.variants[variant] || cardVariants.variants.default
  
  return cn(baseClasses, variantClasses, className)
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "notification" | "elevated" | "glass"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={getCardClasses(variant, className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-3 p-6 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-medium leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-foreground-secondary leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }