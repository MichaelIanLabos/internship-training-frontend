'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Check,
  X,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Table2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical,
} from 'lucide-react';
import { formatters } from '@/lib/utils/formatters';
import { useAuth } from '@/lib/auth/context';
import { useEmployees } from '@/lib/hooks/useEmployees';
import {
  useMovements,
  useCreateMovement,
  useApproveMovement,
  useRejectMovement,
  useDeleteMovement,
} from '@/lib/hooks/useMovements';
import { Movement, MovementCreateRequest } from '@/types/movement';
import { MOVEMENT_TYPE_OPTIONS } from '@/lib/constants/movement';
import { CreateMovementModal } from '@/components/movements/CreateMovementModal';
import { ConfirmActionModal } from '@/components/movements/ConfirmActionModal';
import { PAGE_SIZE, thClass } from '@/lib/constants/table';

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };
  const dotStyles: Record<string, string> = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
  };
  const key = status.toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium ${styles[key] || 'bg-gray-100 text-gray-700'}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${dotStyles[key] || 'bg-gray-500'}`}
      />
      {formatters.capitalize(status)}
    </span>
  );
}

function MovementTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-0.5 text-xs font-medium capitalize text-violet-700">
      {type}
    </span>
  );
}

export default function EmployeeListPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    id: number;
    action: 'approve' | 'reject' | 'delete';
  } | null>(null);

  const isReady = !authLoading && !!user;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, error, refetch } = useMovements({
    page: currentPage,
    page_size: PAGE_SIZE,
    status: statusFilter || undefined,
    movement_type: typeFilter || undefined,
    search: debouncedSearch || undefined,
    enabled: isReady,
  });

  const movements = data?.records || [];
  const totalPages = data?.total_pages || 1;
  const totalRecords = data?.total_records || 0;

  const { data: allData } = useMovements({
    page: 1,
    page_size: 1,
    enabled: isReady,
  });
  const { data: pendingData } = useMovements({
    page: 1,
    page_size: 1,
    status: 'pending',
    enabled: isReady,
  });
  const { data: approvedData } = useMovements({
    page: 1,
    page_size: 1,
    status: 'approved',
    enabled: isReady,
  });
  const { data: rejectedData } = useMovements({
    page: 1,
    page_size: 1,
    status: 'rejected',
    enabled: isReady,
  });

  const { data: employeeData } = useEmployees({
    page: 1,
    page_size: 100,
    enabled: isReady,
  });
  const employees = employeeData?.records || [];

  const createMutation = useCreateMovement();
  const approveMutation = useApproveMovement();
  const rejectMutation = useRejectMovement();
  const deleteMutation = useDeleteMovement();

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter, debouncedSearch]);

  useEffect(() => {
    if (movements.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [movements.length, currentPage]);

  const handleCreate = async (formData: MovementCreateRequest) => {
    await createMutation.mutateAsync(formData);
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    if (confirmAction.action === 'approve') {
      await approveMutation.mutateAsync(confirmAction.id);
    } else if (confirmAction.action === 'reject') {
      await rejectMutation.mutateAsync(confirmAction.id);
    } else {
      await deleteMutation.mutateAsync(confirmAction.id);
    }
  };

  const startRecord = movements.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const endRecord = startRecord + movements.length - 1;

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-gray-700">Request Summary</h2>
      <div className="mb-6 grid grid-cols-4 gap-5">
        <StatCard label="Total Requests" value={allData?.total_records} />
        <StatCard
          label="Pending"
          value={pendingData?.total_records}
          color="text-amber-500"
        />
        <StatCard
          label="Approved"
          value={approvedData?.total_records}
          color="text-green-600"
        />
        <StatCard
          label="Rejected"
          value={rejectedData?.total_records}
          color="text-red-600"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-6 py-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Movement Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              >
                <option value="">All Types</option>
                {MOVEMENT_TYPE_OPTIONS.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Search
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by employee name..."
                className="min-w-[220px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            New Request
          </button>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-400" />
            <h3 className="mt-4 text-base font-semibold text-gray-700">
              Failed to load requests
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {error instanceof Error
                ? error.message
                : 'Something went wrong. Please try again.'}
            </p>
            <button
              onClick={() => refetch()}
              style={{ backgroundColor: '#4f46e5' }}
              className="mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        ) : movements.length === 0 ? (
          <div className="py-16 text-center">
            <Table2 className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-base font-semibold text-gray-700">
              {statusFilter
                ? 'No matching requests'
                : 'No movement requests yet'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {statusFilter
                ? 'Try changing the filter or create a new request.'
                : 'Get started by creating a new employee movement request.'}
            </p>
            {!statusFilter && (
              <button
                onClick={() => setShowCreateModal(true)}
                style={{ backgroundColor: '#4f46e5' }}
                className="mt-5 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700"
              >
                <Plus className="h-4 w-4" />
                Create First Request
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className={thClass}>Employee</th>
                    <th className={thClass}>Type</th>
                    <th className={thClass}>Status</th>
                    <th className={thClass}>Requested By</th>
                    <th className={thClass}>Date</th>
                    <th className={thClass}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement) => (
                    <tr
                      key={movement.id}
                      onClick={() => router.push(`/employee-list/${movement.id}`)}
                      className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                            {movement.employee_first_name.charAt(0)}
                            {movement.employee_last_name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {movement.employee_first_name}{' '}
                              {movement.employee_last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <MovementTypeBadge type={movement.movement_type} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={movement.status} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {movement.requested_by_first_name}{' '}
                        {movement.requested_by_last_name}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">
                        {formatters.date(movement.created_at)}
                      </td>
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ActionButtons
                          movement={movement}
                          user={user}
                          onApprove={() =>
                            setConfirmAction({
                              id: movement.id,
                              action: 'approve',
                            })
                          }
                          onReject={() =>
                            setConfirmAction({
                              id: movement.id,
                              action: 'reject',
                            })
                          }
                          onDelete={() =>
                            setConfirmAction({
                              id: movement.id,
                              action: 'delete',
                            })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
              <span>
                Showing {startRecord}-{endRecord} of {totalRecords} requests
              </span>
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <CreateMovementModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
        employees={employees}
      />
      <ConfirmActionModal
        isOpen={!!confirmAction}
        action={confirmAction?.action || 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value?: number;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-[13px] font-medium text-gray-500">{label}</div>
      <div className={`mt-1 text-[28px] font-bold ${color || 'text-gray-900'}`}>
        {value !== undefined ? value : '\u2014'}
      </div>
    </div>
  );
}

function ActionButtons({
  movement,
  user,
  onApprove,
  onReject,
  onDelete,
}: {
  movement: Movement;
  user: { id: number } | null;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!user) return null;

  const isPending = movement.status.toLowerCase() === 'pending';

  if (!isPending) {
    return (
      <span className="text-xs italic text-gray-400">
        {formatters.capitalize(movement.status)}
      </span>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            onClick={() => { onApprove(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
          >
            <Check className="h-4 w-4 text-green-600" />
            Approve
          </button>
          <button
            onClick={() => { onReject(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <X className="h-4 w-4 text-red-600" />
            Reject
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const btnBase =
    'min-w-[32px] rounded-md border px-2.5 py-1.5 text-[13px] transition-colors';

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${btnBase} border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        typeof p === 'string' ? (
          <span key={`ellipsis-${i}`} className="px-1.5 py-1.5 text-[13px] text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${
              p === currentPage
                ? 'border-violet-600 bg-violet-600 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${btnBase} border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
