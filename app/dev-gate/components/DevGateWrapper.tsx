'use client';

import { useAuth } from '../auth-context';
import UnderDevelopment from './UnderDevelopment';
import LogoutButton from './LogoutButton';
import DevModeIndicator from './DevModeIndicator';

export default function DevGateWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If not authenticated, show under development page
  if (!isAuthenticated) {
    return <UnderDevelopment />;
  }

  // If authenticated, show the actual app with dev indicators
  return (
    <>
      {children}
      <DevModeIndicator />
      <LogoutButton />
    </>
  );
}