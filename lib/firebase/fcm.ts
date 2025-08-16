import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updateAdminFCMToken } from './firestore'
import { auth } from './config'
import { isMasterUser } from './auth'
import { db } from './config'
import app from './config'

// Firebase Error interface for proper typing
interface FirebaseError extends Error {
  code?: string
}

// FCM custom endpoint URL
const FCM_ENDPOINT_URL = 'https://sendpushnotification-tzvcof2hmq-uc.a.run.app'

// Token cache to avoid frequent Firestore calls
interface TokenCache {
  token: string | null
  timestamp: number
  ttl: number // Time to live in milliseconds
}

let tokenCache: TokenCache = {
  token: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes cache
}

// Initialize FCM (client-side only)
let messaging: Messaging | null = null

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

// Get admin FCM token directly from Firestore with optimized caching
// DEPRECATED: Use getAdminFCMTokenDirectly() instead
export async function getCachedAdminFCMToken(): Promise<string | null> {
  console.warn('⚠️ DEPRECATED: getCachedAdminFCMToken() is deprecated. Use getAdminFCMTokenDirectly()')
  return getAdminFCMTokenDirectly()
}

// Get admin FCM token directly from Firestore fcm/master document with optimized caching
export async function getAdminFCMTokenDirectly(): Promise<string | null> {
  const now = Date.now()

  try {
    // Direct Firestore access to fcm collection, master document
    const docRef = doc(db, 'fcm', 'master')
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      console.error('❌ FCM master document not found in Firestore at fcm/master')
      console.log('💡 Please ensure FCM token is saved via admin panel: /admin/messages')
      return null
    }
    
    const data = docSnap.data()
    const token = data?.token
    
    if (!token || typeof token !== 'string') {
      console.error('❌ Invalid or missing token field in fcm/master document:', { hasToken: !!token, tokenType: typeof token })
      return null
    }
    
    return token
    
  } catch (error) {
    console.error('❌ Exception while fetching FCM token from fcm/master document:', error)
    
    if (error instanceof Error) {
      console.error('📋 Error details:', {
        message: error.message,
        code: (error as FirebaseError)?.code || 'unknown',
        name: error.name
      })
    }
    
    return null
  }
}

// Clear token cache (useful for logout or token refresh)
export function clearFCMTokenCache(): void {
  tokenCache = {
    token: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000
  }
  console.log('🧹 FCM token cache cleared - next request will fetch from fcm/master document')
}

// Send FCM notification using custom endpoint
export async function sendFCMNotification(notification: FCMNotification): Promise<void> {
  // Get admin token directly from Firestore fcm/master document
  const adminToken = await getAdminFCMTokenDirectly()
  
  if (!adminToken) {
    console.error('❌ Admin FCM token not available from fcm/master document')
    console.log('💡 Troubleshooting steps:')
    console.log('   1. Check if FCM token exists in Firestore at fcm/master')
    console.log('   2. Verify admin has set up FCM token via /admin/messages')
    console.log('   3. Check Firestore permissions for fcm collection')
    throw new Error('FCM token not available - check Firestore fcm/master document')
  }

  try {
    console.log('📤 Sending FCM notification via custom endpoint:', {
      title: notification.title,
      body: notification.body,
      hasToken: !!adminToken,
      endpoint: FCM_ENDPOINT_URL
    })
    
    const requestBody = {
      token: adminToken,
      title: notification.title,
      body: notification.body
    }
    
    console.log('📦 FCM request payload:', {
      ...requestBody,
      token: `${adminToken.substring(0, 20)}...` // Log partial token for debugging
    })
    
    const response = await fetch(FCM_ENDPOINT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Custom FCM endpoint error response:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      })
      throw new Error(`Custom FCM endpoint error: ${response.status} - ${errorText}`)
    }

    const result = await response.text() // Custom endpoint might return text instead of JSON
    console.log('✅ FCM notification sent successfully via custom endpoint:', result)
    
  } catch (error) {
    console.error('❌ Error sending FCM notification via custom endpoint:', error)
    
    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    
    throw error
  }
}

// Save admin FCM token to Firestore (only for master user)
export async function saveAdminFCMTokenToFirestore(token: string): Promise<{ success: boolean; error: string | null }> {
  const currentUser = auth.currentUser
  
  if (!currentUser || !isMasterUser(currentUser)) {
    return {
      success: false,
      error: 'Only master user can save admin FCM token'
    }
  }
  
  try {
    const { error } = await updateAdminFCMToken(token)
    
    if (error) {
      console.error('❌ Error saving admin FCM token:', error)
      return { success: false, error }
    }
    
    // Clear cache to force refresh on next request from fcm/master document
    clearFCMTokenCache()
    
    console.log('✅ Admin FCM token saved successfully to Firestore')
    return { success: true, error: null }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ Exception while saving admin FCM token:', errorMessage)
    return { success: false, error: errorMessage }
  }
}

// Get stored FCM token from localStorage
export function getStoredFCMToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fcm_token')
}

// Enhanced function to request permission and optionally save as admin token
export async function requestNotificationPermissionForAdmin(saveAsAdmin: boolean = false): Promise<string | null> {
  const token = await requestNotificationPermission()
  
  if (token && saveAsAdmin) {
    const currentUser = auth.currentUser
    if (currentUser && isMasterUser(currentUser)) {
      console.log('🔑 Saving FCM token as admin token...')
      const { success, error } = await saveAdminFCMTokenToFirestore(token)
      
      if (success) {
        console.log('✅ FCM token saved as admin token')
      } else {
        console.error('❌ Failed to save FCM token as admin:', error)
      }
    } else {
      console.warn('⚠️ Cannot save as admin token: user is not authenticated master user')
    }
  }
  
  return token
}

/**
 * Test FCM token availability and validity from Firestore fcm/master document
 * 
 * @returns {Promise<{available: boolean, valid: boolean, error: string | null}>} Token status
 */
export async function testFCMTokenAvailability(): Promise<{
  available: boolean
  valid: boolean
  error: string | null
  details: {
    docExists: boolean
    hasTokenField: boolean
    tokenLength: number | null
    tokenFormat: boolean
  }
}> {
  try {
    console.log('🔬 Testing FCM token availability in fcm/master document...')
    
    const docRef = doc(db, 'fcm', 'master')
    const docSnap = await getDoc(docRef)
    
    const docExists = docSnap.exists()
    
    if (!docExists) {
      return {
        available: false,
        valid: false,
        error: 'FCM master document does not exist at fcm/master',
        details: {
          docExists: false,
          hasTokenField: false,
          tokenLength: null,
          tokenFormat: false
        }
      }
    }
    
    const data = docSnap.data()
    const token = data?.token
    const hasTokenField = !!token
    const tokenLength = typeof token === 'string' ? token.length : null
    const tokenFormat = typeof token === 'string' && token.length > 100 && token.includes(':')
    
    console.log('📊 FCM token test results:', {
      docExists,
      hasTokenField,
      tokenLength,
      tokenFormat,
      valid: tokenFormat
    })
    
    return {
      available: hasTokenField,
      valid: tokenFormat,
      error: null,
      details: {
        docExists: true,
        hasTokenField,
        tokenLength,
        tokenFormat
      }
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ FCM token test failed:', errorMessage)
    
    return {
      available: false,
      valid: false,
      error: errorMessage,
      details: {
        docExists: false,
        hasTokenField: false,
        tokenLength: null,
        tokenFormat: false
      }
    }
  }
}