import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Home, Briefcase, Brain, GitBranch, Mail } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import BackgroundModeToggle from "./BackgroundModeToggle";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const navItems = [
    { id: "hero", label: "Home", icon: Home, command: "./" },
    { id: "projects", label: "Projects", icon: Briefcase, command: "./projects" },
    { id: "skills", label: "Skills", icon: Brain, command: "./skills" },
    { id: "experience", label: "Experience", icon: GitBranch, command: "./experience" },
    { id: "contact", label: "Contact", icon: Mail, command: "./contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show mobile nav after scrolling past hero section or immediately if no hero
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 100);
      } else {
        // If no hero section found, show nav after minimal scroll
        setIsVisible(window.scrollY > 50);
      }
    };

    // Check initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchStartY.current - touchEndY.current;

    // Check if it's a horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Right swipe - open menu
      if (deltaX < -swipeThreshold && !isOpen) {
        setIsOpen(true);
      }
      // Left swipe - close menu
      else if (deltaX > swipeThreshold && isOpen) {
        setIsOpen(false);
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    // Handle different section IDs that might exist
    let element = document.getElementById(sectionId);
    
    // Fallback mappings for different portfolio modes
    if (!element) {
      const fallbackMappings: { [key: string]: string } = {
        'hero': 'main-content',
        'projects': 'projects',
        'skills': 'skills',
        'experience': 'experience',
        'contact': 'contact'
      };
      
      const fallbackId = fallbackMappings[sectionId];
      if (fallbackId) {
        element = document.getElementById(fallbackId);
      }
    }
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    } else {
      // If no element found, just close the menu
      setIsOpen(false);
    }
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    closed: {
      x: -20,
      opacity: 0
    },
    open: {
      x: 0,
      opacity: 1
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed bottom-4 right-4 z-40 md:hidden p-3 rounded-full bg-primary text-primary-foreground shadow-lg touch-manipulation"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        role="button"
        style={{ minHeight: '48px', minWidth: '48px' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={20} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={20} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />

            {/* Menu */}
            <motion.div
              className="fixed bottom-20 right-4 z-40 md:hidden max-w-[280px] w-[calc(100vw-2rem)]"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="bg-panel border border-panel-border rounded-lg shadow-2xl p-3 min-w-[200px]">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      transition={{ delay: index * 0.1 }}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full flex items-center gap-3 p-3 rounded border border-panel-border/50 hover:border-panel-border hover:bg-muted/50 transition-all duration-200 text-left touch-manipulation"
                      aria-label={`Navigate to ${item.label} section`}
                      role="menuitem"
                      style={{ minHeight: '48px' }}
                    >
                      <item.icon size={16} className="text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{item.label}</div>
                        <div className="text-xs text-muted-foreground font-mono truncate">{item.command}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-3 pt-3 border-t border-panel-border">
                  <div className="text-xs text-muted-foreground mb-2">Quick Actions</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const terminal = document.querySelector('[data-terminal-toggle]');
                        if (terminal) (terminal as HTMLElement).click();
                        setIsOpen(false);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors touch-manipulation"
                      aria-label="Open terminal"
                      role="menuitem"
                      style={{ minHeight: '40px' }}
                    >
                      Terminal
                    </button>
                    <button
                      onClick={() => {
                        // Trigger help modal
                        const helpBtn = document.querySelector('[data-help-toggle]');
                        if (helpBtn) (helpBtn as HTMLElement).click();
                        setIsOpen(false);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-secondary/10 text-secondary rounded border border-secondary/20 hover:bg-secondary/20 transition-colors touch-manipulation"
                      aria-label="Open help"
                      role="menuitem"
                      style={{ minHeight: '40px' }}
                    >
                      Help
                    </button>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="mt-3 pt-3 border-t border-panel-border">
                  <div className="text-xs text-muted-foreground mb-2">Theme</div>
                  <div className="flex justify-center">
                    <ThemeToggle />
                  </div>
                </div>

                {/* Background Mode Toggle */}
                <div className="mt-3 pt-3 border-t border-panel-border">
                  <div className="text-xs text-muted-foreground mb-2">Background</div>
                  <div className="flex justify-center">
                    <BackgroundModeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Status Bar - Only show when needed */}
      {isVisible && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-30 md:hidden bg-panel/90 backdrop-blur-sm border-b border-panel-border"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-muted-foreground truncate">neural-interface</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MobileNavigation;