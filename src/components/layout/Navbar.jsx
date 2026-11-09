import { useEffect, useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import Logo from '../ui/Logo.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import '../ui/Button.css';
import './Navbar.css';

const LINKS = [
  { id: 'generator', label: 'Generator' },
  { id: 'how-it-works', label: 'How it works' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Border + shadow appear only once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const ids = ['top', ...LINKS.map((l) => l.id)];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on Escape or when growing to desktop width.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => e.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onChange);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const renderLinks = (className) =>
    LINKS.map((link) => {
      const active = activeId === link.id;
      return (
        <li key={link.id}>
          <a
            href={`#${link.id}`}
            className={`${className} ${active ? 'is-active' : ''}`}
            aria-current={active ? 'location' : undefined}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        </li>
      );
    });

  return (
    <header className={`navbar ${scrolled || menuOpen ? 'navbar--scrolled' : ''}`}>
      <nav className="navbar__inner container" aria-label="Main">
        <a href="#top" className="navbar__brand" aria-label="QuickQR – back to top" onClick={closeMenu}>
          <Logo />
        </a>

        <ul className="navbar__links">{renderLinks('navbar__link')}</ul>

        <ThemeToggle theme={theme} onToggle={toggleTheme} />

        <a href="#generator" className="btn btn--primary btn--sm navbar__cta">
          <Zap className="btn__icon" aria-hidden="true" />
          <span>Create QR</span>
        </a>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      <div id="mobile-menu" className="navbar__menu" hidden={!menuOpen}>
        <ul className="container">{renderLinks('navbar__menu-link')}</ul>
      </div>
    </header>
  );
}
