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
  BridgeConfig,
  MobileBridgeData,
  LoggingData,
  AuthCredentials,
  AuthUserData
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
  private log(message: string, data?: LoggingData): void {
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
      this.log('❌ Error storing FCM token', { error: error instanceof Error ? error.message : String(error) });
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
      this.log('❌ Error sending user data', { error: error instanceof Error ? error.message : String(error) });
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send general data to mobile app
   */
  public async sendToMobile(action: string, data: MobileBridgeData): Promise<BridgeResponse> {
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
        this.log('❌ Error sending to mobile', { error: error instanceof Error ? error.message : String(error) });
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
  private sendToAndroid(action: string, data: MobileBridgeData): void {
    if (window.AndroidBridge) {
      const dataString = JSON.stringify(data);
      
      switch (action) {
        case 'FCM_TOKEN_STORE':
          if (window.AndroidBridge.receiveFCMToken && 'token' in data && typeof data.token === 'string') {
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
  private sendToIOS(action: string, data: MobileBridgeData): void {
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
      this.log('❌ Error initializing for master account', { error: error instanceof Error ? error.message : String(error) });
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
   * Authentication Methods
   */

  /**
   * Check if mobile authentication bridge is available
   */
  public isAuthBridgeAvailable(): boolean {
    return this.platform !== 'unknown' && (
      typeof window.startFlutterLogin === 'function' ||
      (window.AndroidBridge?.startLogin !== undefined) ||
      (window.webkit?.messageHandlers?.authHandler !== undefined)
    );
  }

  /**
   * Start mobile authentication process
   */
  public async startMobileLogin(credentials: AuthCredentials): Promise<BridgeResponse> {
    try {
      this.log('🔐 Starting mobile authentication', { email: credentials.email });

      if (!this.isAuthBridgeAvailable()) {
        return {
          success: false,
          message: 'Mobile authentication bridge not available'
        };
      }

      // Call appropriate platform method
      switch (this.platform) {
        case 'android':
          if (window.AndroidBridge?.startLogin) {
            window.AndroidBridge.startLogin(credentials.email, credentials.password);
          } else if (window.startFlutterLogin) {
            window.startFlutterLogin(credentials.email, credentials.password);
          }
          break;
        case 'ios':
          if (window.webkit?.messageHandlers?.authHandler) {
            window.webkit.messageHandlers.authHandler.postMessage({
              action: 'START_LOGIN',
              data: credentials,
              timestamp: Date.now()
            });
          } else if (window.startFlutterLogin) {
            window.startFlutterLogin(credentials.email, credentials.password);
          }
          break;
        case 'reactnative':
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              action: 'START_LOGIN',
              data: credentials,
              timestamp: Date.now()
            }));
          }
          break;
        default:
          if (window.startFlutterLogin) {
            window.startFlutterLogin(credentials.email, credentials.password);
          }
          break;
      }

      return {
        success: true,
        message: 'Mobile login initiated'
      };
    } catch (error) {
      this.log('❌ Error starting mobile login', { error: error instanceof Error ? error.message : String(error) });
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check mobile authentication status
   */
  public async checkMobileAuthStatus(): Promise<BridgeResponse> {
    try {
      this.log('🔍 Checking mobile authentication status');

      if (!this.isAuthBridgeAvailable()) {
        return {
          success: false,
          message: 'Mobile authentication bridge not available'
        };
      }

      // Call appropriate platform method
      switch (this.platform) {
        case 'android':
          if (window.AndroidBridge?.checkAuthStatus) {
            window.AndroidBridge.checkAuthStatus();
          } else if (window.checkFlutterAuthStatus) {
            window.checkFlutterAuthStatus();
          }
          break;
        case 'ios':
          if (window.webkit?.messageHandlers?.authHandler) {
            window.webkit.messageHandlers.authHandler.postMessage({
              action: 'CHECK_AUTH_STATUS',
              data: {},
              timestamp: Date.now()
            });
          } else if (window.checkFlutterAuthStatus) {
            window.checkFlutterAuthStatus();
          }
          break;
        case 'reactnative':
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              action: 'CHECK_AUTH_STATUS',
              data: {},
              timestamp: Date.now()
            }));
          }
          break;
        default:
          if (window.checkFlutterAuthStatus) {
            window.checkFlutterAuthStatus();
          }
          break;
      }

      return {
        success: true,
        message: 'Auth status check initiated'
      };
    } catch (error) {
      this.log('❌ Error checking auth status', { error: error instanceof Error ? error.message : String(error) });
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Start mobile logout process
   */
  public async startMobileLogout(): Promise<BridgeResponse> {
    try {
      this.log('🚪 Starting mobile logout');

      if (!this.isAuthBridgeAvailable()) {
        return {
          success: false,
          message: 'Mobile authentication bridge not available'
        };
      }

      // Call appropriate platform method
      switch (this.platform) {
        case 'android':
          if (window.AndroidBridge?.logout) {
            window.AndroidBridge.logout();
          } else if (window.flutterLogout) {
            window.flutterLogout();
          }
          break;
        case 'ios':
          if (window.webkit?.messageHandlers?.authHandler) {
            window.webkit.messageHandlers.authHandler.postMessage({
              action: 'LOGOUT',
              data: {},
              timestamp: Date.now()
            });
          } else if (window.flutterLogout) {
            window.flutterLogout();
          }
          break;
        case 'reactnative':
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              action: 'LOGOUT',
              data: {},
              timestamp: Date.now()
            }));
          }
          break;
        default:
          if (window.flutterLogout) {
            window.flutterLogout();
          }
          break;
      }

      return {
        success: true,
        message: 'Mobile logout initiated'
      };
    } catch (error) {
      this.log('❌ Error starting mobile logout', { error: error instanceof Error ? error.message : String(error) });
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Set up Flutter authentication callbacks
   */
  public setupAuthCallbacks(
    onLoginSuccess: (token: string, userData: AuthUserData) => void,
    onLoginError: (errorCode: string, errorMessage: string) => void,
    onAuthStatus: (isAuthenticated: boolean) => void,
    onLogout: () => void
  ): void {
    this.log('🔗 Setting up Flutter authentication callbacks');

    // Set up global callback functions that Flutter will call
    window.onFlutterLoginSuccess = (token: string, userDataString: string) => {
      try {
        this.log('✅ Flutter login success received');
        const userData: AuthUserData = JSON.parse(userDataString);
        onLoginSuccess(token, userData);
      } catch (error) {
        this.log('❌ Error parsing Flutter login success data', { error: error instanceof Error ? error.message : String(error) });
        onLoginError('PARSE_ERROR', 'Failed to parse user data');
      }
    };

    window.onFlutterLoginError = (errorCode: string, errorMessage: string) => {
      this.log('❌ Flutter login error received', { errorCode, errorMessage });
      onLoginError(errorCode, errorMessage);
    };

    window.onFlutterAuthStatus = (isAuthenticated: boolean) => {
      this.log('📊 Flutter auth status received', { isAuthenticated });
      onAuthStatus(isAuthenticated);
    };

    window.onFlutterLogout = () => {
      this.log('🚪 Flutter logout completed');
      onLogout();
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