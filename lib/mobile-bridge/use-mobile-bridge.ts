/**
 * Mobile Bridge React Hook
 * 
 * React hook for easy mobile bridge integration and status monitoring
 */

import { useState, useEffect, useCallback } from 'react';
import { getMobileBridge } from './mobile-bridge';
import type { BridgeResponse, MobilePlatform, MobileBridgeData, BridgeConfig, AuthCredentials, AuthUserData } from './types';

interface MobileBridgeHookReturn {
  // Status
  isAvailable: boolean;
  platform: MobilePlatform;
  fcmToken: string | null;
  isInitialized: boolean;
  isAuthAvailable: boolean;
  
  // Actions
  sendToMobile: (action: string, data: MobileBridgeData) => Promise<BridgeResponse>;
  storeFCMToken: (token?: string) => Promise<BridgeResponse>;
  clearData: () => void;
  refreshStatus: () => void;
  
  // Authentication actions
  startMobileLogin: (credentials: AuthCredentials) => Promise<BridgeResponse>;
  checkMobileAuthStatus: () => Promise<BridgeResponse>;
  startMobileLogout: () => Promise<BridgeResponse>;
  setupAuthCallbacks: (
    onLoginSuccess: (token: string, userData: AuthUserData) => void,
    onLoginError: (errorCode: string, errorMessage: string) => void,
    onAuthStatus: (isAuthenticated: boolean) => void,
    onLogout: () => void
  ) => void;
  
  // Debug info
  status: {
    platform: MobilePlatform;
    available: boolean;
    fcmToken: string | null;
    config: BridgeConfig;
  };
}

export function useMobileBridge(): MobileBridgeHookReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthAvailable, setIsAuthAvailable] = useState(false);
  const [status, setStatus] = useState({
    platform: 'unknown' as MobilePlatform,
    available: false,
    fcmToken: null as string | null,
    config: {}
  });

  const bridge = getMobileBridge();

  const refreshStatus = useCallback(() => {
    const currentStatus = bridge.getStatus();
    setStatus(currentStatus);
    setIsAuthAvailable(bridge.isAuthBridgeAvailable());
    setIsInitialized(true);
  }, [bridge]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const sendToMobile = useCallback(async (action: string, data: MobileBridgeData): Promise<BridgeResponse> => {
    return bridge.sendToMobile(action, data);
  }, [bridge]);

  const storeFCMToken = useCallback(async (token?: string): Promise<BridgeResponse> => {
    const result = await bridge.storeFCMToken(token);
    refreshStatus(); // Refresh status after storing token
    return result;
  }, [bridge, refreshStatus]);

  const clearData = useCallback(() => {
    bridge.clearStoredData();
    refreshStatus(); // Refresh status after clearing data
  }, [bridge, refreshStatus]);

  // Authentication methods
  const startMobileLogin = useCallback(async (credentials: AuthCredentials): Promise<BridgeResponse> => {
    return bridge.startMobileLogin(credentials);
  }, [bridge]);

  const checkMobileAuthStatus = useCallback(async (): Promise<BridgeResponse> => {
    return bridge.checkMobileAuthStatus();
  }, [bridge]);

  const startMobileLogout = useCallback(async (): Promise<BridgeResponse> => {
    return bridge.startMobileLogout();
  }, [bridge]);

  const setupAuthCallbacks = useCallback((
    onLoginSuccess: (token: string, userData: AuthUserData) => void,
    onLoginError: (errorCode: string, errorMessage: string) => void,
    onAuthStatus: (isAuthenticated: boolean) => void,
    onLogout: () => void
  ) => {
    bridge.setupAuthCallbacks(onLoginSuccess, onLoginError, onAuthStatus, onLogout);
  }, [bridge]);

  return {
    // Status
    isAvailable: status.available,
    platform: status.platform,
    fcmToken: status.fcmToken,
    isInitialized,
    isAuthAvailable,
    
    // Actions
    sendToMobile,
    storeFCMToken,
    clearData,
    refreshStatus,
    
    // Authentication actions
    startMobileLogin,
    checkMobileAuthStatus,
    startMobileLogout,
    setupAuthCallbacks,
    
    // Debug info
    status
  };
}

export default useMobileBridge;