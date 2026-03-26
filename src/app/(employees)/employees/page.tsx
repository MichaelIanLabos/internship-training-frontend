'use client';

import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { formatters } from '@/lib/utils/formatters';
import { useAuth } from '@/lib/auth/context';
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useRestoreEmployee,
  useBulkDeleteEmployees,
  useBulkRestoreEmployees,
} from '@/lib/hooks/useEmployees';
import { AddEmployeeModal } from '@/components/employees/AddEmployeeModal';
import { EditEmployeeModal } from '@/components/employees/EditEmployeeModal';
import { DeleteEmployeeModal } from '@/components/employees/DeleteEmployeeModal';
import { BulkDeleteModal } from '@/components/employees/BulkDeleteModal';
import { Pagination } from '@/components/employees/Pagination';

// Constants
const PAGE_SIZE = 10;

// Styles
const thClass = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500';
const checkboxClass = 'h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500';

function StatusBadge({ status }: { status: string }) {
  const isActive = status.toLowerCase() === 'active';
  const styles = isActive
    ? 'bg-green-100 text-green-700'
    : 'bg-yellow-100 text-yellow-700';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${styles}`}
    >
      {formatters.capitalize(status)}
    </span>
  );
}

export default function EmployeesPage() {
  // State
  const { user, isLoading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  // Data fetching
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployees({
    page: currentPage,
    page_size: PAGE_SIZE,
    search: debouncedSearch || undefined,
    show_deleted: showDeleted || undefined,
    enabled: !authLoading && !!user,
  });

  const employees = data?.records || [];
  const totalPages = data?.total_pages || 1;

  // Mutations
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();
  const restoreMutation = useRestoreEmployee();
  const bulkDeleteMutation = useBulkDeleteEmployees();
  const bulkRestoreMutation = useBulkRestoreEmployees();

  // Side effects
  useEffect(() => {
    setSelectedIds(new Set());
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, showDeleted]);

  useEffect(() => {
    if (employees.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [employees.length, currentPage]);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === employees.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(employees.map((e) => e.id)));
    }
  };

  const handleSelectOne = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleAddEmployee = async (data: Parameters<typeof createMutation.mutateAsync>[0]) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdateEmployee = async (id: number, data: Parameters<typeof updateMutation.mutateAsync>[0]['data']) => {
    await updateMutation.mutateAsync({ id, data });
  };

  const handleDeleteEmployee = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleRestore = async (id: number) => {
    await restoreMutation.mutateAsync(id);
  };

  const handleBulkDelete = async () => {
    await bulkDeleteMutation.mutateAsync(Array.from(selectedIds));
  };

  const handleBulkRestore = async () => {
    await bulkRestoreMutation.mutateAsync(Array.from(selectedIds));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization&apos;s employee records
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            showDeleted ? (
              <button
                onClick={handleBulkRestore}
                disabled={bulkRestoreMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-5 h-10 text-sm font-medium text-green-700 shadow-sm hover:bg-green-100 transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
                  <path d="M21.5 2v6h-6" />
                  <path d="M21.34 15.57a10 10 0 1 1-.57-8.38L21.5 8" />
                </svg>
                {bulkRestoreMutation.isPending ? 'Restoring...' : `Restore Selected (${selectedIds.size})`}
              </button>
            ) : (
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 h-10 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Selected ({selectedIds.size})
              </button>
            )
          )}
          <button
            onClick={() => setShowAddModal(true)}
            style={{ backgroundColor: '#6366F1' }}
            className="inline-flex items-center gap-2 rounded-lg px-5 h-10 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-colors"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Employee
          </button>
        </div>
      </div>

      <hr className="mb-6 border-gray-200" />

      {/* Search & Actions Bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or employee code..."
            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          onClick={() => setShowDeleted(!showDeleted)}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${
            showDeleted
              ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {showDeleted ? 'Show Active' : 'Show Deleted'}
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="h-8 w-8 animate-spin text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-900">Failed to load employees</p>
            <p className="mt-1 text-sm text-gray-500">
              {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => refetch()}
              style={{ backgroundColor: '#6366F1' }}
              className="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        ) : showDeleted && employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-gray-900">No deleted employees found</p>
            <p className="mt-1 text-sm text-gray-500">Deleted employees will appear here</p>
          </div>
        ) : !showDeleted && employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-gray-900">No employees found</p>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first employee</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead style={{ background: 'linear-gradient(to right, #EEF2FF, #FAF5FF)' }}>
                <tr>
                  <th scope="col" className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={employees.length > 0 && selectedIds.size === employees.length}
                      onChange={handleSelectAll}
                      className={checkboxClass}
                    />
                  </th>
                  <th scope="col" className={thClass}>Employee Code</th>
                  <th scope="col" className={thClass}>Full Name</th>
                  <th scope="col" className={thClass}>Email</th>
                  <th scope="col" className={thClass}>Status</th>
                  <th scope="col" className={thClass}>Created Date</th>
                  <th scope="col" className={thClass}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(employee.id)}
                        onChange={() => handleSelectOne(employee.id)}
                      className={checkboxClass}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-indigo-600">
                      {employee.employee_code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={employee.employment_status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatters.date(employee.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {showDeleted ? (
                          <button
                            onClick={() => handleRestore(employee.id)}
                            className="rounded p-1 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                            title="Restore employee"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
                              <path d="M21.5 2v6h-6" />
                              <path d="M21.34 15.57a10 10 0 1 1-.57-8.38L21.5 8" />
                            </svg>
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => { setEditEmployee(employee); setShowEditModal(true); }}
                              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => { setDeleteEmployee(employee); setShowDeleteModal(true); }}
                              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && employees.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddEmployee}
      />
      <EditEmployeeModal
        isOpen={showEditModal}
        employee={editEmployee}
        onClose={() => {
          setShowEditModal(false);
          setEditEmployee(null);
        }}
        onUpdate={handleUpdateEmployee}
      />
      <DeleteEmployeeModal
        key={deleteEmployee?.id}
        isOpen={showDeleteModal}
        employee={deleteEmployee}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteEmployee(null);
        }}
        onDelete={handleDeleteEmployee}
      />
      <BulkDeleteModal
        isOpen={showBulkDeleteModal}
        count={selectedIds.size}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}