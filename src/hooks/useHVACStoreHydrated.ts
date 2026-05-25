/**
 * CoreLoad — Hydration Guard Hook
 * Prevents layout shifts and input flashes during SSR→client hydration.
 * Use this in any component that reads from the persisted Zustand store.
 */

'use client';

import { useState, useEffect } from 'react';
import { useHVACStore } from '../store/useHVACStore';

export function useHVACStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  const storeHydrated = useHVACStore((state) => state.isHydrated);

  useEffect(() => {
    if (storeHydrated) setHydrated(true);
  }, [storeHydrated]);

  return hydrated;
}
