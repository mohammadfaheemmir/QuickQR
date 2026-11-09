import { useLayoutEffect, useState } from 'react';
import { CircleAlert, FileText, Info, Link2, RefreshCw, X, Zap } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { DENSE_WARNING_BYTES, MAX_BYTES } from '../../constants/qrDefaults.js';
import { byteLength, detectContentType, looksLikeBareDomain } from '../../utils/validation.js';
import { isApplePlatform } from '../../utils/platform.js';
import './InputPanel.css';

const MAX_TEXTAREA_HEIGHT = 240;

export default function InputPanel({
  className,
  inputRef,
  text,
  error,
  isLoading,
  isStale,
  onTextChange,
  onClear,
  onSubmit,
  onApplyHttps,
}) {
  const [modKey] = useState(() => (isApplePlatform() ? '⌘' : 'Ctrl'));

  const bytes = byteLength(text);
  const ratio = bytes / MAX_BYTES;
  const counterState = ratio > 1 ? 'error' : ratio >= 0.8 ? 'warn' : 'ok';
  const contentType = detectContentType(text);
  const suggestHttps = !error && looksLikeBareDomain(text);
  const isDense = !error && bytes > DENSE_WARNING_BYTES && bytes <= MAX_BYTES;

  // Auto-grow the textarea between its min height and MAX_TEXTAREA_HEIGHT.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight + 2, MAX_TEXTAREA_HEIGHT)}px`;
  }, [text, inputRef]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onSubmit();
    }
  };

  const describedBy = ['qr-input-meta', error && 'qr-input-error'].filter(Boolean).join(' ');

  let buttonLabel = 'Generate QR Code';
  if (isLoading) buttonLabel = 'Generating…';
  else if (isStale) buttonLabel = 'Update QR Code';

  return (
    <Card className={className} step="1" title="Your content" titleId="input-title">
      <form
        className="input-panel"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <label htmlFor="qr-input" className="sr-only">
          Link or text to encode
        </label>
        <div className={`textarea-wrap ${error ? 'has-error' : ''}`}>
          <textarea
            id="qr-input"
            ref={inputRef}
            className="textarea"
            rows={4}
            value={text}
            placeholder="Paste a link or type any text… e.g. https://yourwebsite.com"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {text && (
            <button type="button" className="textarea-wrap__clear" aria-label="Clear input" onClick={onClear}>
              <X aria-hidden="true" />
            </button>
          )}
        </div>

        <div id="qr-input-meta" className="input-meta">
          {contentType === 'url' && (
            <span className="type-chip type-chip--url">
              <Link2 aria-hidden="true" /> URL detected
            </span>
          )}
          {contentType === 'text' && (
            <span className="type-chip">
              <FileText aria-hidden="true" /> Plain text
            </span>
          )}
          {!contentType && <span className="input-meta__hint">Links, text, emails, phone numbers…</span>}
          <span className={`counter counter--${counterState}`} aria-label={`${bytes} of ${MAX_BYTES} characters used`}>
            {bytes.toLocaleString()} / {MAX_BYTES.toLocaleString()}
          </span>
        </div>

        {error && (
          <p id="qr-input-error" className="field-message field-message--error" role="alert">
            <CircleAlert aria-hidden="true" />
            {error}
          </p>
        )}

        {suggestHttps && (
          <p className="field-message field-message--hint">
            <Link2 aria-hidden="true" />
            <span>
              Looks like a website.{' '}
              <button type="button" className="link-button" onClick={onApplyHttps}>
                Add https://
              </button>{' '}
              so phones open it as a link.
            </span>
          </p>
        )}

        {isDense && (
          <p className="field-message field-message--warning">
            <Info aria-hidden="true" />
            Long text creates dense codes that are harder to scan.
          </p>
        )}

        <div className="input-panel__actions">
          <Button
            type="submit"
            block
            icon={isStale ? RefreshCw : Zap}
            loading={isLoading}
            disabled={!text}
            title={!text ? 'Enter a link or text first' : undefined}
          >
            {buttonLabel}
          </Button>
          <span className="shortcut-hint" aria-hidden="true">
            or press <kbd>{modKey}</kbd> + <kbd>Enter</kbd>
          </span>
        </div>
      </form>
    </Card>
  );
}
