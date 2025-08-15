"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn, User, LogOut } from 'lucide-react'
import { signOut } from '../../lib/firebase/auth'
import { useAuth } from '../../contexts/AuthContext'
import { AuthModal } from './AuthModal'

interface LoginButtonProps {
  variant?: 'default' | 'minimal'
  showUserInfo?: boolean
}

export const LoginButton: React.FC<LoginButtonProps> = ({ 
  variant = 'default',
  showUserInfo = true 
}) => {
  const { user, loading, isMaster } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-background-secondary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-foreground-secondary border-t-transparent rounded-full"
        />
        <span className="text-sm text-foreground-secondary">Loading...</span>
      </div>
    )
  }

  if (user) {
    if (variant === 'minimal') {
      return (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-background-secondary hover:bg-background-tertiary transition-colors"
          title="Sign out"
        >
          <LogOut size={16} />
        </motion.button>
      )
    }

    return (
      <div className="flex items-center gap-3">
        {showUserInfo && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user.displayName || user.email}
                {isMaster && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-accent-success/20 text-accent-success rounded-full">
                    Master
                  </span>
                )}
              </span>
              {user.displayName && (
                <span className="text-xs text-foreground-secondary">{user.email}</span>
              )}
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-background-secondary hover:bg-background-tertiary transition-colors text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </motion.button>
      </div>
    )
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAuthModal(true)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
          ${variant === 'minimal' 
            ? 'bg-background-secondary hover:bg-background-tertiary text-foreground' 
            : 'bg-accent-blend text-primary-foreground hover:opacity-90'
          }
        `}
      >
        <LogIn size={16} />
        Sign In
      </motion.button>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
}