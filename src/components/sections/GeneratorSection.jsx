import { useCallback, useEffect, useRef, useState } from 'react';
import InputPanel from '../generator/InputPanel.jsx';
import CustomizePanel from '../generator/CustomizePanel.jsx';
import PreviewPanel from '../generator/PreviewPanel.jsx';
import Toast from '../ui/Toast.jsx';
import { useQRCode } from '../../hooks/useQRCode.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import { usePersistentState } from '../../hooks/usePersistentState.js';
import { useToast } from '../../hooks/useToast.js';
import {
  DEFAULT_OPTIONS,
  OPTIONS_DEBOUNCE_MS,
  PREFS_STORAGE_KEY,
  SIZE_OPTIONS,
} from '../../constants/qrDefaults.js';
import { getContrastIssue, isValidHex, normalizeHex } from '../../utils/color.js';
import { validateInput } from '../../utils/validation.js';
import { buildFilename } from '../../utils/filename.js';
import { canCopyImage, isIOS, matchesMedia, prefersReducedMotion } from '../../utils/platform.js';
import './GeneratorSection.css';

/** Guards against corrupted or outdated values in localStorage. */
function sanitizeOptions(stored) {
  return {
    fg: isValidHex(stored?.fg) ? normalizeHex(stored.fg) : DEFAULT_OPTIONS.fg,
    bg: isValidHex(stored?.bg) ? normalizeHex(stored.bg) : DEFAULT_OPTIONS.bg,
    size: SIZE_OPTIONS.includes(stored?.size) ? stored.size : DEFAULT_OPTIONS.size,
  };
}

export default function GeneratorSection() {
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState(null);
  // The submitted request – a new object per click so "Generate" always re-runs.
  const [request, setRequest] = useState(null);
  const [options, setOptions] = usePersistentState(PREFS_STORAGE_KEY, DEFAULT_OPTIONS, sanitizeOptions);
  const debouncedOptions = useDebounce(options, OPTIONS_DEBOUNCE_MS);

  const { status, dataUrl, error, meta, generate } = useQRCode();
  const { toast, showToast } = useToast();
  const [copySupported] = useState(canCopyImage);
  const [onIOS] = useState(isIOS);

  const inputRef = useRef(null);
  const previewRef = useRef(null);

  // Generate on submit, and live-regenerate whenever colours/size change afterwards.
  useEffect(() => {
    if (request) generate(request.text, debouncedOptions);
  }, [request, debouncedOptions, generate]);

  // Autofocus the input on desktop only (avoids popping the keyboard on mobile).
  useEffect(() => {
    if (matchesMedia('(min-width: 1024px) and (hover: hover)')) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  const trimmed = text.trim();
  const generatedText = request?.text ?? null;
  const isStale = generatedText !== null && trimmed !== '' && trimmed !== generatedText;
  const contrastIssue = getContrastIssue(options.fg, options.bg);

  const handleTextChange = (value) => {
    setText(value);
    if (inputError) setInputError(null);
  };

  const handleSubmit = () => {
    const validationError = validateInput(text);
    if (validationError) {
      setInputError(validationError);
      inputRef.current?.focus();
      return;
    }
    setInputError(null);
    setRequest({ text: trimmed });

    // On stacked (mobile) layouts, bring the result into view.
    if (matchesMedia('(max-width: 767px)')) {
      requestAnimationFrame(() =>
        previewRef.current?.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start',
        }),
      );
    }
  };

  const handleClear = () => {
    setText('');
    setInputError(null);
    inputRef.current?.focus();
  };

  const handleApplyHttps = () => {
    setText(`https://${trimmed}`);
    inputRef.current?.focus();
  };

  const handleOptionsChange = useCallback((patch) => setOptions((prev) => ({ ...prev, ...patch })), [setOptions]);
  const handleReset = useCallback(() => setOptions({ ...DEFAULT_OPTIONS }), [setOptions]);

  const handleDownload = () => {
    if (!dataUrl || !meta) return false;
    const filename = buildFilename(meta.text, meta.size);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast(`Downloaded ${filename}`);
    return true;
  };

  const handleCopy = async () => {
    if (!dataUrl) return false;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      showToast('QR code copied to clipboard');
      return true;
    } catch {
      showToast('Couldn’t copy the image – try downloading instead.', 'error');
      return false;
    }
  };

  return (
    <section id="generator" className="generator" aria-labelledby="generator-title">
      <div className="container">
        <h2 id="generator-title" className="sr-only">
          QR code generator
        </h2>
        <div className="generator__grid">
          <InputPanel
            className="generator__input"
            inputRef={inputRef}
            text={text}
            error={inputError}
            isLoading={status === 'loading'}
            isStale={isStale}
            onTextChange={handleTextChange}
            onClear={handleClear}
            onSubmit={handleSubmit}
            onApplyHttps={handleApplyHttps}
          />

          <div className="generator__preview" ref={previewRef}>
            <PreviewPanel
              status={status}
              dataUrl={dataUrl}
              error={error}
              meta={meta}
              size={options.size}
              isStale={isStale}
              contrastIssue={contrastIssue}
              canCopy={copySupported}
              showIosHint={onIOS}
              onDownload={handleDownload}
              onCopy={handleCopy}
            />
          </div>

          <CustomizePanel
            className="generator__customize"
            options={options}
            contrastIssue={contrastIssue}
            onChange={handleOptionsChange}
            onReset={handleReset}
          />
        </div>
      </div>
      <Toast toast={toast} />
    </section>
  );
}
