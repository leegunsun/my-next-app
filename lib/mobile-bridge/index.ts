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
  BridgeConfig 
} from './types';

// Convenience functions for direct use
import { getMobileBridge } from './mobile-bridge';
import type { UserData, BridgeResponse } from './types';

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
export async function sendDataToMobile(action: string, data: any): Promise<BridgeResponse> {
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

// Default export
export default getMobileBridge;