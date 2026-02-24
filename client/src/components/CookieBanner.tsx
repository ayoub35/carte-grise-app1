import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { useCookiePreferences } from "@/hooks/useCookiePreferences";
import { Link } from 'wouter';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { updatePreferences, preferences } = useCookiePreferences();

  useEffect(() => {
    // Check if user has already made a choice (cookie preferences exist in localStorage)
    const stored = localStorage.getItem('cookie_preferences');
    // Show banner only if no preferences have been set yet, or if they just reset them
    if (!stored) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    updatePreferences({
      essential: true,
      analytics: true,
      marketing: true,
    });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    updatePreferences({
      essential: true,
      analytics: false,
      marketing: false,
    });
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">
            Nous utilisons des cookies pour améliorer votre expérience.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            En poursuivant, vous acceptez nos cookies. Consultez notre{' '}
            <Link href="/cookies" className="text-primary hover:underline inline">
              politique cookies
            </Link>
            {' '}pour gérer vos préférences.
          </p>
        </div>

        <div className="flex items-center gap-2 whitespace-nowrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRejectAll}
            data-testid="button-reject-cookies"
          >
            Refuser
          </Button>
          <Button
            size="sm"
            onClick={handleAcceptAll}
            data-testid="button-accept-cookies"
          >
            Accepter
          </Button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-muted rounded-md transition-colors"
            aria-label="Fermer la banneau cookies"
            data-testid="button-close-cookie-banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
