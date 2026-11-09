import { QrCode } from 'lucide-react';
import './Logo.css';

export default function Logo({ size = 'md' }) {
  return (
    <span className={`logo logo--${size}`}>
      <span className="logo__mark" aria-hidden="true">
        <QrCode strokeWidth={2.25} />
      </span>
      <span className="logo__text">
        Quick<span className="logo__accent">QR</span>
      </span>
    </span>
  );
}
