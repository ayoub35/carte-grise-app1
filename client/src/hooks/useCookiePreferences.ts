import { useState, useEffect } from 'react';

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: true,
  marketing: true,
};

const STORAGE_KEY = 'cookie_preferences';

export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences(parsed);
      } catch (e) {
        setPreferences(DEFAULT_PREFERENCES);
      }
    } else {
      // First visit - set defaults
      setPreferences(DEFAULT_PREFERENCES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    }
    setIsLoading(false);
  }, []);

  // Save preferences to localStorage
  const updatePreferences = (newPreferences: Partial<CookiePreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
  };

  return {
    preferences,
    updatePreferences,
    resetToDefaults,
    isLoading,
  };
}
