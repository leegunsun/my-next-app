/**
 * Mobile Bridge React Hook
 * 
 * React hook for easy mobile bridge integration and status monitoring
 */

import { useState, useEffect, useCallback } from 'react';
import { getMobileBridge } from './mobile-bridge';
import type { BridgeResponse, MobilePlatform } from './types';

interface MobileBridgeHookReturn {
  // Status
  isAvailable: boolean;
  platform: MobilePlatform;
  fcmToken: string | null;
  isInitialized: boolean;
  
  // Actions
  sendToMobile: (action: string, data: any) => Promise<BridgeResponse>;
  storeFCMToken: (token?: string) => Promise<BridgeResponse>;
  clearData: () => void;
  refreshStatus: () => void;
  
  // Debug info
  status: {
    platform: MobilePlatform;
    available: boolean;
    fcmToken: string | null;
    config: any;
  };
}

export function useMobileBridge(): MobileBridgeHookReturn {
  const [isInitialized, setIsInitialized] = useState(false);
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
    setIsInitialized(true);
  }, [bridge]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const sendToMobile = useCallback(async (action: string, data: any): Promise<BridgeResponse> => {
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

  return {
    // Status
    isAvailable: status.available,
    platform: status.platform,
    fcmToken: status.fcmToken,
    isInitialized,
    
    // Actions
    sendToMobile,
    storeFCMToken,
    clearData,
    refreshStatus,
    
    // Debug info
    status
  };
}

export default useMobileBridge;