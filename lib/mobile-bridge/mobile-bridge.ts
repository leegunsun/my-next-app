/**
 * Mobile Bridge Class
 * 
 * Handles communication between web and mobile webview applications
 * Manages FCM token storage and user data transmission for master accounts
 */

import { 
  UserData, 
  MobileBridgeAction, 
  FCMTokenData, 
  BridgeResponse, 
  MobilePlatform, 
  BridgeConfig 
} from './types';
import { 
  getStoredFCMToken, 
  requestNotificationPermissionForAdmin 
} from '../firebase/fcm';

export class MobileBridge {
  private config: BridgeConfig;
  private platform: MobilePlatform;
  
  constructor(config: BridgeConfig = {}) {
    this.config = {
      enableLogging: true,
      fallbackStorage: true,
      maxRetries: 3,
      timeout: 5000,
      ...config
    };
    
    this.platform = this.detectPlatform();
    this.log('🌉 Mobile Bridge initialized', { platform: this.platform });
  }

  /**
   * Detect mobile platform for appropriate bridge method
   */
  private detectPlatform(): MobilePlatform {
    if (typeof window === 'undefined') return 'unknown';
    
    // React Native WebView
    if (window.ReactNativeWebView) {
      return 'reactnative';
    }
    
    // iOS WebKit
    if (window.webkit?.messageHandlers) {
      return 'ios';
    }
    
    // Android WebView
    if (window.AndroidBridge) {
      return 'android';
    }
    
    return 'unknown';
  }

  /**
   * Conditional logging based on config
   */
  private log(message: string, data?: any): void {
    if (this.config.enableLogging) {
      console.log(`[MobileBridge] ${message}`, data || '');
    }
  }

