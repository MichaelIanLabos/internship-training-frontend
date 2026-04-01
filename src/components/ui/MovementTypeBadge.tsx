export function MovementTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-violet-50 px-3 py-0.5 text-xs font-medium capitalize text-violet-700">
      {type}
    </span>
  );
}
