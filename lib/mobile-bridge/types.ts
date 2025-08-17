/**
 * Mobile Bridge Types
 * 
 * Type definitions for mobile webview communication and FCM token management
 */

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isMaster: boolean;
  fcmToken?: string;
  timestamp: number;
}

export interface MobileBridgeAction {
  action: string;
  data: any;
  timestamp: number;
}

export interface FCMTokenData {
  token: string;
  userId?: string;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    timestamp: number;
  };
}

export interface BridgeResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Window interface for mobile bridge functions
declare global {
  interface Window {
    // Android WebView Interface
    AndroidBridge?: {
      receiveFCMToken: (token: string) => void;
      receiveUserData: (userData: string) => void;
      receiveData: (action: string, data: string) => void;
    };
    
    // iOS WebKit Interface
    webkit?: {
      messageHandlers?: {
        fcmTokenHandler?: {
          postMessage: (message: any) => void;
        };
        userDataHandler?: {
          postMessage: (message: any) => void;
        };
        generalHandler?: {
          postMessage: (message: any) => void;
        };
      };
    };
    
    // React Native WebView Interface
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

export type MobilePlatform = 'android' | 'ios' | 'reactnative' | 'unknown';

export interface BridgeConfig {
  enableLogging?: boolean;
  fallbackStorage?: boolean;
  maxRetries?: number;
  timeout?: number;
}