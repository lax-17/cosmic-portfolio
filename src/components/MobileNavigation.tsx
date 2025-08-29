import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, Home, Briefcase, Brain, GitBranch, Mail } from "lucide-react";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const navItems = [
    { id: "hero", label: "Home", icon: Home, command: "./" },
    { id: "projects", label: "Projects", icon: Briefcase, command: "./projects" },
    { id: "skills", label: "Skills", icon: Brain, command: "./skills" },
    { id: "experience", label: "Experience", icon: GitBranch, command: "./experience" },
    { id: "contact", label: "Contact", icon: Mail, command: "./contact" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Show mobile nav after scrolling past hero section
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsVisible(window.scrollY > heroBottom - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
        className="fixed bottom-6 right-6 z-40 md:hidden p-4 rounded-full bg-primary text-primary-foreground shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
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
            />

            {/* Menu */}
            <motion.div
              className="fixed bottom-24 right-6 z-40 md:hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="bg-panel border border-panel-border rounded-lg shadow-2xl p-4 min-w-[200px]">
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
                      className="w-full flex items-center gap-3 p-3 rounded border border-panel-border/50 hover:border-panel-border hover:bg-muted/50 transition-all duration-200 text-left"
                    >
                      <item.icon size={18} className="text-primary" />
                      <div>
                        <div className="text-foreground font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground font-mono">{item.command}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-panel-border">
                  <div className="text-xs text-muted-foreground mb-2">Quick Actions</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const terminal = document.querySelector('[data-terminal-toggle]');
                        if (terminal) (terminal as HTMLElement).click();
                        setIsOpen(false);
                      }}
                      className="flex-1 px-3 py-2 text-xs bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors"
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
                      className="flex-1 px-3 py-2 text-xs bg-secondary/10 text-secondary rounded border border-secondary/20 hover:bg-secondary/20 transition-colors"
                    >
                      Help
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Status Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-30 md:hidden bg-panel/80 backdrop-blur-sm border-b border-panel-border"
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-muted-foreground">neural-interface</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileNavigation;