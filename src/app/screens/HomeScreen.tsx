import { Cloud, Calendar, Sparkles, Shirt, CloudRain, Sun, Wind, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

interface HomeScreenProps {
  onLogin: () => void;
}

export function HomeScreen({ onLogin }: HomeScreenProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Cloud,
      title: 'Real-Time Weather',
      description: 'Hourly & 8-day forecasts with precise location tracking',
      color: 'from-blue-500 to-cyan-400',
    },
    {
      icon: Calendar,
      title: 'Calendar Integration',
      description: 'Sync with Google Calendar for event-aware suggestions',
      color: 'from-purple-500 to-pink-400',
    },
    {
      icon: Sparkles,
      title: 'AI Dress Codes',
      description: '6-tier system from Casual to Ultra Formal with smart recommendations',
      color: 'from-amber-500 to-orange-400',
    },
    {
      icon: Shirt,
      title: 'Outfit Suggestions',
      description: 'Personalized recommendations based on weather & events',
      color: 'from-green-500 to-emerald-400',
    },
  ];

  const weatherAnimations = [
    { icon: Sun, className: 'top-20 left-10', delay: 0, color: 'text-amber-400' },
    { icon: Cloud, className: 'top-32 right-20', delay: 0.2, color: 'text-blue-300' },
    { icon: CloudRain, className: 'bottom-32 left-16', delay: 0.4, color: 'text-blue-400' },
    { icon: Wind, className: 'bottom-20 right-16', delay: 0.6, color: 'text-cyan-300' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden relative">
      {/* Animated weather icons background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {weatherAnimations.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.className}`}
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <item.icon className={`w-16 h-16 ${item.color}`} />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="relative">
              <Cloud className="w-12 h-12 text-blue-600" />
              <Shirt className="w-6 h-6 text-purple-600 absolute -bottom-1 -right-1" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              DressReady
            </h1>
          </motion.div>
          
          <motion.p
            className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Never second-guess your outfit again. We combine real-time weather forecasting 
            with your calendar events to recommend the perfect outfit for every moment.
          </motion.p>
        </motion.div>

        {/* Mission Statement Card */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 mb-12 border border-gray-200"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed mb-8">
            DressReady empowers you to dress confidently for any occasion. By intelligently 
            analyzing weather patterns and your calendar commitments, we eliminate the daily 
            stress of choosing what to wear. Whether it's a casual coffee meetup or a formal 
            business presentation, we ensure you're always appropriately dressed and comfortable.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Save Time</h3>
              <p className="text-sm text-gray-600">No more outfit planning stress</p>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Stay Prepared</h3>
              <p className="text-sm text-gray-600">Always ready for any weather</p>
            </motion.div>

            <motion.div
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Dress Right</h3>
              <p className="text-sm text-gray-600">Perfect outfit for every event</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow cursor-pointer border border-gray-100"
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-start gap-4">
                <motion.div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}
                  animate={{
                    rotate: hoveredFeature === index ? [0, -10, 10, -10, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-1 inline-block shadow-2xl">
            <div className="bg-white rounded-[22px] px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Connect your Google Calendar to receive personalized outfit recommendations 
                for all your upcoming events.
              </p>
              
              <motion.button
                onClick={onLogin}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google Calendar
              </motion.button>

              <p className="text-xs text-gray-500 mt-4">
                We only access your calendar events. Your data stays private and secure.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
