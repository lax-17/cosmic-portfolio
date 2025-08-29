import { useCallback, useEffect, useRef, useMemo } from 'react';

/**
 * Custom hook for performance optimizations
 * Handles cleanup, throttling, and memory management
 */
export const usePerformanceOptimization = () => {
  const cleanupFunctions = useRef<(() => void)[]>([]);
  const rafId = useRef<number>();
  const timeoutIds = useRef<NodeJS.Timeout[]>([]);

  // Throttle function for performance-critical operations
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;

    return ((...args: any[]) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
        timeoutIds.current.push(timeoutId);
      }
    }) as T;
  }, []);

  // Debounce function for user input
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;

    return ((...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
      timeoutIds.current.push(timeoutId);
    }) as T;
  }, []);

  // RequestAnimationFrame wrapper for smooth animations
  const requestAnimationFrame = useCallback((callback: () => void) => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = window.requestAnimationFrame(() => {
      callback();
      rafId.current = undefined;
    });
  }, []);

  // Add cleanup function
  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);

  // Cleanup all resources
  const cleanup = useCallback(() => {
    // Cancel animation frames
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = undefined;
    }

    // Clear timeouts
    timeoutIds.current.forEach(id => clearTimeout(id));
    timeoutIds.current = [];

    // Run cleanup functions
    cleanupFunctions.current.forEach(cleanup => cleanup());
    cleanupFunctions.current = [];
  }, []);

  // Auto cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Memoized event listener with passive option
  const addEventListener = useCallback((
    element: EventTarget,
    event: string,
    handler: EventListener,
    options: AddEventListenerOptions = {}
  ) => {
    const passiveOptions = { passive: true, ...options };
    element.addEventListener(event, handler, passiveOptions);

    addCleanup(() => {
      element.removeEventListener(event, handler);
    });
  }, [addCleanup]);

  // Intersection Observer hook
  const useIntersectionObserver = useCallback((
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
  ) => {
    const observerRef = useRef<IntersectionObserver>();

    useEffect(() => {
      observerRef.current = new IntersectionObserver(callback, {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      });

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }, []);

    return observerRef.current;
  }, []);

  return {
    throttle,
    debounce,
    requestAnimationFrame,
    addEventListener,
    useIntersectionObserver,
    addCleanup,
    cleanup
  };
};

/**
 * Hook for optimizing expensive calculations
 */
export const useOptimizedMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  options: { maxAge?: number } = {}
): T => {
  const { maxAge = 5000 } = options;
  const cache = useRef<{ value: T; timestamp: number }>();

  return useMemo(() => {
    const now = Date.now();

    if (cache.current && (now - cache.current.timestamp) < maxAge) {
      return cache.current.value;
    }

    const value = factory();
    cache.current = { value, timestamp: now };
    return value;
  }, deps);
};

/**
 * Hook for preventing unnecessary re-renders
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
};

/**
 * Hook for WebGL context management and optimization
 */
export const useWebGLPerformance = () => {
  const glContextRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const extensionsRef = useRef<Record<string, any>>({});
  
  // Initialize WebGL context with optimizations
  const initWebGLContext = useCallback((canvas: HTMLCanvasElement, options: WebGLContextAttributes = {}) => {
    // Default optimized options
    const defaultOptions: WebGLContextAttributes = {
      alpha: true,
      antialias: true,
      depth: true,
      stencil: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
      desynchronized: true,
      ...options
    };
    
    // Try to get WebGL2 context first
    let gl: WebGL2RenderingContext | WebGLRenderingContext | null =
      canvas.getContext('webgl2', defaultOptions) as WebGL2RenderingContext;
    
    // Fall back to WebGL1 if needed
    if (!gl) {
      gl = canvas.getContext('webgl', defaultOptions) as WebGLRenderingContext;
    }
    
    if (!gl) {
      console.warn('WebGL not supported');
      return null;
    }
    
    glContextRef.current = gl;
    
    // Enable common optimizations
    if (gl instanceof WebGL2RenderingContext || 'WebGL2RenderingContext' in window) {
      // WebGL2 specific optimizations
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    } else {
      // WebGL1 specific optimizations
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
    }
    
    // Enable culling for better performance
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    return gl;
  }, []);
  
  // Load WebGL extensions
  const loadExtension = useCallback((name: string) => {
    if (!glContextRef.current) return null;
    
    if (extensionsRef.current[name]) {
      return extensionsRef.current[name];
    }
    
    const extension = glContextRef.current.getExtension(name);
    if (extension) {
      extensionsRef.current[name] = extension;
    }
    
    return extension;
  }, []);
  
  // Check if device is mobile (for performance adjustments)
  const isMobileDevice = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);
  
  // Adjust performance based on device capabilities
  const adjustForDevice = useCallback((quality: 'low' | 'medium' | 'high' = 'high') => {
    const isMobile = isMobileDevice();
    
    // Adjust quality based on device and preference
    let pixelRatio = window.devicePixelRatio || 1;
    let antialias = true;
    
    if (isMobile || quality === 'low') {
      pixelRatio = Math.min(pixelRatio, 1.5);
      antialias = false;
    } else if (quality === 'medium') {
      pixelRatio = Math.min(pixelRatio, 2);
    }
    
    return { pixelRatio, antialias };
  }, [isMobileDevice]);
  
  // Cleanup WebGL resources
  const cleanupWebGL = useCallback(() => {
    if (glContextRef.current) {
      // Note: WebGL context itself cannot be manually destroyed,
      // but we can clear references to extensions and reset state
      extensionsRef.current = {};
      glContextRef.current = null;
    }
  }, []);
  
  return {
    initWebGLContext,
    loadExtension,
    isMobileDevice,
    adjustForDevice,
    cleanupWebGL,
    glContext: glContextRef.current
  };
};