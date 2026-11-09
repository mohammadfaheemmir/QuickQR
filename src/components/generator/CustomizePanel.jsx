import { RotateCcw, TriangleAlert } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import ColorField from '../ui/ColorField.jsx';
import SegmentedControl from '../ui/SegmentedControl.jsx';
import { COLOR_PRESETS, DEFAULT_OPTIONS, SIZE_OPTIONS } from '../../constants/qrDefaults.js';
import { CONTRAST_MESSAGES } from '../../utils/color.js';
import './CustomizePanel.css';

export default function CustomizePanel({ className, options, contrastIssue, onChange, onReset }) {
  const isDefault =
    options.fg === DEFAULT_OPTIONS.fg &&
    options.bg === DEFAULT_OPTIONS.bg &&
    options.size === DEFAULT_OPTIONS.size;

  return (
    <Card
      className={className}
      step="2"
      title="Customize"
      titleId="customize-title"
      action={
        <Button variant="ghost" size="sm" icon={RotateCcw} onClick={onReset} disabled={isDefault}>
          Reset
        </Button>
      }
    >
      <div className="customize">
        <div>
          <p className="field-label" id="presets-label">
            Presets
          </p>
          <div className="presets" role="group" aria-labelledby="presets-label">
            {COLOR_PRESETS.map((preset) => {
              const active = preset.fg === options.fg && preset.bg === options.bg;
              return (
                <button
                  key={preset.name}
                  type="button"
                  className={`preset ${active ? 'is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => onChange({ fg: preset.fg, bg: preset.bg })}
                >
                  <span className="preset__swatch" style={{ backgroundColor: preset.bg }} aria-hidden="true">
                    <span style={{ backgroundColor: preset.fg }} />
                  </span>
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="customize__colors">
          <ColorField id="qr-fg" label="Foreground" value={options.fg} onChange={(fg) => onChange({ fg })} />
          <ColorField id="qr-bg" label="Background" value={options.bg} onChange={(bg) => onChange({ bg })} />
        </div>

        {contrastIssue && (
          <p className="notice notice--warning" role="status">
            <TriangleAlert aria-hidden="true" />
            {CONTRAST_MESSAGES[contrastIssue]}
          </p>
        )}

        <SegmentedControl
          name="qr-size"
          legend="Export size"
          hint="(px)"
          options={SIZE_OPTIONS}
          value={options.size}
          onChange={(size) => onChange({ size })}
        />
      </div>
    </Card>
  );
}
