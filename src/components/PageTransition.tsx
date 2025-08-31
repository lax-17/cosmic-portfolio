import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate loading time for smooth transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Ensure we start at top after route transition completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [isLoading]);

  const getRouteName = (pathname: string) => {
    switch (pathname) {
      case '/basic': return 'Basic Portfolio';
      case '/cosmic': return 'Cosmic Portfolio';
      case '/normal-bg': return 'Professional Portfolio';
      case '/about': return 'About Page';
      case '/lab': return 'Cosmic Lab';
      case '/analytics': return 'Analytics Dashboard';
      case '/contact-success': return 'Contact Success';
      default: return 'Portfolio Home';
    }
  };

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    in: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      y: -20,
      scale: 1.05
    }
  };

  const pageTransition = {
    duration: 0.4
  };

  const loadingVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          variants={loadingVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          <div className="text-center space-y-4">
            {/* Neural Loading Animation */}
            <div className="relative">
              <motion.div
                className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-2 w-12 h-12 border-2 border-secondary/20 border-t-secondary rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <motion.div
              className="text-terminal-text font-mono text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Loading {getRouteName(location.pathname)}...
            </motion.div>

            <motion.div
              className="flex justify-center space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;