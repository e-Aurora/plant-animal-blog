
// src/components/ui/Alert.tsx
import { ReactNode } from 'react';

interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  children: ReactNode;
  onClose?: () => void;
}

export function Alert({ type = 'info', children, onClose }: AlertProps) {
  const icons = {
    error: '❌',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`alert alert-${type} flex items-start gap-3`}>
      <span className="text-xl">{icons[type]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export * from './Alert';