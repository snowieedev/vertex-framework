import React from 'react';

/**
 * Utility for Server Components
 * In Phase 2, params and searchParams are passed as props directly.
 */
export function isServer() {
  return typeof window === 'undefined';
}
