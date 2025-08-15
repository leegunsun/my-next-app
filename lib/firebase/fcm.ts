import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import app from './config'

// FCM server key should be stored in environment variables
const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY
const ADMIN_FCM_TOKEN = process.env.ADMIN_FCM_TOKEN // Your device token

// Initialize FCM (client-side only)
let messaging: any = null

if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app)
  } catch (error) {
    console.error('Error initializing FCM:', error)
  }
}

export interface FCMNotification {
  title: string
  body: string
  data?: Record<string, string>
  icon?: string
  clickAction?: string
}

// Request notification permission and get FCM token
export async function requestNotificationPermission(): Promise<string | null> {
  if (!messaging || typeof window === 'undefined') {
    console.warn('FCM not available on server side')
    return null
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission()
    
    if (permission === 'granted') {
      console.log('Notification permission granted.')
      
      // Get FCM token
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY
      })
      
      if (currentToken) {
        console.log('FCM Token:', currentToken)
        // Store this token for the admin
        localStorage.setItem('fcm_token', currentToken)
        return currentToken
      } else {
        console.log('No registration token available.')
        return null
      }
    } else {
      console.log('Unable to get permission to notify.')
      return null
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error)
    return null
  }
}

// Listen for foreground messages
export function onMessageListener() {
  if (!messaging) return () => {}
  
  return onMessage(messaging, (payload) => {
    console.log('Message received:', payload)
    
    // Show browser notification
    if (payload.notification) {
      new Notification(payload.notification.title || '새 알림', {
        body: payload.notification.body,
        icon: payload.notification.icon || '/favicon.ico',
        tag: 'message-notification'
      })
    }
    
    return payload
  })
}

// Send FCM notification (server-side function)
export async function sendFCMNotification(notification: FCMNotification): Promise<void> {
  if (!FCM_SERVER_KEY || !ADMIN_FCM_TOKEN) {
    console.warn('FCM server key or admin token not configured')
    return
  }

  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${FCM_SERVER_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: ADMIN_FCM_TOKEN,
        notification: {
          title: notification.title,
          body: notification.body,
          icon: notification.icon || '/favicon.ico',
          click_action: notification.clickAction || '/'
        },
        data: notification.data || {}
      })
    })

    if (!response.ok) {
      throw new Error(`FCM API error: ${response.status}`)
    }

    const result = await response.json()
    console.log('FCM notification sent successfully:', result)
    
  } catch (error) {
    console.error('Error sending FCM notification:', error)
    throw error
  }
}

// Get stored FCM token
export function getStoredFCMToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fcm_token')
}