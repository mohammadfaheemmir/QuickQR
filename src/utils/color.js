const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const isValidHex = (value) => HEX_RE.test(String(value).trim());

/** "#abc" / "abc" / "#aabbcc" → "#AABBCC" */
export function normalizeHex(value) {
  let hex = String(value).trim().replace('#', '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${hex.toUpperCase()}`;
}

function relativeLuminance(hex) {
  const h = normalizeHex(hex).slice(1);
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio, 1–21. */
export function contrastRatio(a, b) {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Flags colour combinations that commonly fail to scan.
 * @returns {'low' | 'inverted' | null}
 */
export function getContrastIssue(fg, bg) {
  if (!isValidHex(fg) || !isValidHex(bg)) return null;
  if (contrastRatio(fg, bg) < 4) return 'low';
  if (relativeLuminance(fg) > relativeLuminance(bg)) return 'inverted';
  return null;
}

export const CONTRAST_MESSAGES = {
  low: 'Low contrast – some scanners may fail to read this code.',
  inverted: 'Light-on-dark codes aren’t supported by every scanner. Dark on light is safest.',
};
