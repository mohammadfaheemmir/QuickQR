import { useCallback, useEffect, useRef, useState } from 'react';

export function useToast(duration = 2600) {
  const [toast, setToast] = useState(null);
  const timer = useRef();

  const showToast = useCallback(
    (message, type = 'success') => {
      clearTimeout(timer.current);
      setToast({ id: Date.now(), message, type });
      timer.current = setTimeout(() => setToast(null), duration);
    },
    [duration],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { toast, showToast };
}
