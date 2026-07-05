'use client';

import React from 'react';
import { useF1Store } from '../../store/f1Store';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useF1Store();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const Icon = toast.type === 'success' 
          ? CheckCircle 
          : toast.type === 'warning' 
            ? AlertCircle 
            : Info;

        const borderStyle = toast.type === 'success' 
          ? 'var(--green-accent)' 
          : toast.type === 'warning' 
            ? 'var(--yellow-accent)' 
            : 'var(--f1-red)';

        return (
          <div 
            key={toast.id} 
            className="toast"
            style={{ borderLeft: `4px solid ${borderStyle}` }}
          >
            <Icon size={18} style={{ color: borderStyle }} />
            <span style={{ fontWeight: 500 }}>{toast.message}</span>
            <button 
              onClick={() => dismissToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px',
                marginLeft: 'auto'
              }}
              aria-label="Dismiss toast"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
