import { Suspense, lazy, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "./pages/NotFound";
import CosmicLoader from "./components/CosmicLoader";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PortfolioModeProvider, usePortfolioMode } from "./contexts/BackgroundModeContext";
import { AnalyticsProvider } from "./contexts/AnalyticsContext";
import { useEnhancedAnalytics } from "./hooks/useAnalytics";
import { usePerformanceMonitoring } from "./hooks/usePerformanceMonitoring";
import { useErrorTracking } from "./hooks/useErrorTracking";
import ErrorBoundary from "./components/ErrorBoundary";
import CookieConsentBanner from "./components/CookieConsentBanner";
import CosmicLab from "./pages/CosmicLab";
import ContactSuccess from "./pages/ContactSuccess";
import About from "./pages/About";
import CosmicSoundEffects from "./components/CosmicSoundEffects";
import Footer from "./components/Footer";

// Mode Indicator Component
const ModeIndicator = () => {
  const { portfolioMode } = usePortfolioMode();

  const getModeInfo = (mode: string) => {
    switch (mode) {
      case 'basic':
        return { label: 'Basic', color: 'bg-blue-500', icon: '📄' };
      case 'cosmic':
        return { label: 'Cosmic', color: 'bg-purple-500', icon: '🌌' };
      case 'professional':
        return { label: 'Professional', color: 'bg-green-500', icon: '💼' };
      default:
        return { label: 'Default', color: 'bg-gray-500', icon: '🎯' };
    }
  };

  const modeInfo = getModeInfo(portfolioMode);

  return (
    <div className="fixed top-20 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-panel/80 backdrop-blur-sm border border-panel-border shadow-lg">
      <span className="text-sm">{modeInfo.icon}</span>
      <span className="text-sm font-medium text-foreground">{modeInfo.label}</span>
      <div className={`w-2 h-2 rounded-full ${modeInfo.color} animate-pulse`}></div>
    </div>
  );
};

