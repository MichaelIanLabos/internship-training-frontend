'use client';

import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';

// Types
interface DeleteEmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
}

export function DeleteEmployeeModal({ isOpen, employee, onClose, onDelete }: DeleteEmployeeModalProps) {
  // State
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) setError('');
  }, [isOpen]);

  if (!isOpen || !employee) return null;

  // Handlers
  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await onDelete(employee.id);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete employee.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Render
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-2 text-lg font-semibold text-gray-900">Delete Employee</h2>
        <p className="mb-4 text-sm text-gray-500">
          Are you sure you want to delete{' '}
          <span className="font-medium text-gray-900">
            {employee.first_name} {employee.last_name}
          </span>
          ? This action can be reversed from the deleted employees list.
        </p>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
