"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '../../contexts/AuthContext'
import { useMobileBridge } from '../../lib/mobile-bridge'
import { AuthUserData } from '../../lib/mobile-bridge/types'

interface AuthEvent {
  id: string
  type: 'success' | 'error' | 'status' | 'logout'
  message: string
  timestamp: Date
  data?: Record<string, unknown>
}

export default function MobileAuthTestPage() {
  const { user, isMaster } = useAuth()
  const { isAuthAvailable, startMobileLogin, checkMobileAuthStatus, startMobileLogout, setupAuthCallbacks } = useMobileBridge()
  
  const [events, setEvents] = useState<AuthEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  // Add event to log
  const addEvent = (type: AuthEvent['type'], message: string, data?: Record<string, unknown>) => {
    const event: AuthEvent = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      data
    }
    setEvents(prev => [event, ...prev].slice(0, 50)) // Keep last 50 events
  }

  // Setup callbacks on mount
  useEffect(() => {
    if (isAuthAvailable) {
      setupAuthCallbacks(
        // onLoginSuccess
        (token: string, userData: AuthUserData) => {
          addEvent('success', `Login successful for ${userData.email}`, { token: token.substring(0, 20) + '...', userData })
          setIsLoading(false)
        },
        // onLoginError  
        (errorCode: string, errorMessage: string) => {
          addEvent('error', `Login failed: ${errorMessage}`, { errorCode })
          setIsLoading(false)
        },
        // onAuthStatus
        (isAuthenticated: boolean) => {
          addEvent('status', `Auth status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`, { isAuthenticated })
        },
        // onLogout
        () => {
          addEvent('logout', 'Logout completed successfully')
          setIsLoading(false)
        }
      )

      addEvent('status', 'Mobile bridge authentication callbacks initialized')
    } else {
      addEvent('error', 'Mobile bridge authentication not available')
    }
  }, [isAuthAvailable, setupAuthCallbacks])

  const handleLogin = async () => {
    if (!credentials.email || !credentials.password) {
      addEvent('error', 'Please enter both email and password')
      return
    }

    setIsLoading(true)
    addEvent('status', `Starting mobile login for ${credentials.email}`)

    try {
      const result = await startMobileLogin(credentials)
      if (result.success) {
        addEvent('status', 'Mobile login request sent successfully')
      } else {
        addEvent('error', `Failed to start mobile login: ${result.message}`)
        setIsLoading(false)
      }
    } catch (error) {
      addEvent('error', `Error starting mobile login: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }

  const handleCheckStatus = async () => {
    setIsLoading(true)
    addEvent('status', 'Checking mobile auth status')

    try {
      const result = await checkMobileAuthStatus()
      if (result.success) {
        addEvent('status', 'Auth status check request sent')
      } else {
        addEvent('error', `Failed to check auth status: ${result.message}`)
      }
    } catch (error) {
      addEvent('error', `Error checking auth status: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)
    addEvent('status', 'Starting mobile logout')

    try {
      const result = await startMobileLogout()
      if (result.success) {
        addEvent('status', 'Mobile logout request sent')
      } else {
        addEvent('error', `Failed to start mobile logout: ${result.message}`)
        setIsLoading(false)
      }
    } catch (error) {
      addEvent('error', `Error starting mobile logout: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setIsLoading(false)
    }
  }

  const getEventIcon = (type: AuthEvent['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />
      case 'error':
        return <XCircle size={16} className="text-red-500" />
      case 'logout':
        return <ArrowLeft size={16} className="text-orange-500" />
      default:
        return <Clock size={16} className="text-blue-500" />
    }
  }

  const clearEvents = () => {
    setEvents([])
    addEvent('status', 'Event log cleared')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-background-secondary">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-foreground-secondary hover:text-foreground transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <Smartphone size={20} className="text-primary" />
              <h1 className="text-lg font-medium">Mobile Auth Bridge Test</h1>
            </div>
          </div>
          <div className="text-sm text-foreground-secondary">
            Master: {isMaster ? '✅' : '❌'} | Bridge: {isAuthAvailable ? '✅' : '❌'}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Status Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background-secondary rounded-2xl p-6"
          >
            <h2 className="text-xl font-medium mb-4">Current Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <div className="text-sm text-foreground-secondary mb-1">Web User</div>
                <div className={user ? 'text-green-500' : 'text-gray-500'}>
                  {user ? `✅ ${user.email}` : '❌ Not signed in'}
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-sm text-foreground-secondary mb-1">Bridge Auth</div>
                <div className={isAuthAvailable ? 'text-green-500' : 'text-red-500'}>
                  {isAuthAvailable ? '✅ Available' : '❌ Not available'}
                </div>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <div className="text-sm text-foreground-secondary mb-1">Master Account</div>
                <div className={isMaster ? 'text-green-500' : 'text-gray-500'}>
                  {isMaster ? '✅ Master' : '❌ Regular user'}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Test Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-background-secondary rounded-2xl p-6"
          >
            <h2 className="text-xl font-medium mb-4">Authentication Tests</h2>
            
            {!isAuthAvailable ? (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600">
                ⚠️ Mobile bridge authentication is not available. This test requires a mobile environment.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Login Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={credentials.email}
                      onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="test@example.com"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="password123"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {isLoading ? '🔄 Testing...' : '🔐 Test Login'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckStatus}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    📊 Check Status
                  </motion.button>

                  {user && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
                    >
                      🚪 Test Logout
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Event Log */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background-secondary rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium">Event Log</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearEvents}
                className="px-3 py-1 bg-gray-500/20 text-gray-500 rounded text-sm hover:bg-gray-500/30"
              >
                Clear
              </motion.button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <div className="text-foreground-secondary text-center py-8">
                  No events yet. Try testing the authentication features above.
                </div>
              ) : (
                events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 bg-background rounded-lg"
                  >
                    {getEventIcon(event.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{event.message}</span>
                        <span className="text-xs text-foreground-secondary">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {event.data && (
                        <details className="text-xs text-foreground-secondary">
                          <summary className="cursor-pointer hover:text-foreground">Show data</summary>
                          <pre className="mt-1 p-2 bg-background-secondary rounded text-xs overflow-auto">
                            {JSON.stringify(event.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}