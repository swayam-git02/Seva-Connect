import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Toast alert notification
 */
export const Toast = ({ id, type = 'info', title, message, onClose }) => {
  const configs = {
    success: {
      icon: CheckCircle2,
      border: 'border-green-200',
      bg: 'bg-white',
      iconColor: 'text-state-success',
    },
    error: {
      icon: AlertCircle,
      border: 'border-red-200',
      bg: 'bg-white',
      iconColor: 'text-state-error',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-200',
      bg: 'bg-white',
      iconColor: 'text-state-warning',
    },
    info: {
      icon: Info,
      border: 'border-blue-200',
      bg: 'bg-white',
      iconColor: 'text-state-info',
    },
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm rounded-xl border ${config.border} ${config.bg} p-4 shadow-elevated transition-all`}
      role="alert"
    >
      <div className="flex-shrink-0">
        <Icon className={`h-5 w-5 ${config.iconColor}`} />
      </div>
      <div className="ml-3 w-0 flex-1 pt-0.5">
        {title && <p className="text-sm font-medium text-content-dark">{title}</p>}
        {message && <p className="mt-0.5 text-xs text-content-secondary leading-relaxed">{message}</p>}
      </div>
      <div className="ml-4 flex flex-shrink-0">
        <button
          type="button"
          onClick={() => onClose(id)}
          className="inline-flex rounded-md p-1 text-content-muted hover:text-content-dark transition-colors focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
