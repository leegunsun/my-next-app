"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

interface SkillProgressProps {
  name: string
  percentage: number
  color?: string
  delay?: number
}

export default function SkillProgress({ 
  name, 
  percentage, 
  color = "primary",
  delay = 0 
}: SkillProgressProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5
  })
  
  const [displayPercentage, setDisplayPercentage] = useState(0)

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setDisplayPercentage(percentage)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [inView, percentage, delay])

  const getColorClass = () => {
    switch (color) {
      case "success":
        return "bg-accent-success"
      case "warning":
        return "bg-accent-warning"
      case "purple":
        return "bg-accent-purple"
      case "info":
        return "bg-accent-info"
      default:
        return "bg-primary"
    }
  }

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{name}</span>
        <motion.span 
          className="text-sm text-foreground-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ delay: delay + 0.5, duration: 0.3 }}
        >
          {displayPercentage}%
        </motion.span>
      </div>
      <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getColorClass()}`}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${displayPercentage}%` : 0 }}
          transition={{
            delay: delay + 0.2,
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
      </div>
    </div>
  )
}