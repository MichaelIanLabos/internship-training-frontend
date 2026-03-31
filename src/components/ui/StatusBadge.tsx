import { formatters } from '@/lib/utils/formatters';

const MOVEMENT_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const MOVEMENT_DOT_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
};

const EMPLOYMENT_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-yellow-100 text-yellow-700',
};

export function MovementStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-medium ${MOVEMENT_STYLES[key] || 'bg-gray-100 text-gray-700'}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${MOVEMENT_DOT_STYLES[key] || 'bg-gray-500'}`}
      />
      {formatters.capitalize(status)}
    </span>
  );
}

export function EmploymentStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${EMPLOYMENT_STYLES[key] || 'bg-gray-100 text-gray-700'}`}
    >
      {formatters.capitalize(status)}
    </span>
  );
}