// Social Share Component
const SocialShare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const currentUrl = window.location.origin + location.pathname;
  const shareText = `Check out this amazing ${location.pathname.slice(1) || 'cosmic'} portfolio by Laxmikant Nishad! 🚀`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed top-32 right-4 z-40">
      <motion.button
        className="p-3 rounded-full bg-panel/80 backdrop-blur-sm border border-panel-border shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Share portfolio"
        aria-expanded={isOpen}
        aria-controls="share-menu"
      >
        <Share2 size={18} className="text-primary" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-12 right-0 mt-2 p-4 bg-panel/95 backdrop-blur-sm border border-panel-border rounded-lg shadow-xl min-w-48"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            role="menu"
            id="share-menu"
          >
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Share Portfolio</h4>

              <div className="flex gap-2">
                <motion.a
                  href={shareLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Share on Twitter"
                  role="menuitem"
                >
                  <Twitter size={16} className="text-blue-500" />
                </motion.a>

                <motion.a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Share on Facebook"
                  role="menuitem"
                >
                  <Facebook size={16} className="text-blue-600" />
                </motion.a>

                <motion.a
                  href={shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Share on LinkedIn"
                  role="menuitem"
                >
                  <Linkedin size={16} className="text-blue-700" />
                </motion.a>

                <motion.button
                  onClick={copyToClipboard}
                  className="p-2 rounded hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Copy link"
                  role="menuitem"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-muted-foreground" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Lazy load heavy components for code splitting
const TerminalHero = lazy(() => import("./components/TerminalHero"));
const ProjectRepository = lazy(() => import("./components/ProjectRepository"));
const NeuralSkillsGraph = lazy(() => import("./components/NeuralSkillsGraph"));
const GitCommitTimeline = lazy(() => import("./components/GitCommitTimeline"));
const DataContactPanel = lazy(() => import("./components/DataContactPanel"));
const CommandLineNav = lazy(() => import("./components/CommandLineNav"));
const LiveTerminal = lazy(() => import("./components/LiveTerminal"));
const BackgroundRenderer = lazy(() => import("./components/BackgroundRenderer"));
const BasicPortfolio = lazy(() => import("./components/BasicPortfolio"));
const KeyboardShortcuts = lazy(() => import("./components/KeyboardShortcuts"));
const PageTransition = lazy(() => import("./components/PageTransition"));
const MobileNavigation = lazy(() => import("./components/MobileNavigation"));
const EducationSection = lazy(() => import("./components/EducationSection"));
const CaseStudiesSection = lazy(() => import("./components/CaseStudiesSection"));
// const BlogSection = lazy(() => import("./components/BlogSection"));
// const TestimonialsSection = lazy(() => import("./components/TestimonialsSection"));
const FAQSection = lazy(() => import("./components/FAQSection"));

const queryClient = new QueryClient();

const AchievementsSection = lazy(() => import("./components/AchievementsSection"));

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

  // Track hover events (throttled)
  useEffect(() => {
    let last = 0;
    const THROTTLE_MS = 200;

    const handleMouseOver = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last < THROTTLE_MS) return;
      last = now;

      const target = e.target as Element;
      const interactiveElement = target.closest('button, a, input, textarea, select');
      if (interactiveElement) {
        trackEnhancedEvent('hover', {
          event_category: interactiveElement.tagName.toLowerCase(),
          event_label: interactiveElement.textContent || (interactiveElement as HTMLElement).ariaLabel || 'unnamed_element',
          element_id: (interactiveElement as HTMLElement).id || 'no_id',
          element_class: (interactiveElement as HTMLElement).className || 'no_class'
        });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [trackEnhancedEvent]);

  return (
  <div className="relative z-10">
    {/* Error Boundary */}
    <ErrorBoundary>

    {/* Main Navigation */}
    <nav id="main-navigation" aria-label="Main navigation">
      <Suspense fallback={<CosmicLoader message="Loading navigation..." />}>
        <CommandLineNav />
      </Suspense>
    </nav>

    {/* Main Content */}
    <main id="main-content" className="mobile-bottom-safe-pad">
      {/* Hero Section */}
      <Suspense fallback={<CosmicLoader message="Loading terminal interface..." />}>
        <TerminalHero />
      </Suspense>

      {/* Skills Section - Technical expertise first */}
      <section id="skills" aria-labelledby="skills-heading">
        <Suspense fallback={<CosmicLoader message="Loading neural network visualization..." />}>
          <NeuralSkillsGraph />
        </Suspense>
      </section>

      {/* Experience Section - Professional career */}
      <section id="experience" aria-labelledby="experience-heading">
        <Suspense fallback={<CosmicLoader message="Loading career timeline..." />}>
          <GitCommitTimeline />
        </Suspense>
      </section>

      {/* Education Section - Academic background */}
      <section id="education" aria-labelledby="education-heading">
        <Suspense fallback={<CosmicLoader message="Loading education & certifications..." />}>
          <EducationSection />
        </Suspense>
      </section>

      {/* Projects & Case Studies Section - Combined comprehensive showcase */}
      <section id="projects" aria-labelledby="projects-heading">
        <Suspense fallback={<CosmicLoader message="Loading projects & case studies..." />}>
          <CaseStudiesSection />
        </Suspense>
      </section>

      {/* Achievements Section */}
      <section id="achievements" aria-labelledby="achievements-heading">
        <Suspense fallback={<CosmicLoader message="Loading achievements..." />}>
          <AchievementsSection />
        </Suspense>
      </section>

      {/* Blog Section - Hidden */}
      {/* <section id="blog" aria-labelledby="blog-heading">
        <Suspense fallback={<CosmicLoader message="Loading articles & insights..." />}>
          <BlogSection />
        </Suspense>
      </section> */}

      {/* Testimonials Section - Hidden */}
      {/* <section id="testimonials" aria-labelledby="testimonials-heading">
        <Suspense fallback={<CosmicLoader message="Loading testimonials..." />}>
          <TestimonialsSection />
        </Suspense>
      </section> */}

      {/* FAQ Section */}
      <section id="faq" aria-labelledby="faq-heading">
        <Suspense fallback={<CosmicLoader message="Loading FAQ..." />}>
          <FAQSection />
        </Suspense>
      </section>

      {/* Contact Section */}
      <section id="contact" aria-labelledby="contact-heading">
        <Suspense fallback={<CosmicLoader message="Loading contact panel..." />}>
          <DataContactPanel />
        </Suspense>
      </section>
    </main>

    {/* Footer */}
    <Footer />

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

// Basic Portfolio Component
const BasicPortfolioWrapper = () => {
  return (
    <div className="relative z-10">
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center"><div className="text-xl">Loading...</div></div>}>
          <BasicPortfolio />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

// Page Meta Component for SEO
const PageMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const getMetaData = (pathname: string) => {
      switch (pathname) {
        case '/basic':
          return {
            title: 'Laxmikant Nishad - Basic Portfolio',
            description: 'Clean and simple portfolio showcasing my skills and projects in web development.'
          };
        case '/cosmic':
          return {
            title: 'Laxmikant Nishad - Cosmic Portfolio',
            description: 'Immersive cosmic-themed portfolio featuring interactive visualizations and advanced UI effects.'
          };
        case '/professional':
          return {
            title: 'Laxmikant Nishad - Professional Portfolio',
            description: 'Professional portfolio with clean design showcasing my expertise in AI engineering.'
          };
        case '/about':
          return {
            title: 'About - Laxmikant Nishad',
            description: 'Learn more about Laxmikant Nishad, a passionate AI engineer and technology enthusiast.'
          };
        case '/lab':
          return {
            title: 'Cosmic Lab - Interactive Experiments',
            description: 'Explore interactive coding experiments and technological demonstrations.'
          };
        default:
          return {
            title: 'Laxmikant Nishad - AI Engineer',
            description: 'Portfolio of Laxmikant Nishad, showcasing expertise in React, Node.js, and modern web technologies.'
          };
      }
    };

    const meta = getMetaData(location.pathname);
    document.title = meta.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', meta.description);
    }

    // Update Open Graph tags for social sharing
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');

    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    if (ogDescription) ogDescription.setAttribute('content', meta.description);
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + location.pathname);

    // Robots meta (noindex unfinished routes)
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    robots.setAttribute('content', location.pathname === '/analytics' ? 'noindex, nofollow' : 'index, follow');

  }, [location.pathname]);

  return null;
};

// Route Components for different modes
const BasicRoute = () => {
  const { setPortfolioMode } = usePortfolioMode();

  useEffect(() => {
    setPortfolioMode('basic');
  }, [setPortfolioMode]);

  return <BasicPortfolioWrapper />;
};

const CosmicRoute = () => {
  const { setPortfolioMode } = usePortfolioMode();

  useEffect(() => {
    setPortfolioMode('cosmic');
  }, [setPortfolioMode]);

  return <NeuralPortfolio />;
};

const NormalBgRoute = () => {
  const { setPortfolioMode } = usePortfolioMode();

  useEffect(() => {
    setPortfolioMode('professional');
  }, [setPortfolioMode]);

  return <NeuralPortfolio />;
};

const PortfolioRenderer = () => {
  const { portfolioMode } = usePortfolioMode();

  switch (portfolioMode) {
    case 'basic':
      return <BasicPortfolioWrapper />;
    case 'cosmic':
    case 'professional':
    default:
      return <NeuralPortfolio />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <PortfolioModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* Global Background mounted OUTSIDE page transitions to cover full viewport */}
          <Suspense fallback={<div className="fixed inset-0 pointer-events-none z-0 cosmic-bg"></div>}>
            <BackgroundRenderer />
          </Suspense>
          <BrowserRouter>
            <PageMeta />
            <AnalyticsProvider>
              <Suspense fallback={<CosmicLoader message="Loading page transition..." />}>
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<PortfolioRenderer />} />
                    <Route path="/basic" element={<BasicRoute />} />
                    <Route path="/cosmic" element={<CosmicRoute />} />
                    <Route path="/professional" element={<NormalBgRoute />} />
                    {/* <Route path="/analytics" element={<AnalyticsPage />} /> */}
                    <Route path="/lab" element={<CosmicLab />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact-success" element={<ContactSuccess />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </Suspense>
            </AnalyticsProvider>
            
            {/* Global Components */}
            <ModeIndicator />
            <SocialShare />
            {/* <VoiceCommandNavigation /> */}
            <CosmicSoundEffects />
          </BrowserRouter>
        </TooltipProvider>
      </PortfolioModeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
