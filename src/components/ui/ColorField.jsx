import { useEffect, useState } from 'react';
import { isValidHex, normalizeHex } from '../../utils/color.js';
import './ColorField.css';

const FULL_HEX_RE = /^#?[0-9a-f]{6}$/i;

/** Swatch (native colour picker) + editable HEX field, kept in sync. */
export default function ColorField({ id, label, value, onChange }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const isDraftValid = isValidHex(draft);

  const commit = () => {
    if (isValidHex(draft)) onChange(normalizeHex(draft));
    else setDraft(value);
  };

  const handleHexChange = (event) => {
    const next = event.target.value;
    setDraft(next);
    // Update live once a full 6-digit value is typed; 3-digit shorthand commits on blur.
    if (FULL_HEX_RE.test(next.trim())) onChange(normalizeHex(next));
  };

  return (
    <div className="color-field">
      <label className="field-label" htmlFor={`${id}-hex`}>
        {label}
      </label>
      <div className="color-field__control">
        <span className="color-field__swatch" style={{ backgroundColor: value }}>
          <input
            type="color"
            aria-label={`${label} colour picker`}
            value={value.toLowerCase()}
            onChange={(e) => onChange(normalizeHex(e.target.value))}
          />
        </span>
        <input
          id={`${id}-hex`}
          className={`color-field__hex ${isDraftValid ? '' : 'is-invalid'}`}
          type="text"
          inputMode="text"
          value={draft}
          maxLength={7}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!isDraftValid}
          onChange={handleHexChange}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
          }}
        />
      </div>
    </div>
  );
}
