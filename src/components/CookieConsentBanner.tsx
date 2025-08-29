import { useState, useEffect } from 'react';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const CookieConsentBanner = () => {
  const { analyticsConsent, setAnalyticsConsent } = useAnalytics();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner if consent is not yet given
    if (analyticsConsent === null || analyticsConsent === undefined) {
      setIsVisible(true);
    }
  }, [analyticsConsent]);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setIsVisible(false);
  };

  const handleReject = () => {
    setAnalyticsConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border p-4 shadow-lg animate-in slide-in-from-bottom-10 duration-300">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">We value your privacy</h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to improve your experience and for analytics. You can change your cookie preferences at any time in the settings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={handleAccept}
            className="w-full sm:w-auto"
          >
            Accept All
          </Button>
          <Button 
            onClick={handleReject}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Reject All
          </Button>
          <Button 
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Customize
          </Button>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Close cookie consent banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;