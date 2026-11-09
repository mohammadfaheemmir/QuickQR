import './Card.css';

export default function Card({ step, title, titleId, action, className = '', children, ...rest }) {
  return (
    <section className={`card ${className}`} aria-labelledby={title ? titleId : undefined} {...rest}>
      {title && (
        <header className="card__header">
          <h3 id={titleId} className="card__title">
            {step && (
              <span className="card__step" aria-hidden="true">
                {step}
              </span>
            )}
            {title}
          </h3>
          {action && <div className="card__action">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
