import { useCallback, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { LOADING_DELAY_MS } from '../constants/qrDefaults.js';

const INITIAL_STATE = { status: 'idle', dataUrl: null, error: null, meta: null };

function toFriendlyError(err) {
  const message = String(err?.message ?? '');
  if (/too big|too long|amount of data/i.test(message)) {
    return 'This content is too long for a QR code. Try shorter text.';
  }
  return 'Couldn’t generate this QR code. Please try again.';
}

/**
 * Generates QR codes as PNG data URLs entirely in the browser.
 * status: 'idle' | 'loading' | 'success' | 'error'
 * Only the latest request wins, so fast option changes never show stale results.
 */
export function useQRCode() {
  const [state, setState] = useState(INITIAL_STATE);
  const latestRequest = useRef(0);

  const generate = useCallback(async (text, { fg, bg, size }) => {
    const requestId = ++latestRequest.current;
    const isLatest = () => requestId === latestRequest.current;

    // Only surface a loading state when generation is noticeably slow.
    const loadingTimer = setTimeout(() => {
      if (isLatest()) setState((s) => ({ ...s, status: 'loading' }));
    }, LOADING_DELAY_MS);

    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 4, // quiet zone – required for reliable scanning
        errorCorrectionLevel: 'M',
        color: { dark: fg, light: bg },
      });
      if (isLatest()) {
        setState({ status: 'success', dataUrl, error: null, meta: { text, size, fg, bg } });
      }
    } catch (err) {
      if (isLatest()) {
        setState({ status: 'error', dataUrl: null, error: toFriendlyError(err), meta: null });
      }
    } finally {
      clearTimeout(loadingTimer);
    }
  }, []);

  return { ...state, generate };
}
