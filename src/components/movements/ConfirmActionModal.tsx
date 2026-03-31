'use client';

import { useState } from 'react';
import { Check, X as XIcon, Trash2 } from 'lucide-react';

const ACTION_CONFIG = {
  approve: {
    title: 'Approve Request',
    description:
      'Are you sure you want to approve this movement request? This action cannot be undone.',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    buttonBg: 'bg-green-600 hover:bg-green-700',
    buttonLabel: 'Approve',
    loadingLabel: 'Approving...',
    icon: <Check className="h-5 w-5" />,
  },
  reject: {
    title: 'Reject Request',
    description:
      'Are you sure you want to reject this movement request? This action cannot be undone.',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonBg: 'bg-red-600 hover:bg-red-700',
    buttonLabel: 'Reject',
    loadingLabel: 'Rejecting...',
    icon: <XIcon className="h-5 w-5" />,
  },
  delete: {
    title: 'Delete Request',
    description:
      'Are you sure you want to delete this movement request? This will soft-delete the record.',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonBg: 'bg-red-600 hover:bg-red-700',
    buttonLabel: 'Delete',
    loadingLabel: 'Deleting...',
    icon: <Trash2 className="h-5 w-5" />,
  },
};

interface ConfirmActionModalProps {
  isOpen: boolean;
  action: 'approve' | 'reject' | 'delete';
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ConfirmActionModal({
  isOpen,
  action,
  onClose,
  onConfirm,
}: ConfirmActionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const config = ACTION_CONFIG[action];

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        `Failed to ${action} request. Please try again.`;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${config.iconBg} ${config.iconColor}`}
          >
            {config.icon}
          </div>
          <h3 className="text-base font-semibold text-gray-900">
            {config.title}
          </h3>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-gray-600">
            {config.description}
          </p>
          {error && (
            <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${config.buttonBg}`}
          >
            {isLoading ? config.loadingLabel : config.buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
