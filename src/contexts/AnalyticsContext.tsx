import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

// Extend window interface for GA4
interface Window {
  dataLayer: any[];
}

// Define types for our analytics context
interface AnalyticsContextType {
  // Consent management
  analyticsConsent: boolean | null;
  setAnalyticsConsent: (consent: boolean | null) => void;
  
  // Event tracking
  trackEvent: (eventName: string, params?: Record<string, any>) => void;
  trackPageView: (path: string, title?: string) => void;
  trackError: (error: string, fatal?: boolean) => void;
  
  // Performance tracking
  trackPerformance: (metrics: PerformanceMetrics) => void;
  
  // Engagement tracking
  trackScrollDepth: (depth: number) => void;
  trackTimeOnPage: (seconds: number) => void;
  trackTerminalCommand: (command: string) => void;
}

interface PerformanceMetrics {
  cls?: number;
  fid?: number;
  fcp?: number;
  lcp?: number;
  ttfb?: number;
}

// Default context value
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

// GA4 tracking ID - replace with your actual GA4 measurement ID
const GA4_MEASUREMENT_ID = (import.meta.env.VITE_GA_ID as string | undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(null);
  const location = useLocation();
  
  // Initialize GA4 (consent + env driven)
  useEffect(() => {
    if (!analyticsConsent || !GA4_MEASUREMENT_ID) return;

    // Avoid duplicate script injection
    const existing = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}"]`);
    if (!existing) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      document.head.appendChild(script);
    }

    // Initialize gtag once
    if (!(window as any).gtag) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(){ (window as any).dataLayer.push(arguments); }
      (window as any).gtag = gtag as any;
    }

    // Configure page after ensuring gtag is available
    (window as any).gtag('js', new Date());
    (window as any).gtag('config', GA4_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }, [analyticsConsent]);
  
  // Track page views on route changes
  useEffect(() => {
    if (analyticsConsent) {
      trackPageView(location.pathname, document.title);
    }
  }, [location, analyticsConsent]);
  
  // Consent management
  const handleSetAnalyticsConsent = (consent: boolean | null) => {
    setAnalyticsConsent(consent);
    if (consent !== null) {
      localStorage.setItem('analyticsConsent', consent.toString());
    }
  };
  
  // Event tracking
  const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
    if (analyticsConsent && typeof (window as any).gtag !== 'undefined') {
      ((window as any).gtag as any)('event', eventName, {
        ...params,
        page_location: window.location.href,
        page_title: document.title
      });
    }
  };
  
  // Page view tracking
  const trackPageView = (path: string, title?: string) => {
    if (analyticsConsent && typeof (window as any).gtag !== 'undefined') {
      ((window as any).gtag as any)('config', GA4_MEASUREMENT_ID, {
        page_title: title || document.title,
        page_location: window.location.origin + path,
        page_path: path
      });
    }
  };
  
  // Error tracking
  const trackError = (error: string, fatal: boolean = false) => {
    if (analyticsConsent && typeof (window as any).gtag !== 'undefined') {
      ((window as any).gtag as any)('event', 'exception', {
        description: error,
        fatal: fatal
      });
    }
  };
  
  // Performance tracking
  const trackPerformance = (metrics: PerformanceMetrics) => {
    if (analyticsConsent && typeof (window as any).gtag !== 'undefined') {
      ((window as any).gtag as any)('event', 'performance_metrics', {
        ...metrics,
        page_location: window.location.href,
        page_title: document.title
      });
    }
  };
  
  // Engagement tracking
  const trackScrollDepth = (depth: number) => {
    if (analyticsConsent) {
      trackEvent('scroll_depth', { depth });
    }
  };
  
  const trackTimeOnPage = (seconds: number) => {
    if (analyticsConsent) {
      trackEvent('time_on_page', { seconds });
    }
  };
  
  const trackTerminalCommand = (command: string) => {
    if (analyticsConsent) {
      trackEvent('terminal_command', { command });
    }
  };
  
  // Initialize consent from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem('analyticsConsent');
    if (savedConsent !== null) {
      setAnalyticsConsent(savedConsent === 'true');
    }
  }, []);
  
  const value = {
    analyticsConsent,
    setAnalyticsConsent: handleSetAnalyticsConsent,
    trackEvent,
    trackPageView,
    trackError,
    trackPerformance,
    trackScrollDepth,
    trackTimeOnPage,
    trackTerminalCommand
  };
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};