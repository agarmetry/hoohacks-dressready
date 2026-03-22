import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Location } from '../data/mockData';

interface LocationSettingsProps {
  location: Location;
  onLocationChange: (location: Location) => void;
}

export function LocationSettings({ location, onLocationChange }: LocationSettingsProps) {
  const [cityInput, setCityInput] = useState('');
  const [message, setMessage] = useState('');

  const handleUseCity = () => {
    if (!cityInput.trim()) {
      setMessage('Please enter a city name');
      return;
    }

    // Mock geocoding - in real app, would call API
    const newLocation: Location = {
      label: cityInput,
      lat: 40.7128,
      lon: -74.006,
      source: 'manual',
    };

    onLocationChange(newLocation);
    setMessage(`Using ${cityInput} for weather.`);
    setCityInput('');
  };

  const handleRefresh = () => {
    // Mock refresh - in real app, would re-detect location
    const refreshedLocation: Location = {
      label: 'Charlottesville, VA',
      lat: 38.0293,
      lon: -78.4767,
      source: 'ip',
    };

    onLocationChange(refreshedLocation);
    setMessage('Location refreshed.');
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mt-3 shadow-sm border border-black/5">
      <p className="text-xs text-[#6677a2] mb-3">
        Current weather location: {location.label} ({location.source})
      </p>

      <Input
        type="text"
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
        placeholder="Example: New York, NY"
        className="mb-3"
      />

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleUseCity} variant="outline" size="sm" className="text-xs">
          Use this city
        </Button>
        <Button onClick={handleRefresh} variant="outline" size="sm" className="text-xs">
          Refresh auto location
        </Button>
      </div>

      {message && (
        <p className="text-xs text-[#2f67ff] mt-2">{message}</p>
      )}
    </div>
  );
}
