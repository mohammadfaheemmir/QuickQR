import { LoaderCircle } from 'lucide-react';
import './Button.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  block = false,
  type = 'button',
  disabled,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      {...rest}
      disabled={disabled || loading}
    >
      {loading ? (
        <LoaderCircle className="btn__icon btn__spinner" aria-hidden="true" />
      ) : (
        Icon && <Icon className="btn__icon" aria-hidden="true" />
      )}
      {children && <span>{children}</span>}
    </button>
  );
}
