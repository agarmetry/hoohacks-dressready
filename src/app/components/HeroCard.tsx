import { CalendarEvent } from '../services/calendar';
import { Badge } from './ui/badge';

interface HeroCardProps {
  event?: CalendarEvent | null;
  isDayComplete?: boolean;
  message?: string;
}

export function HeroCard({ event, isDayComplete = false, message }: HeroCardProps) {
  if (isDayComplete || !event) {
    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 text-white shadow-lg">
        <Badge className="bg-white/20 text-white mb-4 hover:bg-white/30">
          Day complete
        </Badge>
        
        <h2 className="text-2xl font-semibold mb-3">
          You're all done for today.
        </h2>
        
        <p className="text-gray-300">
          {message || "Check tomorrow's forecast to plan ahead. Balanced day - dress code and weather both matter."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg">
      <Badge className="bg-white/20 text-white mb-4 hover:bg-white/30">
        Most important upcoming event
      </Badge>
      
      <h2 className="text-2xl font-semibold mb-3">
        {event.title}
      </h2>
      
      <p className="text-indigo-100 mb-4">
        {event.description || 
          `${event.dressCode} - For a casual and comfortable look in pleasant warm weather, choose lightweight chinos or tailored shorts paired with a breathable cotton t-shirt or a polo shirt. Finish with comfortable sneakers or smart casual sandals.`}
      </p>
      
      {event.location && event.location !== 'No location set' && (
        <p className="text-sm text-indigo-200">
          {event.location}
        </p>
      )}
      
      <p className="text-sm text-indigo-200 mt-2">
        Balanced day - dress code and weather both matter.
      </p>
    </div>
  );
}
