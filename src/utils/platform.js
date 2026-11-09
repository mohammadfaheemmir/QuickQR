const hasNavigator = typeof navigator !== 'undefined';

export const isIOS = () =>
  hasNavigator &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

export const isApplePlatform = () => hasNavigator && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);

export const canCopyImage = () =>
  typeof window !== 'undefined' &&
  'ClipboardItem' in window &&
  hasNavigator &&
  typeof navigator.clipboard?.write === 'function';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export const matchesMedia = (query) =>
  typeof window !== 'undefined' && window.matchMedia?.(query).matches;
