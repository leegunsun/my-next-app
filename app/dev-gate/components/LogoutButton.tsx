'use client';

import { useAuth } from '../auth-context';

export default function LogoutButton() {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={logout}
      className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-colors text-sm font-medium"
      title="Dev Mode Logout"
    >
      Dev Logout
    </button>
  );
}