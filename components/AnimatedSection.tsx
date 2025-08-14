"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { ReactNode } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "scale"
}

export default function AnimatedSection({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.6,
  direction = "up" 
}: AnimatedSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "-50px 0px"
  })

  const getInitialVariant = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 30 }
      case "down":
        return { opacity: 0, y: -30 }
      case "left":
        return { opacity: 0, x: 30 }
      case "right":
        return { opacity: 0, x: -30 }
      case "scale":
        return { opacity: 0, scale: 0.9 }
      default:
        return { opacity: 0, y: 30 }
    }
  }

  const getAnimateVariant = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 }
      case "left":
      case "right":
        return { opacity: 1, x: 0 }
      case "scale":
        return { opacity: 1, scale: 1 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitialVariant()}
      animate={inView ? getAnimateVariant() : getInitialVariant()}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}