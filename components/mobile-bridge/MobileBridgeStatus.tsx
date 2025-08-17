/**
 * Mobile Bridge Status Component
 * 
 * Development component to monitor and test mobile bridge functionality
 * Only shows for master accounts
 */

"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, Wifi, WifiOff, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useMobileBridge } from '../../lib/mobile-bridge/use-mobile-bridge'

export const MobileBridgeStatus: React.FC = () => {
  const { isMaster, user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  
  const {
    isAvailable,
    platform,
    fcmToken,
    isInitialized,
    sendToMobile,
    storeFCMToken,
    clearData,
    refreshStatus,
    status
  } = useMobileBridge()

  // Only show for master accounts
  if (!isMaster || !user) return null

  const handleTestBridge = async () => {
    setTestLoading(true)
    setTestResult(null)
    
    try {
      const testData = {
        type: 'TEST',
        message: 'Mobile bridge test from web',
        timestamp: Date.now(),
        user: {
          email: user.email,
          uid: user.uid
        }
      }
      
      const result = await sendToMobile('BRIDGE_TEST', testData)
      setTestResult(result.success ? '✅ Test successful' : `❌ Test failed: ${result.message}`)
    } catch (error) {
      setTestResult(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTestLoading(false)
    }
  }

  const handleRequestFCM = async () => {
    setTestLoading(true)
    try {
      const result = await storeFCMToken()
      setTestResult(result.success ? '✅ FCM token stored' : `❌ FCM failed: ${result.message}`)
    } catch (error) {
      setTestResult(`❌ FCM error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setTestLoading(false)
    }
  }

  const getPlatformIcon = () => {
    switch (platform) {
      case 'android':
        return '🤖'
      case 'ios':
        return '🍎'
      case 'reactnative':
        return '⚛️'
      default:
        return '🌐'
    }
  }

  const getStatusColor = () => {
    if (isAvailable) return 'text-green-500'
    if (platform !== 'unknown') return 'text-yellow-500'
    return 'text-gray-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      {/* Compact Status */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`
          bg-background border border-border rounded-lg shadow-lg p-3 cursor-pointer
          ${getStatusColor()} flex items-center gap-2
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Smartphone size={16} />
        <span className="text-sm font-medium">
          {getPlatformIcon()} {platform}
        </span>
        {isAvailable ? <Wifi size={14} /> : <WifiOff size={14} />}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
        </motion.div>
      </motion.div>

      {/* Expanded Panel */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="absolute bottom-full right-0 mb-2 bg-background border border-border rounded-lg shadow-xl p-4 w-80"
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Mobile Bridge Status</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={refreshStatus}
                className="p-1 hover:bg-background-secondary rounded"
              >
                <RefreshCw size={14} />
              </motion.button>
            </div>

            {/* Status Info */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-foreground-secondary">Platform:</span>
                <div className="font-mono">{getPlatformIcon()} {platform}</div>
              </div>
              <div>
                <span className="text-foreground-secondary">Available:</span>
                <div className={isAvailable ? 'text-green-500' : 'text-red-500'}>
                  {isAvailable ? 'Yes' : 'No'}
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-foreground-secondary">FCM Token:</span>
                <div className="font-mono text-xs break-all">
                  {fcmToken ? `${fcmToken.substring(0, 20)}...` : 'None'}
                </div>
              </div>
            </div>

            {/* Test Results */}
            {testResult && (
              <div className="p-2 bg-background-secondary rounded text-xs font-mono">
                {testResult}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTestBridge}
                disabled={testLoading}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90 disabled:opacity-50"
              >
                {testLoading ? 'Testing...' : 'Test Bridge'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRequestFCM}
                disabled={testLoading}
                className="flex-1 px-3 py-2 bg-accent-blend text-primary-foreground rounded text-xs font-medium hover:opacity-90 disabled:opacity-50"
              >
                {testLoading ? 'Requesting...' : 'Get FCM'}
              </motion.button>
            </div>

            {/* Debug Info */}
            <details className="text-xs">
              <summary className="cursor-pointer text-foreground-secondary hover:text-foreground">
                Debug Info
              </summary>
              <pre className="mt-2 p-2 bg-background-secondary rounded text-xs overflow-auto max-h-32">
                {JSON.stringify(status, null, 2)}
              </pre>
            </details>

            {/* Clear Data */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearData}
              className="w-full px-3 py-2 bg-red-500/20 text-red-500 rounded text-xs font-medium hover:bg-red-500/30"
            >
              Clear Bridge Data
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default MobileBridgeStatus