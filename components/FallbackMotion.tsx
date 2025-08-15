// Fallback motion component for when framer-motion is not available
import React from "react"
import Image from 'next/image'

interface AnimationVariant {
  x?: number | string
  y?: number | string
  scale?: number
  rotate?: number
  opacity?: number
  backgroundColor?: string
  [key: string]: unknown
}

interface Transition {
  duration?: number
  delay?: number
  ease?: string | number[]
  type?: "spring" | "tween"
  stiffness?: number
  damping?: number
  [key: string]: unknown
}

interface MotionProps {
  children?: React.ReactNode
  className?: string
  initial?: AnimationVariant | false
  animate?: AnimationVariant
  transition?: Transition
  whileHover?: AnimationVariant
  whileTap?: AnimationVariant
  onClick?: () => void
  href?: string
  target?: string
  rel?: string
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  role?: string
  "aria-label"?: string
  viewport?: { once?: boolean; margin?: string }
  whileInView?: AnimationVariant
  style?: React.CSSProperties
  [key: string]: unknown
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
      type={type} 
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
  img: ({ className, alt = "", src, ...props }: MotionProps & { alt?: string; src?: string; width?: number; height?: number }) => {
    if (src && props.width && props.height) {
      return <Image src={src} alt={alt} width={props.width} height={props.height} className={className} />
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={className} alt={alt} src={src} {...props} />
  }
}