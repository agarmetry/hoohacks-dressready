import { useState } from 'react';
import { Button } from '../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';

interface OnboardingScreenProps {
  onComplete: (preferences: {
    styleVibe: string;
    colorPalette: string;
    priority: string;
  }) => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [styleVibe, setStyleVibe] = useState('Smart Casual');
  const [colorPalette, setColorPalette] = useState('Neutrals');
  const [priority, setPriority] = useState('Comfort First');
  const [showCustomize, setShowCustomize] = useState(false);

  const handleConnect = () => {
    onComplete({ styleVibe, colorPalette, priority });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'radial-gradient(circle at top left, rgba(190,216,255,.55), transparent 28%), radial-gradient(circle at bottom right, rgba(213,190,255,.38), transparent 24%), linear-gradient(180deg, #fbfcff 0%, #f7f8fc 100%)',
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-white/92 backdrop-blur-sm rounded-3xl p-9 text-center shadow-lg border border-black/5">
          {/* App Icon */}
          <div className="w-20 h-20 mx-auto mb-5 rounded-3xl flex items-center justify-center text-5xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #2f67ff 0%, #8157f7 100%)',
              boxShadow: '0 14px 26px rgba(106, 94, 232, .28)',
            }}
          >
            👕
          </div>

          {/* Title */}
          <h1 className="text-3xl font-extrabold text-[#0f2048] mb-3 leading-tight">
            DressReady
          </h1>

          <p className="text-lg text-[#223b70] mb-4 font-medium">
            Know what to wear before you walk out the door.
          </p>

          <p className="text-sm text-[#6d7da6] leading-relaxed mb-6">
            DressReady combines your calendar, weather, and AI to recommend the right outfit for the day ahead.
          </p>

          {/* Customization Section */}
          {showCustomize ? (
            <div className="mb-6 text-left space-y-5">
              {/* Style Vibe */}
              <div>
                <Label className="text-sm font-bold text-[#0f2048] mb-3 block">Style vibe</Label>
                <RadioGroup value={styleVibe} onValueChange={setStyleVibe}>
                  <div className="grid grid-cols-2 gap-2">
                    {['Smart Casual', 'Streetwear', 'Formal', 'Sporty'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`vibe-${option}`} />
                        <Label htmlFor={`vibe-${option}`} className="text-sm cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Color Preference */}
              <div>
                <Label className="text-sm font-bold text-[#0f2048] mb-3 block">Color preference</Label>
                <RadioGroup value={colorPalette} onValueChange={setColorPalette}>
                  <div className="grid grid-cols-2 gap-2">
                    {['Neutrals', 'Bold Colors', 'Mixed'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`color-${option}`} />
                        <Label htmlFor={`color-${option}`} className="text-sm cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Priority */}
              <div>
                <Label className="text-sm font-bold text-[#0f2048] mb-3 block">Priority</Label>
                <RadioGroup value={priority} onValueChange={setPriority}>
                  <div className="flex gap-4">
                    {['Style First', 'Comfort First'].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`priority-${option}`} />
                        <Label htmlFor={`priority-${option}`} className="text-sm cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCustomize(true)}
              className="text-sm text-[#7c4dff] font-semibold mb-6 hover:underline"
            >
              Customize your style profile
            </button>
          )}

          {/* Connect Button */}
          <Button
            onClick={handleConnect}
            className="w-full h-12 text-base font-bold rounded-xl"
            style={{
              background: 'linear-gradient(180deg, #8b5cf6 0%, #7c4dff 100%)',
              boxShadow: '0 8px 16px rgba(126, 78, 255, .32)',
            }}
          >
            Connect Google Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
