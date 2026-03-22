import { useState, useEffect } from 'react';
import { HomeScreen } from './screens/HomeScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { APP_SETTINGS, DEMO_USER } from '../config/settings';

export default function App() {
  const { isAuthenticated, user, isLoading, login, logout, error } = useGoogleAuth();
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [preferences, setPreferences] = useState({
    styleVibe: 'Smart Casual',
    colorPalette: 'Neutrals',
    priority: 'Comfort First',
  });

  // Demo mode override
  const isDemoMode = APP_SETTINGS.DEMO_MODE;
  const effectiveAuth = isDemoMode ? true : isAuthenticated;
  const effectiveUser = isDemoMode ? DEMO_USER : user;

  // Check if user has completed onboarding
  useEffect(() => {
    if (effectiveAuth && effectiveUser) {
      const onboardingKey = `dressready_onboarded_${effectiveUser.email}`;
      const savedOnboarding = localStorage.getItem(onboardingKey);
      
      if (savedOnboarding) {
        const data = JSON.parse(savedOnboarding);
        setIsOnboarded(true);
        setPreferences(data.preferences);
      }
    }
  }, [effectiveAuth, effectiveUser]);

  const handleOnboardingComplete = (prefs: typeof preferences) => {
    setPreferences(prefs);
    setIsOnboarded(true);
    
    // Save onboarding completion
    if (effectiveUser) {
      const onboardingKey = `dressready_onboarded_${effectiveUser.email}`;
      localStorage.setItem(onboardingKey, JSON.stringify({
        preferences: prefs,
        completedAt: new Date().toISOString(),
      }));
    }
  };

  const handleLogout = () => {
    if (isDemoMode) {
      // In demo mode, just clear onboarding and reload
      if (effectiveUser) {
        const onboardingKey = `dressready_onboarded_${effectiveUser.email}`;
        localStorage.removeItem(onboardingKey);
      }
      setIsOnboarded(false);
    } else {
      logout();
    }
  };

  // Show loading state (skip in demo mode)
  if (!isDemoMode && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at top left, rgba(190,216,255,.55), transparent 28%), radial-gradient(circle at bottom right, rgba(213,190,255,.38), transparent 24%), linear-gradient(180deg, #fbfcff 0%, #f7f8fc 100%)',
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3">🔐</div>
          <p className="text-[#6677a2]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show auth error if any (skip in demo mode)
  if (!isDemoMode && error) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle at top left, rgba(190,216,255,.55), transparent 28%), radial-gradient(circle at bottom right, rgba(213,190,255,.38), transparent 24%), linear-gradient(180deg, #fbfcff 0%, #f7f8fc 100%)',
        }}
      >
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-[#0f2048] mb-2">Authentication Error</h2>
          <p className="text-[#6677a2] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#2f67ff] text-white rounded-xl font-bold hover:bg-[#2557dd] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show home screen if not authenticated (and not demo mode)
  if (!effectiveAuth) {
    return <HomeScreen onLogin={login} />;
  }

  // Show onboarding if authenticated but not onboarded
  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show dashboard if authenticated and onboarded
  return <DashboardScreen preferences={preferences} user={effectiveUser} onLogout={handleLogout} />;
}