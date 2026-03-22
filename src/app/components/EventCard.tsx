import { Calendar, MapPin, Clock, Sparkles } from 'lucide-react';
import { CalendarEvent } from '../services/calendar';
import { motion } from 'motion/react';

interface EventCardProps {
  event: CalendarEvent;
  isHero?: boolean;
}

export function EventCard({ event, isHero = false }: EventCardProps) {
  const formattedTime = event.startTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  if (isHero) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <Sparkles className="size-5" />
            <span className="text-sm font-medium">Next Event</span>
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-6"
          >
            {event.title}
          </motion.h3>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 mb-6"
          >
            <div className="flex items-center gap-3">
              <Clock className="size-5 flex-shrink-0" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="size-5 flex-shrink-0" />
              <span>{event.location}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="size-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold mb-1">Recommended Outfit</div>
                <div className="text-white/90">{event.dressCode}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <motion.h4 
        className="font-semibold text-lg mb-3 text-gray-900"
        whileHover={{ x: 5 }}
      >
        {event.title}
      </motion.h4>

      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock className="size-4" />
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          <span>{event.location}</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-purple-50 rounded-xl p-3"
      >
        <div className="flex items-start gap-2 text-sm">
          <Sparkles className="size-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-purple-900 block mb-1">Outfit Suggestion</span>
            <span className="text-purple-700">{event.dressCode}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}