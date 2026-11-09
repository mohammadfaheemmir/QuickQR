import { ArrowDown, Zap } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__bg" aria-hidden="true" />
      <div className="container hero__inner">
        <p className="hero__badge">
          <Zap aria-hidden="true" />
          Free · No sign-up · Runs in your browser
        </p>
        <h1 id="hero-title" className="hero__title">
          <span>Create.</span> <span className="hero__accent">Scan.</span> <span>Share.</span>
        </h1>
        <p className="hero__subtitle">
          Turn any link or text into a crisp, downloadable QR code in seconds. No account, no
          uploads.
        </p>
        <a href="#generator" className="hero__jump">
          Start creating
          <ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
