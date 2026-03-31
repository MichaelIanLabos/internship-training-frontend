export enum MovementType {
  PROMOTION = 'promotion',
  TRANSFER = 'transfer',
  RESIGNATION = 'resignation',
}

export const MOVEMENT_TYPE_OPTIONS = [
  { value: MovementType.PROMOTION, label: 'Promotion' },
  { value: MovementType.TRANSFER, label: 'Transfer' },
  { value: MovementType.RESIGNATION, label: 'Resignation' },
];
