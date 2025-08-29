import { useEffect } from 'react';
import { useEnhancedAnalytics } from '@/hooks/useAnalytics';

// Types for Core Web Vitals metrics
interface CoreWebVitalsMetrics {
  cls?: number; // Cumulative Layout Shift
  fid?: number; // First Input Delay
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  ttfb?: number; // Time to First Byte
}

// Types for Navigation Timing API
interface NavigationTimingMetrics {
  navigationStart: number;
  unloadEventStart: number;
  unloadEventEnd: number;
  redirectStart: number;
  redirectEnd: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  secureConnectionStart: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domLoading: number;
  domInteractive: number;
  domContentLoadedEventStart: number;
  domContentLoadedEventEnd: number;
  domComplete: number;
  loadEventStart: number;
  loadEventEnd: number;
}

// Types for Resource Timing API
interface ResourceTimingMetrics {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  initiatorType: string;
  nextHopProtocol: string;
  workerStart: number;
  redirectStart: number;
  redirectEnd: number;
  fetchStart: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  secureConnectionStart: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
}

export const usePerformanceMonitoring = () => {
  const { trackPerformance, analyticsConsent } = useEnhancedAnalytics();

  // Measure Core Web Vitals
  const measureCoreWebVitals = () => {
    if (!analyticsConsent || !('performance' in window)) return;

    // Measure FCP (First Contentful Paint)
    if ('getEntriesByName' in performance) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        trackPerformance({ fcp: fcpEntry.startTime });
      }
    }

    // Measure LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        trackPerformance({ lcp: lastEntry.startTime });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Do nothing if LCP is not supported
      }
    }

    // Measure CLS (Cumulative Layout Shift)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        trackPerformance({ cls: clsValue });
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Do nothing if CLS is not supported
      }
    }

    // Measure FID (First Input Delay)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];
        const fid = (firstEntry as any).processingStart - (firstEntry as any).startTime;
        trackPerformance({ fid });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Do nothing if FID is not supported
      }
    }

    // Measure TTFB (Time to First Byte)
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
      trackPerformance({ ttfb: navigationEntry.responseStart - navigationEntry.requestStart });
    }
  };

  // Measure Navigation Timing
  const measureNavigationTiming = () => {
    if (!analyticsConsent || !('performance' in window)) return;

    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
      
      // Track detailed navigation timing metrics
      trackPerformance({
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        fcp: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime,
        lcp: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
        // Add other navigation timing metrics as needed
      });
    }
  };

  // Measure Resource Loading Performance
  const measureResourcePerformance = () => {
    if (!analyticsConsent || !('performance' in window)) return;

    const resourceEntries = performance.getEntriesByType('resource');
    
    // Group resources by type
    const resourceGroups: Record<string, ResourceTimingMetrics[]> = {
      script: [],
      css: [],
      image: [],
      font: [],
      other: []
    };
    
    resourceEntries.forEach(entry => {
      const resource = entry as PerformanceResourceTiming;
      const initiatorType = resource.initiatorType || 'other';
      
      if (resourceGroups[initiatorType]) {
        resourceGroups[initiatorType].push(resource as ResourceTimingMetrics);
      } else {
        resourceGroups.other.push(resource as ResourceTimingMetrics);
      }
    });
    
    // Track resource loading performance
    Object.entries(resourceGroups).forEach(([type, resources]) => {
      if (resources.length > 0) {
        const totalDuration = resources.reduce((sum, resource) => sum + resource.duration, 0);
        const averageDuration = totalDuration / resources.length;
        
        trackPerformance({
          [`resource_${type}_count`]: resources.length,
          [`resource_${type}_avg_duration`]: averageDuration,
          [`resource_${type}_total_duration`]: totalDuration
        });
      }
    });
  };

  // Initialize performance monitoring
  useEffect(() => {
    if (!analyticsConsent) return;

    // Measure Core Web Vitals when page is fully loaded
    const handleLoad = () => {
      // Delay measurement to ensure all metrics are available
      setTimeout(() => {
        measureCoreWebVitals();
        measureNavigationTiming();
        measureResourcePerformance();
      }, 2000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [analyticsConsent]);

  return {
    measureCoreWebVitals,
    measureNavigationTiming,
    measureResourcePerformance
  };
};