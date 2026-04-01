'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Pencil,
  Trash2,
  Check,
  X,
  Clock,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { formatters } from '@/lib/utils/formatters';
import { useAuth } from '@/lib/auth/context';
import { MovementStatusBadge } from '@/components/ui/StatusBadge';
import { MovementTypeBadge } from '@/components/ui/MovementTypeBadge';
import {
  useMovement,
  useUpdateMovement,
  useApproveMovement,
  useRejectMovement,
  useDeleteMovement,
} from '@/lib/hooks/useMovements';
import { MovementStatus } from '@/lib/constants/movement';
import { ApproveMovementModal } from '@/components/movements/ApproveMovementModal';
import { RejectMovementModal } from '@/components/movements/RejectMovementModal';
import { DeleteMovementModal } from '@/components/movements/DeleteMovementModal';
import { EditMovementModal } from '@/components/movements/EditMovementModal';

export default function MovementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const id = Number(params.id);

  const { data: movement, isLoading, isError } = useMovement(
    id,
    !authLoading && !!user
  );

  const updateMutation = useUpdateMovement();
  const approveMutation = useApproveMovement();
  const rejectMutation = useRejectMovement();
  const deleteMutation = useDeleteMovement();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleApprove = async () => {
    await approveMutation.mutateAsync(id);
  };

  const handleReject = async (remarks: string) => {
    await rejectMutation.mutateAsync({ id, remarks });
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(id);
    router.push('/employee-list');
  };

  const handleUpdate = async (data: Parameters<typeof updateMutation.mutateAsync>[0]['data']) => {
    await updateMutation.mutateAsync({ id, data });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  if (isError || !movement) {
    return (
      <div className="py-32 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-400" />
        <h3 className="mt-4 text-base font-semibold text-gray-700">
          Request not found
        </h3>
        <button
          onClick={() => router.push('/employee-list')}
          className="mt-4 text-sm text-violet-600 hover:underline"
        >
          Back to Requests
        </button>
      </div>
    );
  }

  const isPending = movement.status.toLowerCase() === MovementStatus.PENDING;

  return (
    <div>
      <button
        onClick={() => router.push('/employee-list')}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-violet-600"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Requests
      </button>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[22px] font-semibold text-gray-900">
                  Movement Request #MR-{new Date(movement.created_at).getFullYear()}-
                  {String(movement.id).padStart(3, '0')}
                </h1>
                <MovementStatusBadge status={movement.status} />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Submitted on {formatters.date(movement.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              {isPending && (
                <>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-300 bg-white px-4 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-16 gap-y-6">
            <DetailItem label="Employee">
              {movement.employee_first_name} {movement.employee_last_name}
            </DetailItem>
            <DetailItem label="Employee ID">
              {movement.employee_code || `EMP-${String(movement.employee).padStart(3, '0')}`}
            </DetailItem>
            <DetailItem label="Movement Type">
              <MovementTypeBadge type={movement.movement_type} />
            </DetailItem>
            {movement.effective_date && (
              <DetailItem label="Effective Date">
                {formatters.date(movement.effective_date)}
              </DetailItem>
            )}
            {movement.movement_type === 'transfer' && movement.current_department && (
              <DetailItem label="Current Department">
                {movement.current_department}
              </DetailItem>
            )}
            {movement.movement_type === 'transfer' && movement.target_department && (
              <DetailItem label="Target Department">
                {movement.target_department}
              </DetailItem>
            )}
            {movement.movement_type === 'transfer' && movement.current_position && (
              <DetailItem label="Current Position">
                {movement.current_position}
              </DetailItem>
            )}
            {movement.movement_type === 'transfer' && movement.new_position && (
              <DetailItem label="New Position">
                {movement.new_position}
              </DetailItem>
            )}
          </div>

          {movement.remarks && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-base font-semibold text-gray-900">
                Reason / Justification
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {movement.remarks}
              </p>
            </div>
          )}

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-base font-semibold text-gray-900">
              Activity
            </h3>
            <div className="flex flex-col">
              <TimelineItem
                icon={<Clock className="h-3.5 w-3.5" />}
                iconBg="bg-violet-50 text-violet-600"
                isLast={movement.status === MovementStatus.PENDING}
              >
                <p className="text-sm text-gray-700">
                  <strong>Request submitted</strong> by{' '}
                  {movement.requested_by_first_name}{' '}
                  {movement.requested_by_last_name}
                </p>
                <p className="mt-0.5 text-[13px] text-gray-400">
                  {formatters.dateTime(movement.created_at)}
                </p>
              </TimelineItem>

              {movement.status !== MovementStatus.PENDING && (
                <TimelineItem
                  icon={
                    movement.status === MovementStatus.APPROVED ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )
                  }
                  iconBg={
                    movement.status === MovementStatus.APPROVED
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }
                  isLast
                >
                  <p className="text-sm text-gray-700">
                    <strong>{formatters.capitalize(movement.status)}</strong> by{' '}
                    {movement.approved_by_first_name || 'HR'}{' '}
                    {movement.approved_by_last_name || 'Director'}
                  </p>
                  <p className="mt-0.5 text-[13px] text-gray-400">
                    {formatters.dateTime(movement.updated_at || movement.created_at)}
                  </p>
                </TimelineItem>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ApproveMovementModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
      />
      <RejectMovementModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={handleReject}
      />
      <DeleteMovementModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
      <EditMovementModal
        isOpen={showEditModal}
        movement={movement}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}


function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[13px] font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-[15px] text-gray-900">{children}</dd>
    </div>
  );
}

function TimelineItem({
  icon,
  iconBg,
  isLast,
  children,
}: {
  icon: React.ReactNode;
  iconBg: string;
  isLast: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200" />
      )}
      <div
        className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
      <div className="pt-1">{children}</div>
    </div>
  );
}
