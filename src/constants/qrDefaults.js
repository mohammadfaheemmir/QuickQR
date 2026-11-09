export const DEFAULT_OPTIONS = Object.freeze({
  fg: '#0F172A',
  bg: '#FFFFFF',
  size: 512,
});

export const SIZE_OPTIONS = [256, 512, 1024, 2048];

/** Hard limit in UTF-8 bytes (QR byte mode at error level M holds ~2,331 bytes). */
export const MAX_BYTES = 2000;

/** Above this, codes get dense enough to be harder to scan. */
export const DENSE_WARNING_BYTES = 300;

/** Only show the loading state if generation takes longer than this (avoids flicker). */
export const LOADING_DELAY_MS = 150;

/** Debounce for regenerating when colours/size change. */
export const OPTIONS_DEBOUNCE_MS = 150;

export const PREFS_STORAGE_KEY = 'quickqr:prefs';

/** Curated, high-contrast, dark-on-light presets that scan reliably. */
export const COLOR_PRESETS = [
  { name: 'Classic', fg: '#0F172A', bg: '#FFFFFF' },
  { name: 'Indigo', fg: '#4338CA', bg: '#FFFFFF' },
  { name: 'Midnight', fg: '#1E1B4B', bg: '#E0E7FF' },
  { name: 'Emerald', fg: '#065F46', bg: '#ECFDF5' },
  { name: 'Graphite', fg: '#334155', bg: '#F1F5F9' },
];
