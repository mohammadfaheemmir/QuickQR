import { useCallback, useEffect, useState } from 'react';
import { prefersReducedMotion } from '../utils/platform.js';

export const THEME_STORAGE_KEY = 'quickqr:theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
const META_COLORS = { light: '#4F46E5', dark: '#0B1120' };
const TRANSITION_MS = 300;

const systemTheme = () => (window.matchMedia?.(DARK_QUERY).matches ? 'dark' : 'light');

function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLORS[theme]);
}

/** Briefly animates colours across the page so the switch feels smooth, not abrupt. */
function withThemeTransition(fn) {
  if (prefersReducedMotion()) return fn();
  const root = document.documentElement;
  root.classList.add('theme-transition');
  fn();
  window.setTimeout(() => root.classList.remove('theme-transition'), TRANSITION_MS);
}

/**
 * Light/dark theme. Defaults to the OS preference and keeps following it until the
 * user picks a theme explicitly; the explicit choice is remembered in localStorage.
 * index.html applies the initial theme before first paint to avoid a flash.
 */
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || readStoredTheme() || systemTheme(),
  );

  useEffect(() => applyTheme(theme), [theme]);

  useEffect(() => {
    const mq = window.matchMedia?.(DARK_QUERY);
    if (!mq) return undefined;
    const onChange = (e) => {
      if (!readStoredTheme()) withThemeTransition(() => setTheme(e.matches ? 'dark' : 'light'));
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* preference just won't persist */
    }
    withThemeTransition(() => {
      applyTheme(next); // apply synchronously so the transition class covers the change
      setTheme(next);
    });
  }, [theme]);

  return { theme, toggleTheme };
}
