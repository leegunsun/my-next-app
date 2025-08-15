'use client';

import { AuthProvider } from './auth-context';
import DevGateWrapper from './components/DevGateWrapper';

export default function DevGateLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DevGateWrapper>
        {children}
      </DevGateWrapper>
    </AuthProvider>
  );
}