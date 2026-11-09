import { Moon, Sun } from 'lucide-react';
import './ThemeToggle.css';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={onToggle}>
      <span className={`theme-toggle__icon ${isDark ? '' : 'is-visible'}`} aria-hidden="true">
        <Moon />
      </span>
      <span className={`theme-toggle__icon ${isDark ? 'is-visible' : ''}`} aria-hidden="true">
        <Sun />
      </span>
    </button>
  );
}
