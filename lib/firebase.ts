// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// 설정 검증
const isConfigComplete = Object.values(firebaseConfig).every(value => value && value !== 'undefined');

// Initialize Firebase (중복 초기화 방지)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics (only on client side)
let analytics: Analytics | null = null;

if (typeof window !== 'undefined' && isConfigComplete) {
  // Analytics 지원 여부 확인 후 초기화
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log('Firebase Analytics initialized successfully');
    } else {
      console.warn('Firebase Analytics is not supported in this environment');
    }
  }).catch((error) => {
    console.error('Error checking Firebase Analytics support:', error);
  });
} else if (!isConfigComplete) {
  console.warn('Firebase configuration is incomplete. Please check your environment variables.');
}

export { app, analytics };