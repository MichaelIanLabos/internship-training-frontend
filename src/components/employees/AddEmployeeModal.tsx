'use client';

import { useState } from 'react';
import { X as XIcon } from 'lucide-react';
import { EmployeeCreateRequest } from '@/types/employee';
import { labelClass, inputClass, errorClass } from '@/lib/constants/table';

// Constants
const INITIAL_FORM = {
  first_name: '',
  last_name: '',
  middle_name: '',
  email: '',
  phone_number: '',
  hire_date: '',
  employment_status: 'active',
};

// Types
interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: EmployeeCreateRequest) => Promise<void>;
}

export function AddEmployeeModal({ isOpen, onClose, onAdd }: AddEmployeeModalProps) {
  // State
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handlers
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!form.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email format';
    if (!form.hire_date) newErrors.hire_date = 'Hire date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onAdd(form);
      setForm({ ...INITIAL_FORM });
      setErrors({});
      onClose();
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setErrors({ email: err.response.data.detail });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({ ...INITIAL_FORM });
    setErrors({});
    onClose();
  };

  // Render
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Add Employee</h2>
            <p className="text-sm text-gray-500">Add a new employee</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className={inputClass}
              />
              {errors.first_name && <p className={errorClass}>{errors.first_name}</p>}
            </div>
            <div>
              <label className={labelClass}>
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className={inputClass}
              />
              {errors.last_name && <p className={errorClass}>{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Middle Name</label>
            <input
              type="text"
              value={form.middle_name}
              onChange={(e) => setForm({ ...form, middle_name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Hire Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.hire_date}
              onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
              className={inputClass}
            />
            {errors.hire_date && <p className={errorClass}>{errors.hire_date}</p>}
          </div>

          <div>
            <label className={labelClass}>
              Employment Status <span className="text-red-500">*</span>
            </label>
            <select
              value={form.employment_status}
              onChange={(e) => setForm({ ...form, employment_status: e.target.value })}
              className={inputClass}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={handleClose}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}
