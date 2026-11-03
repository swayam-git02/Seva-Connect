import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

/**
 * Confirmation Dialog for critical actions (cancelling bookings, removing services, etc.)
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  isLoading = false,
}) => {
  const iconConfig = {
    danger: { icon: AlertTriangle, color: 'text-state-error bg-state-error-bg' },
    warning: { icon: AlertTriangle, color: 'text-state-warning bg-state-warning-bg' },
    info: { icon: Info, color: 'text-state-info bg-state-info-bg' },
    success: { icon: CheckCircle2, color: 'text-state-success bg-state-success-bg' },
  }[type] || { icon: AlertTriangle, color: 'text-state-error bg-state-error-bg' };

  const Icon = iconConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="sm:flex sm:items-start gap-4">
        <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 ${iconConfig.color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <h3 className="text-base font-semibold leading-6 text-content-dark">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-content-muted leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-6 sm:flex sm:flex-row-reverse gap-3">
        <Button
          variant={type === 'danger' ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          {confirmText}
        </Button>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="mt-3 sm:mt-0 w-full sm:w-auto"
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
