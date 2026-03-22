import type { CalendarEvent } from '../data/mockData';

interface NextHourCardProps {
  event: CalendarEvent;
  minutesUntil: number;
}

export function NextHourCard({ event, minutesUntil }: NextHourCardProps) {
  return (
    <div className="bg-white/92 backdrop-blur-sm rounded-3xl p-5 mb-4 shadow-md border border-black/5">
      <div className="text-xs uppercase tracking-widest text-[#6d7da5] font-extrabold mb-2">
        Next hour
      </div>
      <h3 className="text-lg font-extrabold text-[#10204b] mb-2">
        {event.title}
      </h3>
      <p className="text-sm text-[#5e719c]">
        Starts in {minutesUntil} minutes.
      </p>
    </div>
  );
}