  /**
   * Store FCM token and send to mobile app
   */
  public async storeFCMToken(token?: string): Promise<BridgeResponse> {
    try {
      this.log('📱 Storing FCM token');
      
      // Get token if not provided
      const fcmToken = token || getStoredFCMToken();
      
      if (!fcmToken) {
        // Request new token
        const newToken = await requestNotificationPermissionForAdmin(false);
        if (!newToken) {
          return {
            success: false,
            message: 'Failed to get FCM token'
          };
        }
        return this.storeFCMToken(newToken);
      }

      const tokenData: FCMTokenData = {
        token: fcmToken,
        deviceInfo: {
          userAgent: navigator.userAgent,
          platform: this.platform,
          timestamp: Date.now()
        }
      };

      // Store locally as fallback
      if (this.config.fallbackStorage) {
        localStorage.setItem('mobile_bridge_fcm_token', fcmToken);
        localStorage.setItem('mobile_bridge_fcm_data', JSON.stringify(tokenData));
      }

      // Send to mobile app
      const result = await this.sendToMobile('FCM_TOKEN_STORE', tokenData);
      
      this.log('✅ FCM token stored and sent to mobile', { 
        tokenLength: fcmToken.length,
        platform: this.platform 
      });
      
      return result;
    } catch (error) {
      this.log('❌ Error storing FCM token', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get stored FCM token
   */
  public getFCMToken(): string | null {
    const token = getStoredFCMToken();
    if (!token && this.config.fallbackStorage) {
      return localStorage.getItem('mobile_bridge_fcm_token');
    }
    return token;
  }

  /**
   * Send user data to mobile app (for master account)
   */
  public async sendUserData(userData: UserData): Promise<BridgeResponse> {
    try {
      this.log('👤 Sending user data to mobile', { 
        isMaster: userData.isMaster,
        email: userData.email 
      });

      // Only send if master account
      if (!userData.isMaster) {
        this.log('⚠️ User is not master account, skipping data transmission');
        return {
          success: false,
          message: 'Only master accounts can send data to mobile'
        };
      }

      // Add current FCM token to user data
      const fcmToken = this.getFCMToken();
      const enhancedUserData: UserData = {
        ...userData,
        fcmToken: fcmToken || undefined,
        timestamp: Date.now()
      };

      // Store locally as fallback
      if (this.config.fallbackStorage) {
        localStorage.setItem('mobile_bridge_user_data', JSON.stringify(enhancedUserData));
      }

      const result = await this.sendToMobile('USER_DATA_SEND', enhancedUserData);
      
      this.log('✅ User data sent to mobile app');
      return result;
    } catch (error) {
      this.log('❌ Error sending user data', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send general data to mobile app
   */
  public async sendToMobile(action: string, data: any): Promise<BridgeResponse> {
    return new Promise((resolve) => {
      try {
        const message: MobileBridgeAction = {
          action,
          data,
          timestamp: Date.now()
        };

        this.log(`📤 Sending to mobile [${action}]`, { platform: this.platform });

        switch (this.platform) {
          case 'android':
            this.sendToAndroid(action, data);
            break;
          case 'ios':
            this.sendToIOS(action, data);
            break;
          case 'reactnative':
            this.sendToReactNative(message);
            break;
          default:
            this.log('⚠️ No mobile platform detected, storing locally only');
            if (this.config.fallbackStorage) {
              localStorage.setItem(`mobile_bridge_${action}`, JSON.stringify(data));
            }
            break;
        }

        resolve({ success: true, message: `Data sent via ${this.platform} bridge` });
      } catch (error) {
        this.log('❌ Error sending to mobile', error);
        resolve({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    });
  }

  /**
   * Send data to Android WebView
   */
  private sendToAndroid(action: string, data: any): void {
    if (window.AndroidBridge) {
      const dataString = JSON.stringify(data);
      
      switch (action) {
        case 'FCM_TOKEN_STORE':
          if (window.AndroidBridge.receiveFCMToken) {
            window.AndroidBridge.receiveFCMToken(data.token);
          }
          break;
        case 'USER_DATA_SEND':
          if (window.AndroidBridge.receiveUserData) {
            window.AndroidBridge.receiveUserData(dataString);
          }
          break;
        default:
          if (window.AndroidBridge.receiveData) {
            window.AndroidBridge.receiveData(action, dataString);
          }
          break;
      }
    }
  }

  /**
   * Send data to iOS WebKit
   */
  private sendToIOS(action: string, data: any): void {
    const webkit = window.webkit;
    if (webkit?.messageHandlers) {
      const message = { action, data, timestamp: Date.now() };
      
      switch (action) {
        case 'FCM_TOKEN_STORE':
          webkit.messageHandlers.fcmTokenHandler?.postMessage(message);
          break;
        case 'USER_DATA_SEND':
          webkit.messageHandlers.userDataHandler?.postMessage(message);
          break;
        default:
          webkit.messageHandlers.generalHandler?.postMessage(message);
          break;
      }
    }
  }

  /**
   * Send data to React Native WebView
   */
  private sendToReactNative(message: MobileBridgeAction): void {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    }
  }

  /**
   * Initialize FCM and send initial data for master account
   */
  public async initializeForMasterAccount(userData: UserData): Promise<BridgeResponse> {
    try {
      this.log('🚀 Initializing mobile bridge for master account');

      // Step 1: Store FCM token
      const fcmResult = await this.storeFCMToken();
      if (!fcmResult.success) {
        this.log('⚠️ FCM token storage failed, continuing with user data');
      }

      // Step 2: Send user data
      const userResult = await this.sendUserData(userData);

      // Step 3: Send initialization complete signal
      await this.sendToMobile('MASTER_INIT_COMPLETE', {
        fcmTokenStored: fcmResult.success,
        userDataSent: userResult.success,
        timestamp: Date.now()
      });

      return {
        success: true,
        message: 'Master account initialization complete',
        data: {
          fcmToken: fcmResult.success,
          userData: userResult.success
        }
      };
    } catch (error) {
      this.log('❌ Error initializing for master account', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Initialization failed'
      };
    }
  }

  /**
   * Get bridge status and diagnostics
   */
  public getStatus(): {
    platform: MobilePlatform;
    available: boolean;
    fcmToken: string | null;
    config: BridgeConfig;
  } {
    return {
      platform: this.platform,
      available: this.platform !== 'unknown',
      fcmToken: this.getFCMToken(),
      config: this.config
    };
  }

  /**
   * Clear all stored data
   */
  public clearStoredData(): void {
    if (typeof window !== 'undefined' && this.config.fallbackStorage) {
      localStorage.removeItem('mobile_bridge_fcm_token');
      localStorage.removeItem('mobile_bridge_fcm_data');
      localStorage.removeItem('mobile_bridge_user_data');
      
      // Clear action-specific data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('mobile_bridge_')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    this.log('🧹 Cleared all mobile bridge stored data');
  }
}

// Global instance
let bridgeInstance: MobileBridge | null = null;

/**
 * Get or create mobile bridge instance
 */
export function getMobileBridge(config?: BridgeConfig): MobileBridge {
  if (!bridgeInstance) {
    bridgeInstance = new MobileBridge(config);
  }
  return bridgeInstance;
}

export default MobileBridge;