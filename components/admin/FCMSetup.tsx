"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, BellOff, Smartphone, AlertCircle, CheckCircle, Copy } from 'lucide-react'
import { requestNotificationPermission, onMessageListener, getStoredFCMToken } from '@/lib/firebase/fcm'

export default function FCMSetup() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [isSettingUp, setIsSettingUp] = useState(false)
  const [setupStatus, setSetupStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Check current notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    // Check for existing FCM token
    const existingToken = getStoredFCMToken()
    if (existingToken) {
      setFcmToken(existingToken)
    }

    // Listen for foreground messages
    const unsubscribe = onMessageListener()
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  const setupNotifications = async () => {
    setIsSettingUp(true)
    setSetupStatus('idle')

    try {
      const token = await requestNotificationPermission()
      
      if (token) {
        setFcmToken(token)
        setNotificationPermission('granted')
        setSetupStatus('success')
        
        // You would typically send this token to your backend to store it
        console.log('FCM Token for admin:', token)
        
        // Show test notification
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification('알림 설정 완료', {
              body: '이제 새 메시지 알림을 받을 수 있습니다.',
              icon: '/favicon.ico',
              tag: 'setup-complete'
            })
          })
        }
      } else {
        setSetupStatus('error')
      }
    } catch (error) {
      console.error('Error setting up notifications:', error)
      setSetupStatus('error')
    } finally {
      setIsSettingUp(false)
    }
  }

  const getPermissionBadge = () => {
    switch (notificationPermission) {
      case 'granted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-success/20 text-accent-success rounded-full font-medium text-xs">
            <CheckCircle size={12} />
            허용됨
          </span>
        )
      case 'denied':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-error/20 text-accent-error rounded-full font-medium text-xs">
            <BellOff size={12} />
            거부됨
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-warning/20 text-accent-warning rounded-full font-medium text-xs">
            <AlertCircle size={12} />
            설정 필요
          </span>
        )
    }
  }

  const copyTokenToClipboard = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken)
      alert('FCM 토큰이 클립보드에 복사되었습니다.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="glass-effect rounded-3xl border border-border/30 shadow-lg backdrop-blur-md p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent-purple rounded-xl flex items-center justify-center shadow-lg">
            <Bell size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              푸시 알림 설정
            </h3>
            <p className="text-foreground-secondary text-sm">
              새 메시지가 도착할 때 휴대폰으로 알림을 받으려면 알림 권한을 허용해주세요.
            </p>
          </div>
        </div>
        
        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent origin-left"
        />
      </motion.div>
      
      <div className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">알림 권한 상태:</span>
          {getPermissionBadge()}
        </div>

        {/* FCM Token Display */}
        {fcmToken && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium">FCM 토큰:</span>
            <div className="mt-2 p-4 bg-background-secondary/50 rounded-2xl text-xs font-mono break-all border border-border/30">
              {fcmToken}
            </div>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={copyTokenToClipboard}
              className="mt-3 px-4 py-2 bg-background-secondary text-foreground hover:bg-background-tertiary rounded-xl font-medium transition-all border border-border flex items-center gap-2 text-sm"
            >
              <Copy size={14} />
              토큰 복사
            </motion.button>
            <p className="text-xs text-foreground-muted mt-2">
              이 토큰을 환경변수 ADMIN_FCM_TOKEN에 설정하세요.
            </p>
          </motion.div>
        )}

        {/* Setup Button */}
        {notificationPermission !== 'granted' && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={setupNotifications}
            disabled={isSettingUp}
            className="w-full bg-accent-blend text-primary-foreground hover:opacity-90 px-8 py-4 rounded-2xl font-medium transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <Smartphone size={20} />
            {isSettingUp ? '설정 중...' : '알림 설정하기'}
          </motion.button>
        )}

        {/* Status Messages */}
        {setupStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-accent-success/10 border border-accent-success/20 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-accent-success" />
              <span className="text-accent-success font-medium">
                알림이 성공적으로 설정되었습니다!
              </span>
            </div>
          </motion.div>
        )}

        {setupStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-accent-error/10 border border-accent-error/20 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-accent-error" />
              <span className="text-accent-error font-medium">
                알림 설정에 실패했습니다. 브라우저 설정을 확인해주세요.
              </span>
            </div>
          </motion.div>
        )}

        {notificationPermission === 'denied' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-accent-warning/10 border border-accent-warning/20 rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-accent-warning mt-0.5" />
              <div className="text-accent-warning">
                <p className="font-medium">알림이 차단되어 있습니다.</p>
                <p className="text-sm mt-1 opacity-90">
                  브라우저 주소창의 자물쇠 아이콘을 클릭하여 알림을 허용해주세요.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="p-4 bg-background-secondary/30 rounded-2xl border border-border/20"
        >
          <p className="text-sm font-medium text-foreground mb-3">설정 방법:</p>
          <ol className="list-decimal list-inside space-y-2 ml-2 text-xs text-foreground-secondary">
            <li>위의 &quot;알림 설정하기&quot; 버튼을 클릭합니다.</li>
            <li>브라우저에서 알림 권한 요청이 나타나면 &quot;허용&quot;을 선택합니다.</li>
            <li>생성된 FCM 토큰을 복사하여 서버 환경변수에 설정합니다.</li>
            <li>이제 새 메시지가 도착하면 휴대폰으로 알림을 받을 수 있습니다.</li>
          </ol>
        </motion.div>
      </div>
    </motion.div>
  )
}