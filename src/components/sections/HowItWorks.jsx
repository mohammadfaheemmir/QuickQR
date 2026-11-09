import { Download, Palette, PenLine, ShieldCheck } from 'lucide-react';
import './HowItWorks.css';

const STEPS = [
  {
    icon: PenLine,
    title: 'Enter your content',
    text: 'Paste a link or type any text – a website, a message, a phone number.',
  },
  {
    icon: Palette,
    title: 'Make it yours',
    text: 'Pick colours and an export size. The preview updates as you go.',
  },
  {
    icon: Download,
    title: 'Download & share',
    text: 'Save a crisp PNG for slides, print, packaging or social posts.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how" aria-labelledby="how-title">
      <div className="container">
        <header className="how__header">
          <p className="how__eyebrow">How it works</p>
          <h2 id="how-title">Three steps. Zero friction.</h2>
          <p>QuickQR keeps things simple, so you get a ready-to-use QR code in seconds.</p>
        </header>

        <ol className="how__steps">
          {STEPS.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="how__step">
              <span className="how__num" aria-hidden="true">
                0{index + 1}
              </span>
              <span className="how__icon" aria-hidden="true">
                <Icon />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>

        <p className="how__privacy">
          <ShieldCheck aria-hidden="true" />
          Your content never leaves your device – every code is generated locally in your browser.
        </p>
      </div>
    </section>
  );
}
