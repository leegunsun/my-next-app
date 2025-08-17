"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { onAuthStateChange, isMasterUser } from '../lib/firebase/auth'
import { initializeMobileBridgeForMaster } from '../lib/mobile-bridge'
import type { UserData } from '../lib/mobile-bridge'

interface AuthContextType {
  user: User | null
  loading: boolean
  isMaster: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isMaster: false
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user)
      setLoading(false)
      
      // Initialize mobile bridge for master account
      if (user && isMasterUser(user)) {
        try {
          console.log('🔑 Master account detected, initializing mobile bridge...')
          
          const userData: UserData = {
            uid: user.uid,
            email: user.email!,
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            isMaster: true,
            timestamp: Date.now()
          }
          
          const result = await initializeMobileBridgeForMaster(userData)
          
          if (result.success) {
            console.log('✅ Mobile bridge initialized successfully for master account')
          } else {
            console.warn('⚠️ Mobile bridge initialization failed:', result.message)
          }
        } catch (error) {
          console.error('❌ Error initializing mobile bridge:', error)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const isMaster = isMasterUser(user)

  const value = {
    user,
    loading,
    isMaster
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}