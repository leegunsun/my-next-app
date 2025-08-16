"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface AdminTitleProps {
  title: string
  description?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  className?: string
}

const AdminTitle: React.FC<AdminTitleProps> = ({ 
  title, 
  description, 
  icon: Icon,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`mb-8 ${className}`}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg"
          >
            <Icon size={24} className="text-white" />
          </motion.div>
        )}
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-foreground-secondary mt-2 text-sm md:text-base leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
      
      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent mt-6 origin-left"
      />
    </motion.div>
  )
}

export default AdminTitle