'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import {
  Plus,
  Search,
  Trash2,
  Pencil,
  RotateCcw,
  Download,
  AlertTriangle,
  RefreshCw,
  Loader2,
  Sprout,
} from 'lucide-react';
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
  useSeedEmployees,
} from '@/lib/hooks/useEmployees';
import { AddEmployeeModal } from '@/components/employees/AddEmployeeModal';
import { EditEmployeeModal } from '@/components/employees/EditEmployeeModal';
import { DeleteEmployeeModal } from '@/components/employees/DeleteEmployeeModal';
import { BulkDeleteModal } from '@/components/employees/BulkDeleteModal';
import { Pagination } from '@/components/employees/Pagination';
import { EmploymentStatusBadge } from '@/components/ui/StatusBadge';
import { thClass, checkboxClass } from '@/lib/constants/table';

export default function EmployeesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteEmployee, setDeleteEmployee] = useState<Employee | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployees({
    page: currentPage,
    page_size: pageSize,
    search: debouncedSearch || undefined,
    show_deleted: showDeleted || undefined,
    enabled: !authLoading && !!user,
  });

  const employees = data?.records || [];
  const totalPages = data?.total_pages || 1;

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();
  const restoreMutation = useRestoreEmployee();
  const bulkDeleteMutation = useBulkDeleteEmployees();
  const bulkRestoreMutation = useBulkRestoreEmployees();
  const seedMutation = useSeedEmployees();

  useEffect(() => {
    setSelectedIds(new Set());
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, showDeleted]);

  useEffect(() => {
    if (!isLoading && employees.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [employees.length, currentPage, isLoading]);

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
                <RotateCcw className="h-4 w-4" />
                {bulkRestoreMutation.isPending ? 'Restoring...' : `Restore Selected (${selectedIds.size})`}
              </button>
            ) : (
              <button
                onClick={() => setShowBulkDeleteModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 h-10 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedIds.size})
              </button>
            )
          )}
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-violet-300 bg-violet-50 px-5 h-10 text-sm font-medium text-violet-700 shadow-sm hover:bg-violet-100 transition-colors disabled:opacity-50"
          >
            <Sprout className="h-4 w-4" />
            {seedMutation.isPending ? 'Seeding...' : 'Seed Data'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 h-10 text-sm font-medium text-white shadow-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      <hr className="mb-6 border-gray-200" />

      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or employee code..."
            className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <button
          onClick={() => setShowDeleted(!showDeleted)}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium shadow-sm transition-colors ${
            showDeleted
              ? 'border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {showDeleted ? 'Show Active' : 'Show Deleted'}
        </button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <p className="mt-4 text-lg font-medium text-gray-900">Failed to load employees</p>
            <p className="mt-1 text-sm text-gray-500">
              {error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
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
              <thead style={{ background: 'linear-gradient(to right, #EDE9FE, #FAF5FF)' }}>
                <tr>
                  <th scope="col" className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={employees.length > 0 && selectedIds.size === employees.length}
                      onChange={handleSelectAll}
                      className={checkboxClass}
                    />
                  </th>
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
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-4 py-3">
                      <EmploymentStatusBadge status={employee.employment_status} />
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
                            <RotateCcw className="h-5 w-5" />
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => { setEditEmployee(employee); setShowEditModal(true); }}
                              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => { setDeleteEmployee(employee); setShowDeleteModal(true); }}
                              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
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

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
        />
      )}

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
