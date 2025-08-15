// Firebase messaging service worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// Initialize Firebase app in the service worker
// Note: You need to replace these with your actual Firebase configuration
firebase.initializeApp({
  apiKey: "your-firebase-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
})

// Initialize Firebase messaging
const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload)

  const notificationTitle = payload.notification?.title || '새 메시지'
  const notificationOptions = {
    body: payload.notification?.body || '새 메시지가 도착했습니다.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'message-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: '메시지 보기'
      },
      {
        action: 'dismiss',
        title: '닫기'
      }
    ],
    data: payload.data
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  
  event.notification.close()
  
  if (event.action === 'view') {
    // Open admin messages page
    event.waitUntil(
      clients.openWindow('/admin/messages')
    )
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return
  } else {
    // Default action - open admin messages page
    event.waitUntil(
      clients.openWindow('/admin/messages')
    )
  }
})