import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Initialize Firebase Admin
const initAdmin = () => {
  if (getApps().length === 0) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

    // For development/testing - uses default credentials
    // In production, you should use service account credentials
    initializeApp({
      projectId: projectId,
    })
  }
  
  return getFirestore()
}

// Export admin firestore instance
export const adminDb = initAdmin()