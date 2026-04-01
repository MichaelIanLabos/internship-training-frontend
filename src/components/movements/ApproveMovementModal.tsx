'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

interface ApproveMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function ApproveMovementModal({ isOpen, onClose, onConfirm }: ApproveMovementModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to approve request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Check className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Approve Request</h3>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-gray-600">
            Are you sure you want to approve this movement request? This action cannot be undone.
          </p>
          {error && (
            <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
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
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Approving...' : 'Approve'}
          </button>
        </div>
      </div>
    </div>
  );
}
