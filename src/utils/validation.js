import { MAX_BYTES } from '../constants/qrDefaults.js';

const encoder = new TextEncoder();

/** QR capacity is measured in bytes, so emoji / non-Latin text counts for more. */
export const byteLength = (value) => encoder.encode(value).length;

export function validateInput(text) {
  const value = text.trim();
  if (!value) return 'Please enter a link or some text.';
  if (byteLength(value) > MAX_BYTES) {
    return `Too long for a QR code – max ${MAX_BYTES.toLocaleString()} characters.`;
  }
  return null;
}

export function isUrl(text) {
  try {
    const url = new URL(text.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

const BARE_DOMAIN_RE =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?::\d{1,5})?(?:[/?#]\S*)?$/i;

/** e.g. "example.com" or "www.site.io/path" – a URL missing its scheme. */
export const looksLikeBareDomain = (text) => {
  const value = text.trim();
  return !isUrl(value) && BARE_DOMAIN_RE.test(value);
};

/** @returns {'url' | 'text' | null} */
export function detectContentType(text) {
  if (!text.trim()) return null;
  return isUrl(text) || looksLikeBareDomain(text) ? 'url' : 'text';
}
