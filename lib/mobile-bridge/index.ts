/**
 * Mobile Bridge - Main Export
 * 
 * Easy-to-use interface for mobile webview communication
 */

export { MobileBridge, getMobileBridge } from './mobile-bridge';
export { useMobileBridge } from './use-mobile-bridge';
export type { 
  UserData, 
  MobileBridgeAction, 
  FCMTokenData, 
  BridgeResponse, 
  MobilePlatform, 
  BridgeConfig,
  MobileBridgeData,
  LoggingData,
  AuthCredentials,
  AuthUserData,
  AuthResponse
} from './types';

// Convenience functions for direct use
import { getMobileBridge } from './mobile-bridge';
import type { UserData, BridgeResponse, MobileBridgeData, AuthCredentials, AuthUserData } from './types';

/**
 * Initialize mobile bridge for master account
 * Convenience function for immediate use
 */
export async function initializeMobileBridgeForMaster(userData: UserData): Promise<BridgeResponse> {
  const bridge = getMobileBridge();
  return bridge.initializeForMasterAccount(userData);
}

/**
 * Store FCM token and send to mobile
 * Convenience function for FCM token management
 */
export async function storeFCMTokenToMobile(token?: string): Promise<BridgeResponse> {
  const bridge = getMobileBridge();
  return bridge.storeFCMToken(token);
}

/**
 * Send user data to mobile app
 * Only works for master accounts
 */
export async function sendUserDataToMobile(userData: UserData): Promise<BridgeResponse> {
  const bridge = getMobileBridge();
  return bridge.sendUserData(userData);
}

/**
 * Send general data to mobile app
 */
export async function sendDataToMobile(action: string, data: MobileBridgeData): Promise<BridgeResponse> {
  const bridge = getMobileBridge();
  return bridge.sendToMobile(action, data);
}

/**
 * Get current FCM token
 */
export function getCurrentFCMToken(): string | null {
  const bridge = getMobileBridge();
  return bridge.getFCMToken();
}

/**
 * Get mobile bridge status
 */
export function getMobileBridgeStatus() {
  const bridge = getMobileBridge();
  return bridge.getStatus();
}

/**
 * Clear all mobile bridge data
 */
export function clearMobileBridgeData(): void {
  const bridge = getMobileBridge();
  bridge.clearStoredData();
}

/**
 * Authentication convenience functions
 */

/**
 * Check if mobile authentication bridge is available
 */
export function isMobileAuthAvailable(): boolean {
  const bridge = getMobileBridge();
  return bridge.isAuthBridgeAvailable();
}

/**
 * Start mobile authentication
 */
export async function startMobileAuth(credentials: AuthCredentials): Promise<BridgeResponse> {
  const bridge = getMobileBridge();
  return bridge.startMobileLogin(credentials);
}

/**
 * Check mobile authentication status
 */
export async function checkMobileAuthStatus(): Promise<BridgeResponse> {
  const bridge = getMobileBridge();
  return bridge.checkMobileAuthStatus();
}

/**
 * Start mobile logout
 */
export async function startMobileLogout(): Promise<BridgeResponse> {
  const bridge = getMobileBridge();
  return bridge.startMobileLogout();
}

/**
 * Setup Flutter authentication callbacks
 */
export function setupMobileAuthCallbacks(
  onLoginSuccess: (token: string, userData: AuthUserData) => void,
  onLoginError: (errorCode: string, errorMessage: string) => void,
  onAuthStatus: (isAuthenticated: boolean) => void,
  onLogout: () => void
): void {
  const bridge = getMobileBridge();
  bridge.setupAuthCallbacks(onLoginSuccess, onLoginError, onAuthStatus, onLogout);
}

// Default export
export default getMobileBridge;