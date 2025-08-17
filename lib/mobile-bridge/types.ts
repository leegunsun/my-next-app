/**
 * Mobile Bridge Types
 * 
 * Type definitions for mobile webview communication and FCM token management
 */

// Type for logging data - allows objects with string keys and primitive values
export type LoggingData = Record<string, string | number | boolean | null | undefined> | string | number | boolean | null | undefined;

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isMaster: boolean;
  fcmToken?: string;
  timestamp: number;
}

// Mobile bridge data types for type-safe communication
export type MobileBridgeData = 
  | UserData 
  | FCMTokenData 
  | { fcmTokenStored: boolean; userDataSent: boolean; timestamp: number }
  | { type: string; message: string; timestamp: number; user?: { email: string; uid: string } }
  | Record<string, unknown>;

export interface MobileBridgeAction {
  action: string;
  data: MobileBridgeData;
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
  data?: {
    fcmToken?: boolean;
    userData?: boolean;
  } | Record<string, unknown>;
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
          postMessage: (message: { action: string; data: MobileBridgeData; timestamp: number }) => void;
        };
        userDataHandler?: {
          postMessage: (message: { action: string; data: MobileBridgeData; timestamp: number }) => void;
        };
        generalHandler?: {
          postMessage: (message: { action: string; data: MobileBridgeData; timestamp: number }) => void;
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