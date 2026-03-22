interface EmptyStateProps {
  date?: Date;
}

export function EmptyState({ date }: EmptyStateProps) {
  const dayLabel = date ? date.toLocaleDateString('en-US', { weekday: 'short' }) : 'today';
  
  return (
    <div className="bg-white/92 backdrop-blur-sm rounded-3xl p-12 text-center shadow-md border border-black/5">
      <div className="text-5xl mb-3">☁</div>
      <h3 className="text-xl font-extrabold text-[#10204b] mb-2">
        No events connected
      </h3>
      <p className="text-sm text-[#6b7ba4] leading-relaxed">
        No events connected for {dayLabel}. Add events or connect your calendar.
      </p>
    </div>
  );
}