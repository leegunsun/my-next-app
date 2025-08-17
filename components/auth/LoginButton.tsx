"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { LogIn, User, LogOut } from 'lucide-react'
import { signOut, signInWithCustomToken } from '../../lib/firebase/auth'
import { useAuth } from '../../contexts/AuthContext'
import { AuthModal } from './AuthModal'
import { useMobileBridge } from '../../lib/mobile-bridge'

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
  const [mobileAuthLoading, setMobileAuthLoading] = useState(false)
  const { isAuthAvailable, startMobileLogin, setupAuthCallbacks } = useMobileBridge()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error('Sign out error:', error)
    }
  }

  // Setup mobile bridge authentication callbacks
  useEffect(() => {
    if (isAuthAvailable) {
      setupAuthCallbacks(
        // onLoginSuccess
        async (token: string, userData) => {
          console.log('🎉 Mobile login success!', { userData })
          setMobileAuthLoading(false)
          
          try {
            // Sign in with the custom token from Flutter
            const { error } = await signInWithCustomToken(token)
            if (error) {
              console.error('❌ Failed to sign in with custom token:', error)
            } else {
              console.log('✅ Successfully signed in with mobile token')
            }
          } catch (err) {
            console.error('❌ Error signing in with mobile token:', err)
          }
        },
        // onLoginError
        (errorCode: string, errorMessage: string) => {
          console.error('❌ Mobile login error:', { errorCode, errorMessage })
          setMobileAuthLoading(false)
          alert(`로그인 실패: ${errorMessage}`)
        },
        // onAuthStatus
        (isAuthenticated: boolean) => {
          console.log('📊 Mobile auth status:', isAuthenticated)
        },
        // onLogout
        () => {
          console.log('🚪 Mobile logout completed')
        }
      )
    }
  }, [isAuthAvailable, setupAuthCallbacks])

  const handleMobileAuth = async () => {
    if (!isAuthAvailable) {
      console.log('📱 Mobile bridge not available, falling back to web auth')
      setShowAuthModal(true)
      return
    }

    // For demo purposes, we'll use a simple prompt for email/password
    // In a real app, you might want to show a custom modal or use the existing AuthModal
    const email = prompt('이메일을 입력하세요:')
    const password = prompt('비밀번호를 입력하세요:')
    
    if (!email || !password) {
      return
    }

    setMobileAuthLoading(true)
    
    try {
      const result = await startMobileLogin({ email, password })
      if (!result.success) {
        setMobileAuthLoading(false)
        alert(`Mobile login failed: ${result.message}`)
      }
      // Success will be handled by the callback
    } catch (error) {
      setMobileAuthLoading(false)
      console.error('Error starting mobile login:', error)
      alert('로그인 시작 중 오류가 발생했습니다.')
    }
  }

  if (loading || mobileAuthLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-background-secondary">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-foreground-secondary border-t-transparent rounded-full"
        />
        <span className="text-sm text-foreground-secondary">
          {mobileAuthLoading ? 'Mobile Login...' : 'Loading...'}
        </span>
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
                <Image 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  width={32}
                  height={32}
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
        onClick={isAuthAvailable ? handleMobileAuth : () => setShowAuthModal(true)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
          ${variant === 'minimal' 
            ? 'bg-background-secondary hover:bg-background-tertiary text-foreground' 
            : 'bg-accent-blend text-primary-foreground hover:opacity-90'
          }
        `}
        title={isAuthAvailable ? 'Mobile Bridge Login' : 'Web Login'}
      >
        <LogIn size={16} />
        {isAuthAvailable ? '📱 Sign In' : 'Sign In'}
      </motion.button>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
}