import { Button } from './ui/button';
import { Shirt } from 'lucide-react';

interface OnboardingScreenProps {
  onConnect: () => void;
}

export function OnboardingScreen({ onConnect }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="mb-6 flex justify-center">
            <div className="size-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Shirt className="size-12 text-white" strokeWidth={2} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            DressReady
          </h1>
          
          <p className="text-lg text-gray-600 mb-2">
            Know what to wear before you walk out the door.
          </p>
          
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            DressReady combines your calendar, weather, and AI to recommend the right outfit for the day ahead.
          </p>
          
          <Button 
            onClick={onConnect}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-6 text-base rounded-xl shadow-md"
          >
            Connect Google Calendar
          </Button>
          
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
