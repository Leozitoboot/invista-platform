import { useState } from 'react';
import type { ToastData } from './Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (type: ToastData['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, dismiss };
}
