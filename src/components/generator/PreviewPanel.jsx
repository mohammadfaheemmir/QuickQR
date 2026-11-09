import { useEffect, useRef, useState } from 'react';
import { Check, CircleCheck, Copy, Download, QrCode, RefreshCw, Smartphone, TriangleAlert } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import './PreviewPanel.css';

const DISPLAY_SIZE = 300; // CSS display size of the preview tile
const FEEDBACK_MS = 1500;

const truncate = (value, max = 80) => (value.length > max ? `${value.slice(0, max)}…` : value);

function EmptyState() {
  return (
    <div className="preview-empty">
      <span className="preview-empty__icon" aria-hidden="true">
        <QrCode />
      </span>
      <p className="preview-empty__title">Your QR code will appear here</p>
      <p className="preview-empty__text">Enter a link or text and press Generate.</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="preview-empty preview-empty--error" role="alert">
      <span className="preview-empty__icon" aria-hidden="true">
        <TriangleAlert />
      </span>
      <p className="preview-empty__title">Couldn’t generate this QR code</p>
      <p className="preview-empty__text">{message}</p>
    </div>
  );
}

export default function PreviewPanel({
  status,
  dataUrl,
  error,
  meta,
  size,
  isStale,
  contrastIssue,
  canCopy,
  showIosHint,
  onDownload,
  onCopy,
}) {
  const [done, setDone] = useState(null); // 'download' | 'copy' | null
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const flash = (kind) => {
    setDone(kind);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(null), FEEDBACK_MS);
  };

  const hasImage = Boolean(dataUrl) && status !== 'error';
  const isUpdating = status === 'loading' && hasImage;

  let tileVariant = 'empty';
  let content = <EmptyState />;
  if (status === 'error') {
    tileVariant = 'error';
    content = <ErrorState message={error} />;
  } else if (hasImage) {
    tileVariant = 'image';
    content = (
      <img
        key={meta?.text} // re-run the entrance animation only for new content, not colour tweaks
        className={[
          'preview__image',
          isStale && 'is-stale',
          isUpdating && 'is-updating',
          meta?.size < DISPLAY_SIZE && 'preview__image--pixelated',
        ]
          .filter(Boolean)
          .join(' ')}
        src={dataUrl}
        width={meta?.size}
        height={meta?.size}
        alt={`QR code for: ${truncate(meta?.text ?? '')}`}
      />
    );
  } else if (status === 'loading') {
    tileVariant = 'loading';
    content = <div className="preview__skeleton" aria-hidden="true" />;
  }

  let statusChip = null;
  if (hasImage && isStale) {
    statusChip = (
      <span className="status-chip status-chip--warning">
        <RefreshCw aria-hidden="true" /> Text changed – update to refresh
      </span>
    );
  } else if (status === 'success') {
    statusChip = (
      <span className="status-chip status-chip--success">
        <CircleCheck aria-hidden="true" /> Ready to scan
      </span>
    );
  }

  return (
    <Card title="Preview" titleId="preview-title" action={statusChip} className="preview">
      <div className={`preview__tile preview__tile--${tileVariant}`}>
        {content}
        {hasImage && contrastIssue && (
          <span className="preview__badge" title="These colours may be hard to scan">
            <TriangleAlert aria-hidden="true" /> Check contrast
          </span>
        )}
      </div>

      <p className="preview__meta">
        {size} × {size} px · PNG
      </p>

      <div className="preview__actions">
        <Button
          icon={done === 'download' ? Check : Download}
          className={done === 'download' ? 'btn--done preview__download' : 'preview__download'}
          disabled={!hasImage}
          onClick={() => onDownload() && flash('download')}
        >
          {done === 'download' ? 'Downloaded' : 'Download PNG'}
        </Button>
        {canCopy && (
          <Button
            variant="secondary"
            icon={done === 'copy' ? Check : Copy}
            disabled={!hasImage}
            onClick={async () => (await onCopy()) && flash('copy')}
          >
            {done === 'copy' ? 'Copied' : 'Copy'}
          </Button>
        )}
      </div>

      {showIosHint && hasImage && (
        <p className="preview__hint">
          <Smartphone aria-hidden="true" />
          On iPhone or iPad? You can also long-press the code and choose “Save to Photos”.
        </p>
      )}

      <p className="sr-only" aria-live="polite">
        {status === 'success' ? 'QR code ready.' : ''}
      </p>
    </Card>
  );
}
