export enum MovementType {
  PROMOTION = 'promotion',
  TRANSFER = 'transfer',
  RESIGNATION = 'resignation',
}

export enum MovementStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export const MOVEMENT_TYPE_OPTIONS = [
  { value: MovementType.PROMOTION, label: 'Promotion' },
  { value: MovementType.TRANSFER, label: 'Transfer' },
  { value: MovementType.RESIGNATION, label: 'Resignation' },
];

export const MOVEMENT_STATUS_OPTIONS = [
  { value: MovementStatus.PENDING, label: 'Pending' },
  { value: MovementStatus.APPROVED, label: 'Approved' },
  { value: MovementStatus.REJECTED, label: 'Rejected' },
];
