import Logo from '../ui/Logo.jsx';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Logo size="sm" />
          <p>Fast, private QR codes. Generated entirely in your browser.</p>
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} QuickQR. All rights reserved.</p>
      </div>
    </footer>
  );
}
