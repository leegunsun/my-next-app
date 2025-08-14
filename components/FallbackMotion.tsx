// Fallback motion component for when framer-motion is not available
import React from "react"

interface MotionProps {
  children: React.ReactNode
  className?: string
  initial?: any
  animate?: any
  transition?: any
  whileHover?: any
  whileTap?: any
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  type?: string
  disabled?: boolean
  role?: string
  "aria-label"?: string
  viewport?: any
  whileInView?: any
}

// Simple div wrapper that ignores motion props
export const motion = {
  div: ({ children, className, onClick, role, ...props }: MotionProps) => (
    <div className={className} onClick={onClick} role={role} {...props}>
      {children}
    </div>
  ),
  nav: ({ children, className, role, ...props }: MotionProps) => (
    <nav className={className} role={role} {...props}>
      {children}
    </nav>
  ),
  section: ({ children, className, ...props }: MotionProps) => (
    <section className={className} {...props}>
      {children}
    </section>
  ),
  h1: ({ children, className, ...props }: MotionProps) => (
    <h1 className={className} {...props}>
      {children}
    </h1>
  ),
  p: ({ children, className, ...props }: MotionProps) => (
    <p className={className} {...props}>
      {children}
    </p>
  ),
  button: ({ children, className, onClick, type, disabled, ...props }: MotionProps) => (
    <button 
      className={className} 
      onClick={onClick} 
      type={type as any} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
  a: ({ children, className, href, target, rel, ...props }: MotionProps) => (
    <a 
      className={className} 
      href={href} 
      target={target} 
      rel={rel}
      {...props}
    >
      {children}
    </a>
  ),
  form: ({ children, className, ...props }: MotionProps) => (
    <form className={className} {...props}>
      {children}
    </form>
  ),
  img: ({ className, ...props }: MotionProps) => (
    <img className={className} {...props} />
  )
}