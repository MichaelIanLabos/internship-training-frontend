'use client';

import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Movement } from '@/types/movement';
import { MOVEMENT_TYPE_OPTIONS } from '@/lib/constants/movement';
import { labelClass, inputClass, errorClass } from '@/lib/constants/table';

interface EditMovementModalProps {
  isOpen: boolean;
  movement: Movement | null;
  onClose: () => void;
  onUpdate: (data: {
    movement_type?: string;
    remarks?: string;
    effective_date?: string;
    current_department?: string;
    target_department?: string;
    current_position?: string;
    new_position?: string;
  }) => Promise<void>;
}

export function EditMovementModal({ isOpen, movement, onClose, onUpdate }: EditMovementModalProps) {
  const [form, setForm] = useState({
    movement_type: '',
    remarks: '',
    effective_date: '',
    current_department: '',
    target_department: '',
    current_position: '',
    new_position: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (movement && isOpen) {
      setForm({
        movement_type: movement.movement_type || '',
        remarks: movement.remarks || '',
        effective_date: movement.effective_date?.split('T')[0] || '',
        current_department: movement.current_department || '',
        target_department: movement.target_department || '',
        current_position: movement.current_position || '',
        new_position: movement.new_position || '',
      });
      setErrors({});
      setApiError('');
    }
  }, [movement, isOpen]);

  if (!isOpen || !movement) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.movement_type) newErrors.movement_type = 'Movement type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setApiError('');
    try {
      await onUpdate(form);
      onClose();
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.detail) {
        setApiError(data.detail);
      } else if (data && typeof data === 'object') {
        const fieldErrors: Record<string, string> = {};
        for (const [key, value] of Object.entries(data)) {
          fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
        }
        setErrors(fieldErrors);
      } else {
        setApiError('Failed to update movement request.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    setApiError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Edit Movement Request</h3>
            <p className="text-sm text-gray-500">
              {movement.employee_first_name} {movement.employee_last_name}
            </p>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          {apiError && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{apiError}</div>
          )}

          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                Movement Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.movement_type}
                onChange={(e) => setForm({ ...form, movement_type: e.target.value })}
                className={inputClass}
              >
                <option value="">Select type</option>
                {MOVEMENT_TYPE_OPTIONS.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.movement_type && <p className={errorClass}>{errors.movement_type}</p>}
            </div>

            <div>
              <label className={labelClass}>Effective Date</label>
              <input
                type="date"
                value={form.effective_date}
                onChange={(e) => setForm({ ...form, effective_date: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Current Department</label>
                <input
                  type="text"
                  value={form.current_department}
                  onChange={(e) => setForm({ ...form, current_department: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Target Department</label>
                <input
                  type="text"
                  value={form.target_department}
                  onChange={(e) => setForm({ ...form, target_department: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Current Position</label>
                <input
                  type="text"
                  value={form.current_position}
                  onChange={(e) => setForm({ ...form, current_position: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>New Position</label>
                <input
                  type="text"
                  value={form.new_position}
                  onChange={(e) => setForm({ ...form, new_position: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Remarks</label>
              <textarea
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                placeholder="Add justification or notes..."
                rows={4}
                className={`${inputClass} resize-vertical`}
              />
              {errors.remarks && <p className={errorClass}>{errors.remarks}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
