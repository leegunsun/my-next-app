"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, BellOff, Smartphone, AlertCircle, CheckCircle } from 'lucide-react'
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
        return <Badge variant="default"><CheckCircle className="h-3 w-3 mr-1" />허용됨</Badge>
      case 'denied':
        return <Badge variant="destructive"><BellOff className="h-3 w-3 mr-1" />거부됨</Badge>
      default:
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />설정 필요</Badge>
    }
  }

  const copyTokenToClipboard = () => {
    if (fcmToken) {
      navigator.clipboard.writeText(fcmToken)
      alert('FCM 토큰이 클립보드에 복사되었습니다.')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          푸시 알림 설정
        </CardTitle>
        <CardDescription>
          새 메시지가 도착할 때 휴대폰으로 알림을 받으려면 알림 권한을 허용해주세요.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">알림 권한 상태:</span>
          {getPermissionBadge()}
        </div>

        {/* FCM Token Display */}
        {fcmToken && (
          <div>
            <span className="text-sm font-medium">FCM 토큰:</span>
            <div className="mt-1 p-2 bg-muted rounded text-xs font-mono break-all">
              {fcmToken}
            </div>
            <Button
              onClick={copyTokenToClipboard}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              토큰 복사
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              이 토큰을 환경변수 ADMIN_FCM_TOKEN에 설정하세요.
            </p>
          </div>
        )}

        {/* Setup Button */}
        {notificationPermission !== 'granted' && (
          <Button
            onClick={setupNotifications}
            disabled={isSettingUp}
            className="w-full"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            {isSettingUp ? '설정 중...' : '알림 설정하기'}
          </Button>
        )}

        {/* Status Messages */}
        {setupStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">
                알림이 성공적으로 설정되었습니다!
              </span>
            </div>
          </div>
        )}

        {setupStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">
                알림 설정에 실패했습니다. 브라우저 설정을 확인해주세요.
              </span>
            </div>
          </div>
        )}

        {notificationPermission === 'denied' && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div className="text-orange-800">
                <p className="font-medium">알림이 차단되어 있습니다.</p>
                <p className="text-sm mt-1">
                  브라우저 주소창의 자물쇠 아이콘을 클릭하여 알림을 허용해주세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>설정 방법:</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>위의 &quot;알림 설정하기&quot; 버튼을 클릭합니다.</li>
            <li>브라우저에서 알림 권한 요청이 나타나면 &quot;허용&quot;을 선택합니다.</li>
            <li>생성된 FCM 토큰을 복사하여 서버 환경변수에 설정합니다.</li>
            <li>이제 새 메시지가 도착하면 휴대폰으로 알림을 받을 수 있습니다.</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}