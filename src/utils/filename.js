/** "https://www.Example.com/path?q=1", 512 → "quickqr-example-com-path-q-1-512.png" */
export function buildFilename(text, size) {
  const slug = String(text)
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '');

  return `quickqr-${slug || 'code'}-${size}.png`;
}
