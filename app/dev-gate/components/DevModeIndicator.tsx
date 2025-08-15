'use client';

import { useAuth } from '../auth-context';

export default function DevModeIndicator() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <div className="fixed top-4 left-4 z-50 px-3 py-1 bg-orange-500/90 backdrop-blur-sm text-white rounded-full shadow-lg text-xs font-medium animate-pulse">
      🔧 Dev Mode
    </div>
  );
}