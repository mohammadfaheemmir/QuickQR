import { useEffect, useState } from 'react';

/**
 * useState backed by localStorage. Storage failures (private mode, quota, blocked
 * site data) are ignored so the app always works with in-memory state.
 */
export function usePersistentState(key, initialValue, sanitize = (v) => v) {
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return sanitize(JSON.parse(raw));
    } catch {
      /* fall through to default */
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state]);

  return [state, setState];
}
