"use client"

import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Lock, User } from 'lucide-react'
import { LoginButton } from './LoginButton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireMaster?: boolean
  fallback?: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireMaster = false,
  fallback 
}) => {
  const { user, loading, isMaster } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-primary text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-foreground-secondary">Checking authentication...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-primary text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Sign In Required</h2>
          <p className="text-foreground-secondary mb-6">
            You need to sign in to access this page.
          </p>
          <LoginButton />
        </motion.div>
      </div>
    )
  }

  if (requireMaster && !isMaster) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-primary text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-accent-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} className="text-accent-warning" />
          </div>
          <h2 className="text-2xl font-medium mb-4">Access Restricted</h2>
          <p className="text-foreground-secondary mb-4">
            This area is restricted to master users only.
          </p>
          <p className="text-sm text-foreground-muted">
            Signed in as: {user.email}
          </p>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}