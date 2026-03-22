import type { CalendarEvent } from '../data/mockData';

interface HeroEventCardProps {
  event: CalendarEvent;
}

export function HeroEventCard({ event }: HeroEventCardProps) {
  const locationLabel = event.resolvedLocationLabel || event.location || 'No location set';

  return (
    <div className="bg-gradient-to-b from-[#252949] to-[#1d2142] rounded-3xl p-7 mb-5 text-white">
      <div className="inline-block bg-white/12 text-white/92 rounded-full px-3 py-2 text-xs font-bold mb-5">
        Most important upcoming event
      </div>
      
      <h3 className="text-xl font-extrabold mb-2 leading-tight">
        {event.title}
      </h3>
      
      <div className="text-white/82 text-sm leading-relaxed space-y-1">
        <p>{event.dressCode} - {event.recommendation}</p>
        <p>{locationLabel}</p>
        <p className="mt-2">Balanced day - dress code and weather both matter.</p>
      </div>
    </div>
  );
}
