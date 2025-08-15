'use client';

import { AuthProvider } from './auth-context-new';
import DevGateWrapper from './components/DevGateWrapper-new';

export default function DevGateLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DevGateWrapper>
        {children}
      </DevGateWrapper>
    </AuthProvider>
  );
}