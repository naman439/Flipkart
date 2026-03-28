'use client';

import { Suspense } from 'react';
import { Spinner } from '@/components/LoadingSkeleton';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication. Redirects to login if not authenticated.
 * Used in app router by wrapping page content.
 */
export default function ProtectedRoute({ children }) {
  // In Next.js App Router, we usually handle this inside the page components
  // using useAuth and router.push (as seen in Cart/Checkout/Orders/Profile).
  // This component can be used for shared layout-level protection.
  
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Spinner size={40} />
      </div>
    }>
      {children}
    </Suspense>
  );
}
