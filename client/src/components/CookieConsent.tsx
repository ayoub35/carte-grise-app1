import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const COOKIE_CONSENT_KEY = "autodossiers_cookie_consent";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: true,
      date: new Date().toISOString(),
      preferences: {
        essential: true,
        performance: true,
        targeting: true,
      }
    }));
    setShowBanner(false);
  };

  const handleRefuse = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: false,
      date: new Date().toISOString(),
      preferences: {
        essential: true,
        performance: false,
        targeting: false,
      }
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-50 dark:bg-slate-900 border-t shadow-lg" data-testid="cookie-consent-banner">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="font-semibold text-xl mb-3">
              Choisir vos préférences en matière de cookies
            </h3>
            <p className="text-sm text-muted-foreground">
              Nous utilisons des cookies afin d'améliorer votre expérience, vous faciliter la navigation, fournir nos services et afin de pouvoir apporter des améliorations.
              Vous pouvez les accepter, les choisir ou{" "}
              <button 
                onClick={handleRefuse}
                className="text-primary underline hover:no-underline"
                data-testid="button-refuse-cookies"
              >
                tout refuser
              </button>
              . Pour plus d'informations, vous pouvez{" "}
              <Link href="/cookies" className="text-primary underline hover:no-underline">
                consulter notre page dédiée
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-start sm:justify-end">
            <Link href="/cookies">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-cookie-learn-more">
                En savoir plus
              </Button>
            </Link>
            <Button onClick={handleAccept} className="w-full sm:w-auto" data-testid="button-accept-cookies">
              Accepter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
