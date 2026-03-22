import { DRESS_CODES, type CalendarEvent } from '../data/mockData';

interface EventCardItemProps {
  event: CalendarEvent;
  isPast?: boolean;
}

export function EventCardItem({ event, isPast = false }: EventCardItemProps) {
  const startTime = event.start.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
  
  const endTime = event.end.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });

  const locationLabel = event.resolvedLocationLabel || event.location || 'No location set';
  const eventType = event.isVirtual ? 'Virtual' : 'In person';
  
  const dressCodeStyle = DRESS_CODES[event.dressCode] || DRESS_CODES['Casual'];

  return (
    <div
      className={`bg-white/92 backdrop-blur-sm rounded-3xl p-5 shadow-md border border-black/5 transition-opacity ${
        isPast ? 'opacity-50' : ''
      }`}
    >
      <div className="grid md:grid-cols-[120px_1fr] gap-4">
        {/* Time Section */}
        <div>
          <div className="text-3xl font-extrabold text-[#0f1f48] leading-tight">
            {startTime}
          </div>
          <div className="text-xs text-[#7787ad] mt-2">
            {endTime}
          </div>
          <div
            className="inline-block mt-3 px-2 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider"
            style={{
              background: '#edf4ff',
              color: '#476198',
            }}
          >
            {event.calendarName}
          </div>
        </div>

        {/* Event Details */}
        <div>
          <h3 className="text-xl font-extrabold text-[#10204b] mb-2 leading-tight">
            {event.title}
          </h3>
          
          <div className="text-xs text-[#6678a0] leading-relaxed mb-4 space-y-1">
            <p>Calendar: {event.calendarName}</p>
            <p>Location: {locationLabel}</p>
            <p>Type: {eventType}</p>
          </div>

          {/* Recommendation Card */}
          <div className="bg-[#f8faff]/95 border border-black/8 rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-[#6f7da3] font-extrabold mb-2">
              Dress code
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold"
                style={{
                  background: dressCodeStyle.bgColor,
                  color: dressCodeStyle.textColor,
                }}
              >
                {event.dressCode}
              </span>
              
              <span className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-black/8 text-xs font-bold text-[#52648f]">
                {event.forecastSummary}
              </span>
            </div>
            
            <p className="text-sm text-[#1a2958] leading-relaxed">
              {event.recommendation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
