import { Bell, BellOff, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useNotifications, type NotificationTiming } from '../../hooks/useNotifications';

const TIMING_LABELS: Record<NotificationTiming, string> = {
  '1hour': '1 hour before',
  '30min': '30 minutes before',
  '15min': '15 minutes before',
  '5min': '5 minutes before',
};

export function NotificationSettings() {
  const {
    permission,
    settings,
    requestPermission,
    updateSettings,
    sendTestNotification,
  } = useNotifications();

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      updateSettings({ enabled: true });
      sendTestNotification();
    }
  };

  const handleToggleTiming = (timing: NotificationTiming) => {
    const timings = settings.timings.includes(timing)
      ? settings.timings.filter(t => t !== timing)
      : [...settings.timings, timing];
    updateSettings({ timings });
  };

  const isNotificationSupported = 'Notification' in window;

  if (!isNotificationSupported) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mt-3 shadow-sm border border-black/5">
        <p className="text-xs text-[#6677a2] text-center">
          ⚠️ Notifications are not supported in this browser
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 mt-3 shadow-sm border border-black/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {permission === 'granted' && settings.enabled ? (
            <Bell className="size-5 text-purple-600" />
          ) : (
            <BellOff className="size-5 text-gray-400" />
          )}
          <h3 className="text-sm font-bold text-[#0f2048]">Event Notifications</h3>
        </div>
        
        {permission === 'granted' && (
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          />
        )}
      </div>

      {/* Permission Request */}
      {permission !== 'granted' && (
        <div className="mb-4">
          <p className="text-xs text-[#6677a2] mb-3">
            Get notified before your important events with outfit recommendations.
          </p>
          <Button
            onClick={handleEnableNotifications}
            className="w-full"
            variant="outline"
            size="sm"
          >
            <Bell className="size-4 mr-2" />
            Enable Notifications
          </Button>
        </div>
      )}

      {/* Settings (only show if permission granted) */}
      {permission === 'granted' && settings.enabled && (
        <>
          {/* Event Type Settings */}
          <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
            <Label className="text-xs font-bold text-[#0f2048] uppercase tracking-wider">
              Notify me for
            </Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-hero"
                checked={settings.notifyHeroEvent}
                onCheckedChange={(checked) => 
                  updateSettings({ notifyHeroEvent: !!checked })
                }
              />
              <Label
                htmlFor="notify-hero"
                className="text-sm cursor-pointer text-[#2a3f6f]"
              >
                ⭐ Most important event
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify-next"
                checked={settings.notifyNextEvent}
                onCheckedChange={(checked) => 
                  updateSettings({ notifyNextEvent: !!checked })
                }
              />
              <Label
                htmlFor="notify-next"
                className="text-sm cursor-pointer text-[#2a3f6f]"
              >
                📅 Next upcoming event
              </Label>
            </div>
          </div>

          {/* Timing Settings */}
          <div className="space-y-3 mb-4">
            <Label className="text-xs font-bold text-[#0f2048] uppercase tracking-wider">
              Remind me
            </Label>
            
            {(Object.keys(TIMING_LABELS) as NotificationTiming[]).map((timing) => (
              <div key={timing} className="flex items-center space-x-2">
                <Checkbox
                  id={`timing-${timing}`}
                  checked={settings.timings.includes(timing)}
                  onCheckedChange={() => handleToggleTiming(timing)}
                />
                <Label
                  htmlFor={`timing-${timing}`}
                  className="text-sm cursor-pointer text-[#2a3f6f]"
                >
                  {TIMING_LABELS[timing]}
                </Label>
              </div>
            ))}
          </div>

          {/* Test Notification */}
          <Button
            onClick={sendTestNotification}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            Send Test Notification
          </Button>

          {/* Status */}
          <div className="mt-3 flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg p-2">
            <Check className="size-4" />
            <span>Notifications enabled and ready</span>
          </div>
        </>
      )}

      {/* Blocked/Denied State */}
      {permission === 'denied' && (
        <div className="text-xs text-red-700 bg-red-50 rounded-lg p-3">
          ⚠️ Notifications are blocked. Please enable them in your browser settings.
        </div>
      )}
    </div>
  );
}
