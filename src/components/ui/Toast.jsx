import { CircleAlert, CircleCheck } from 'lucide-react';
import './Toast.css';

/** The live region is always mounted so screen readers reliably announce new toasts. */
export default function Toast({ toast }) {
  const Icon = toast?.type === 'error' ? CircleAlert : CircleCheck;

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <Icon aria-hidden="true" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
