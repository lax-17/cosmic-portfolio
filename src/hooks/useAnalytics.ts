import { useCallback } from 'react';
import { useAnalytics } from '@/contexts/AnalyticsContext';

// Custom hook for analytics with enhanced features
export const useEnhancedAnalytics = () => {
  const {
    analyticsConsent,
    setAnalyticsConsent,
    trackEvent,
    trackPageView,
    trackError,
    trackPerformance,
    trackScrollDepth,
    trackTimeOnPage,
    trackTerminalCommand
  } = useAnalytics();

  // Enhanced scroll depth tracking
  const trackEnhancedScrollDepth = useCallback(() => {
    if (!analyticsConsent) return;

    let maxScrollDepth = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = documentHeight > 0 ? Math.min(100, Math.round((scrollTop / documentHeight) * 100)) : 0;

      // Update max scroll depth
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track significant scroll milestones
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          trackScrollDepth(25);
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          trackScrollDepth(50);
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
          trackScrollDepth(75);
        } else if (maxScrollDepth >= 100) {
          trackScrollDepth(100);
        }
      }

      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Set new timeout to track when scrolling stops
      scrollTimeout = setTimeout(() => {
        trackEvent('scroll_stop', { depth: maxScrollDepth });
      }, 1000);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [analyticsConsent, trackScrollDepth, trackEvent]);

  // Time on page tracking
  const trackTimeOnPageEnhanced = useCallback(() => {
    if (!analyticsConsent) return;

    let startTime = Date.now();
    let timeInterval: NodeJS.Timeout;

    // Track time in 30-second intervals
    timeInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeSpent = Math.floor((currentTime - startTime) / 1000);
      trackTimeOnPage(timeSpent);
    }, 30000);

    // Cleanup function
    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
        const finalTime = Math.floor((Date.now() - startTime) / 1000);
        trackTimeOnPage(finalTime);
      }
    };
  }, [analyticsConsent, trackTimeOnPage]);

  // Enhanced event tracking with additional context
  const trackEnhancedEvent = useCallback((
    eventName: string,
    params?: Record<string, any>
  ) => {
    if (!analyticsConsent) return;

    // Add additional context to events
    const enhancedParams = {
      ...params,
      // Add viewport dimensions
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      // Add document dimensions
      document_width: document.documentElement.scrollWidth,
      document_height: document.documentElement.scrollHeight,
      // Add user agent info
      user_agent: navigator.userAgent,
      // Add timestamp
      timestamp: new Date().toISOString()
    };

    trackEvent(eventName, enhancedParams);
  }, [analyticsConsent, trackEvent]);

  // Track form interactions
  const trackFormInteraction = useCallback((
    formName: string,
    interactionType: string,
    fieldName?: string
  ) => {
    if (!analyticsConsent) return;

    trackEnhancedEvent('form_interaction', {
      form_name: formName,
      interaction_type: interactionType,
      field_name: fieldName
    });
  }, [analyticsConsent, trackEnhancedEvent]);

  // Track file downloads
  const trackFileDownload = useCallback((fileName: string, fileType: string) => {
    if (!analyticsConsent) return;

    trackEnhancedEvent('file_download', {
      file_name: fileName,
      file_type: fileType
    });
  }, [analyticsConsent, trackEnhancedEvent]);

  // Track outbound links
  const trackOutboundLink = useCallback((url: string) => {
    if (!analyticsConsent) return;

    trackEnhancedEvent('outbound_link', {
      url: url
    });
  }, [analyticsConsent, trackEnhancedEvent]);

  return {
    // Consent management
    analyticsConsent,
    setAnalyticsConsent,
    
    // Basic tracking functions
    trackEvent,
    trackPageView,
    trackError,
    trackPerformance,
    trackScrollDepth,
    trackTimeOnPage,
    trackTerminalCommand,
    
    // Enhanced tracking functions
    trackEnhancedScrollDepth,
    trackTimeOnPageEnhanced,
    trackEnhancedEvent,
    trackFormInteraction,
    trackFileDownload,
    trackOutboundLink
  };
};