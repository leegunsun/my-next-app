"use client"

import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'

interface AdminHeaderProps {
  title: string
  description?: string
}

export default function AdminHeader({ 
  title, 
  description
}: AdminHeaderProps) {
  const { user } = useAuth()

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8"
      >
        <div className="flex items-start gap-4">
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
        
        {/* Login Info */}
        {user && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-2 text-sm mt-4"
          >
            <span className="text-foreground-secondary">로그인:</span>
            <span className="font-medium">{user.displayName || user.email}</span>
            <span className="px-2 py-1 bg-accent-success/20 text-accent-success rounded-full text-xs">
              Master
            </span>
          </motion.div>
        )}
        
        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent mt-6 origin-left"
        />
      </motion.div>
    </div>
  )
}