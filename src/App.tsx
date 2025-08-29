import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import CosmicLoader from "./components/CosmicLoader";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import { useEnhancedAnalytics } from "./hooks/useAnalytics";
import { usePerformanceMonitoring } from "./hooks/usePerformanceMonitoring";
import { useErrorTracking } from "./hooks/useErrorTracking";
import ErrorBoundary from "./components/ErrorBoundary";
import CookieConsentBanner from "./components/CookieConsentBanner";
import AnalyticsPage from "./pages/Analytics";

// Lazy load heavy components for code splitting
const TerminalHero = lazy(() => import("./components/TerminalHero"));
const ProjectRepository = lazy(() => import("./components/ProjectRepository"));
const NeuralSkillsGraph = lazy(() => import("./components/NeuralSkillsGraph"));
const GitCommitTimeline = lazy(() => import("./components/GitCommitTimeline"));
const DataContactPanel = lazy(() => import("./components/DataContactPanel"));
const CommandLineNav = lazy(() => import("./components/CommandLineNav"));
const LiveTerminal = lazy(() => import("./components/LiveTerminal"));
const CosmicShaderBackground = lazy(() => import("./components/CosmicShaderBackground"));
const KeyboardShortcuts = lazy(() => import("./components/KeyboardShortcuts"));
const PageTransition = lazy(() => import("./components/PageTransition"));
const MobileNavigation = lazy(() => import("./components/MobileNavigation"));

const queryClient = new QueryClient();

const NeuralPortfolio = () => {
  const {
    trackEnhancedScrollDepth,
    trackTimeOnPageEnhanced,
    trackEnhancedEvent
  } = useEnhancedAnalytics();

  // Track scroll depth
  useEffect(() => {
    return trackEnhancedScrollDepth();
  }, [trackEnhancedScrollDepth]);

  // Track time on page
  useEffect(() => {
    return trackTimeOnPageEnhanced();
  }, [trackTimeOnPageEnhanced]);

  // Initialize performance monitoring
  usePerformanceMonitoring();

  // Initialize error tracking
  useErrorTracking();

  // Track section views
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trackEnhancedEvent('section_view', {
            section_name: entry.target.id,
            section_title: entry.target.querySelector('h1, h2, h3')?.textContent || 'Unknown Section'
          });
        }
      });
    }, { threshold: 0.5 });

    // Observe sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, [trackEnhancedEvent]);

  // Track button clicks
  useEffect(() => {
    const handleButtonClick = (e: MouseEvent) => {
      const target = e.target as Element;
      const button = target.closest('button');
      if (button) {
        trackEnhancedEvent('click', {
          event_category: 'button',
          event_label: button.textContent || button.ariaLabel || 'unnamed_button',
          button_id: button.id || 'no_id',
          button_class: button.className || 'no_class'
        });
      }
    };

    document.addEventListener('click', handleButtonClick);

    return () => {
      document.removeEventListener('click', handleButtonClick);
    };
  }, [trackEnhancedEvent]);

  // Track hover events
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const interactiveElement = target.closest('button, a, input, textarea, select');
      if (interactiveElement) {
        trackEnhancedEvent('hover', {
          event_category: interactiveElement.tagName.toLowerCase(),
          event_label: interactiveElement.textContent || interactiveElement.ariaLabel || 'unnamed_element',
          element_id: interactiveElement.id || 'no_id',
          element_class: interactiveElement.className || 'no_class'
        });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [trackEnhancedEvent]);

  return (
  <div className="relative">
    {/* Error Boundary */}
    <ErrorBoundary>

    {/* Main Navigation */}
    <nav id="main-navigation" aria-label="Main navigation">
      <Suspense fallback={<CosmicLoader message="Loading navigation..." />}>
        <CommandLineNav />
      </Suspense>
    </nav>

    {/* Main Content */}
    <main id="main-content">
      {/* Hero Section */}
      <Suspense fallback={<CosmicLoader message="Loading terminal interface..." />}>
        <TerminalHero />
      </Suspense>

      {/* Projects Section */}
      <section id="projects" aria-labelledby="projects-heading">
        <Suspense fallback={<CosmicLoader message="Loading project repository..." />}>
          <ProjectRepository />
        </Suspense>
      </section>

      {/* Skills Section */}
      <section id="skills" aria-labelledby="skills-heading">
        <Suspense fallback={<CosmicLoader message="Loading neural network visualization..." />}>
          <NeuralSkillsGraph />
        </Suspense>
      </section>

      {/* Experience Section */}
      <section id="experience" aria-labelledby="experience-heading">
        <Suspense fallback={<CosmicLoader message="Loading career timeline..." />}>
          <GitCommitTimeline />
        </Suspense>
      </section>

      {/* Contact Section */}
      <section id="contact" aria-labelledby="contact-heading">
        <Suspense fallback={<CosmicLoader message="Loading contact panel..." />}>
          <DataContactPanel />
        </Suspense>
      </section>
    </main>

    {/* Interactive Components */}
    <Suspense fallback={<CosmicLoader message="Loading live terminal..." />}>
      <LiveTerminal />
    </Suspense>
    <Suspense fallback={<CosmicLoader message="Loading keyboard shortcuts..." />}>
      <KeyboardShortcuts />
    </Suspense>
    <Suspense fallback={<CosmicLoader message="Loading mobile navigation..." />}>
      <MobileNavigation />
    </Suspense>
  </ErrorBoundary>
  <CookieConsentBanner />
</div>
);
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Global Cosmic Background mounted OUTSIDE page transitions to cover full viewport */}
        <Suspense fallback={<div className="fixed inset-0 pointer-events-none z-0 cosmic-bg"></div>}>
          <CosmicShaderBackground />
        </Suspense>
        <BrowserRouter>
          <AnalyticsProvider>
            <Suspense fallback={<CosmicLoader message="Loading page transition..." />}>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<NeuralPortfolio />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
            </Suspense>
          </AnalyticsProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
