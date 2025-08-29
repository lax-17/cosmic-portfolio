import { useEffect } from 'react';
import { useEnhancedAnalytics } from '@/hooks/useAnalytics';

export const useErrorTracking = () => {
  const { trackError, analyticsConsent } = useEnhancedAnalytics();

  useEffect(() => {
    if (!analyticsConsent) return;

    // Track JavaScript errors
    const handleError = (event: ErrorEvent) => {
      trackError(`JavaScript Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`, false);
    };

    // Track unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(`Unhandled Promise Rejection: ${event.reason}`, false);
    };

    // Track component errors (caught by error boundaries)
    const handleComponentError = (error: Error, componentStack: string) => {
      trackError(`Component Error: ${error.toString()} | Stack: ${componentStack}`, true);
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Store the component error handler in a global variable for use in error boundaries
    (window as any).trackComponentError = handleComponentError;

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      delete (window as any).trackComponentError;
    };
  }, [analyticsConsent, trackError]);

  return {
    trackComponentError: (error: Error, componentStack: string) => {
      if (analyticsConsent && (window as any).trackComponentError) {
        (window as any).trackComponentError(error, componentStack);
      }
    }
  };
};