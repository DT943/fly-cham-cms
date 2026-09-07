'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  readRecentSearches,
  removeRecentSearch,
  purgeStaleRecentSearches,
  RECENT_SEARCH_CHANGED_EVENT,
  RECENT_SEARCH_KEY,
} from '@/util/recentSearchStorage';

export function useRecentSearchesSync() {
  const [version, setVersion] = useState(0);

  const bump = useCallback(() => {
    setVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    const onFocus = () => {
      purgeStaleRecentSearches();
      bump();
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('pageshow', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pageshow', onFocus);
    };
  }, [bump]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === RECENT_SEARCH_KEY) bump();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [bump]);

  // Same-tab updates (delete last chip, save new search) — `storage` event does not fire in-tab
  useEffect(() => {
    const onLocalChange = () => bump();
    window.addEventListener(RECENT_SEARCH_CHANGED_EVENT, onLocalChange);
    return () => window.removeEventListener(RECENT_SEARCH_CHANGED_EVENT, onLocalChange);
  }, [bump]);

  useEffect(() => {
    if (purgeStaleRecentSearches()) bump();
  }, [bump]);

  const searches = useMemo(() => readRecentSearches(), [version]);

  const removeAt = useCallback((index) => {
    removeRecentSearch(index);
  }, []);

  return { searches, removeAt };
}
