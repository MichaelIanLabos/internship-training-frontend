'use client';

import { useState } from 'react';
import { X as XIcon } from 'lucide-react';
import { Employee } from '@/types/employee';
import { MovementCreateRequest } from '@/types/movement';
import { MOVEMENT_TYPE_OPTIONS } from '@/lib/constants/movement';
import { labelClass, inputClass, errorClass } from '@/lib/constants/table';
import { getApiError, getApiFieldErrors } from '@/lib/utils/errors';

const INITIAL_FORM: MovementCreateRequest = {
  employee: 0,
  movement_type: '',
  remarks: '',
  effective_date: '',
  current_department: '',
  target_department: '',
  current_position: '',
  new_position: '',
};

interface CreateMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: MovementCreateRequest) => Promise<void>;
  employees: Employee[];
}

export function CreateMovementModal({
  isOpen,
  onClose,
  onCreate,
  employees,
}: CreateMovementModalProps) {
  const [form, setForm] = useState<MovementCreateRequest>({ ...INITIAL_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.employee) newErrors.employee = 'Please select an employee';
    if (!form.movement_type) newErrors.movement_type = 'Please select a movement type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    setApiError('');
    try {
      await onCreate(form);
      setForm({ ...INITIAL_FORM });
      setErrors({});
      setApiError('');
      onClose();
    } catch (err: unknown) {
      const fieldErrors = getApiFieldErrors(err);
      if (fieldErrors) {
        setErrors(fieldErrors);
      } else {
        setApiError(getApiError(err, 'Failed to create movement request.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ ...INITIAL_FORM });
    setErrors({});
    setApiError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Movement Request
            </h2>
            <p className="text-sm text-gray-500">
              Submit a new employee movement request
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        {apiError && (
          <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <div className="mt-5 space-y-5">
          <div>
            <label className={labelClass}>
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              value={form.employee || ''}
              onChange={(e) =>
                setForm({ ...form, employee: Number(e.target.value) })
              }
              className={inputClass}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name} ({emp.employee_code})
                </option>
              ))}
            </select>
            {errors.employee && <p className={errorClass}>{errors.employee}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Movement Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.movement_type}
              onChange={(e) => {
                const newType = e.target.value as MovementCreateRequest['movement_type'];
                setForm({
                  ...form,
                  movement_type: newType,
                  ...(newType !== 'transfer' && {
                    current_department: '',
                    target_department: '',
                    current_position: '',
                    new_position: '',
                  }),
                });
              }}
              className={inputClass}
            >
              <option value="">Select type</option>
              {MOVEMENT_TYPE_OPTIONS.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.movement_type && (
              <p className={errorClass}>{errors.movement_type}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Effective Date</label>
            <input
              type="date"
              value={form.effective_date || ''}
              onChange={(e) => setForm({ ...form, effective_date: e.target.value })}
              className={inputClass}
            />
          </div>

          {form.movement_type === 'transfer' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Current Department</label>
                  <input
                    type="text"
                    value={form.current_department || ''}
                    onChange={(e) => setForm({ ...form, current_department: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Target Department</label>
                  <input
                    type="text"
                    value={form.target_department || ''}
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
                    value={form.current_position || ''}
                    onChange={(e) => setForm({ ...form, current_position: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>New Position</label>
                  <input
                    type="text"
                    value={form.new_position || ''}
                    onChange={(e) => setForm({ ...form, new_position: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className={labelClass}>Remarks</label>
            <textarea
              value={form.remarks || ''}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              placeholder="Add any additional notes or justification..."
              rows={4}
              className={`${inputClass} resize-vertical`}
            />
            {errors.remarks && <p className={errorClass}>{errors.remarks}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
