import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight, Terminal, Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import BackgroundModeToggle from "./BackgroundModeToggle";
import { useNavigate } from "react-router-dom";

const CommandLineNav = () => {
  const [currentSection, setCurrentSection] = useState("hero");
  const [command, setCommand] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const navigate = useNavigate();

  const sections = [
    { id: "hero", command: "cd ~/", label: "Home" },
    { id: "skills", command: "cd ~/skills", label: "Skills" },
    { id: "experience", command: "cd ~/experience", label: "Experience" },
    { id: "education", command: "cd ~/education", label: "Education" },
    { id: "projects", command: "cd ~/projects", label: "Projects & Case Studies" },
    { id: "faq", command: "cd ~/faq", label: "FAQ" },
    { id: "contact", command: "cd ~/contact", label: "Contact" },
    // Direct resume action
    { id: "resume", command: "open ~/resume.pdf", label: "Resume", href: "/Laxmikant_Resume.pdf" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section =>
        document.getElementById(section.id)
      );

      const scrollPosition = window.scrollY + 200;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentSection(sections[i].id);
          break;
        }
      }

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const executeCommand = (cmd: string) => {
    const section = sections.find(s => s.command === cmd || s.id === cmd.replace("cd ~/", ""));
    if (!section) return;

    // Special handling for links (resume, lab)
    if (section.id === "resume" || section.id === "lab" || (section as any).href) {
      const href = (section as any).href as string;
      if (href) {
        if (href.startsWith('/')) {
          // Internal path: use SPA navigation unless it's a file (pdf/html)
          const lower = href.toLowerCase();
          if (lower.endsWith('.pdf') || lower.endsWith('.html')) {
            window.open(href, "_blank", "noopener,noreferrer");
          } else {
            navigate(href);
          }
        } else {
          // External link
          window.open(href, "_blank", "noopener,noreferrer");
        }
      }
      setCommand("");
      setShowNav(false);
      return;
    }

    const el = document.getElementById(section.id);
    if (el) {
      // Scroll with offset to account for fixed navigation elements
      const offset = 80; // Adjust this value based on your fixed header height
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setCommand("");
    setShowNav(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(command);
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Auto-complete functionality
      const matches = sections.filter(s =>
        s.command.startsWith(command) || s.id.includes(command)
      );
      if (matches.length === 1) {
        setCommand(matches[0].command);
      }
    } else if (e.key === "Escape") {
      setShowNav(false);
      setCommand("");
    }
  };

  // Show nav on Ctrl+K or when scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowNav(!showNav);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNav]);

  // Remove auto-show nav when section changes to avoid redundancy
  // useEffect(() => {
  //   setShowNav(true);
  //   const timer = setTimeout(() => setShowNav(false), 2000);
  //   return () => clearTimeout(timer);
  // }, [currentSection]);

  const currentSectionData = sections.find(s => s.id === currentSection);

  // Generate breadcrumb path
  const getBreadcrumbPath = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    if (currentIndex === -1) return ["Home"];

    const path = ["Home"];
    for (let i = 1; i <= currentIndex; i++) {
      path.push(sections[i].label);
    }
    return path;
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: 'left' }}
        aria-label="Page scroll progress"
      >
        <div className="h-full bg-gradient-to-r from-primary to-secondary"></div>
      </motion.div>

      {/* Current Location Indicator - Hidden on mobile */}
      <motion.div
        className="fixed top-4 left-4 z-50 hidden md:flex items-center gap-2 text-xs font-mono"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        role="status"
        aria-live="polite"
        aria-label="Current navigation location"
      >
        <Terminal size={14} className="text-primary" aria-hidden="true" />
        <span className="text-muted-foreground">
          laxmikant@portfolio:
        </span>
        <nav aria-label="Breadcrumb" className="flex items-center">
          {getBreadcrumbPath().map((crumb, index) => (
            <span key={index} className="flex items-center">
              {index > 0 && <ChevronRight size={10} className="text-muted-foreground mx-1" aria-hidden="true" />}
              <span className={index === getBreadcrumbPath().length - 1 ? "text-primary" : "text-muted-foreground"}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
        <span className="cursor text-primary" aria-hidden="true">█</span>
      </motion.div>

      {/* Top-right controls - Mobile responsive with proper spacing */}
      <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50 flex items-center gap-1 md:gap-3 max-w-[calc(100vw-1rem)] overflow-hidden">
        <BackgroundModeToggle />
        <motion.a
          href="/Laxmikant_Resume.pdf"
          download="Laxmikant's Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 md:px-3 md:py-2 rounded-lg text-xs font-mono text-primary bg-primary/10 hover:bg-primary/20 flex items-center gap-1 md:gap-2 flex-shrink-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          aria-label="Download resume (PDF)"
        >
          <Download size={12} className="md:hidden" />
          <Download size={14} className="hidden md:block" />
          <span className="hidden sm:inline">Resume</span>
        </motion.a>
      </div>

      {/* Navigation Terminal - Mobile responsive */}
      <motion.div
        className={`fixed bottom-4 left-4 right-4 md:left-4 md:right-4 z-50 terminal-panel px-3 py-2 md:px-4 md:py-2 ${showNav ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nav-terminal-title"
        aria-describedby="nav-terminal-description"
      >
        <div className="flex items-center gap-2 mb-2">
          <ChevronRight size={14} className="text-primary" aria-hidden="true" />
          <h2 id="nav-terminal-title" className="sr-only">Navigation Terminal</h2>
          <span id="nav-terminal-description" className="text-muted-foreground text-xs">
            Navigation - Press Ctrl+K to toggle
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-primary" aria-hidden="true">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type command or section name..."
            className="flex-1 bg-transparent outline-none text-terminal-text font-mono text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            autoFocus={showNav}
            aria-label="Navigation command input"
            aria-describedby="nav-instructions"
          />
        </div>

        {/* Command Suggestions */}
        {command && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 space-y-1"
            role="listbox"
            aria-label="Command suggestions"
          >
            {sections
              .filter(s =>
                s.command.toLowerCase().includes(command.toLowerCase()) ||
                s.label.toLowerCase().includes(command.toLowerCase())
              )
              .slice(0, 3)
              .map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => executeCommand(section.command)}
                  className="block w-full text-left px-2 py-1 text-xs hover-highlight font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  whileHover={{ x: 4 }}
                  role="option"
                  aria-label={`Navigate to ${section.label} section`}
                >
                  <span className="text-secondary">{section.command}</span>
                  <span className="text-muted-foreground ml-2">// {section.label}</span>
                </motion.button>
              ))}
          </motion.div>
        )}

        {/* Quick Commands - Responsive text */}
        <div id="nav-instructions" className="mt-2 md:mt-3 text-xs text-muted-foreground" aria-label="Keyboard shortcuts">
          <div className="hidden md:block">Tab: autocomplete | Enter: execute | Esc: close</div>
          <div className="md:hidden">Enter: go | Esc: close</div>
        </div>
      </motion.div>

      {/* Section Quick Links - Hidden on mobile and tablet */}
      <motion.nav
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden xl:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        aria-label="Section quick navigation"
      >
        <div className="code-panel w-64">
          <header className="code-header">
            <span className="text-xs">navigation.json</span>
          </header>
          <div className="p-3 space-y-1" role="list" aria-label="Site sections">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => executeCommand(section.command)}
                className={`block w-full text-left text-xs font-mono p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  currentSection === section.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ x: 4 }}
                role="listitem"
                aria-current={currentSection === section.id ? 'page' : undefined}
                aria-label={`Navigate to ${section.label} section`}
              >
                <span className="syntax-string">{section.label}</span>
                {currentSection === section.id && (
                  <span className="text-primary ml-2" aria-hidden="true">←</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Floating Action Button for Contact */}
      <motion.button
        onClick={() => {
          const element = document.getElementById('contact');
          if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-background"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: scrollProgress > 10 ? 1 : 0,
          scale: scrollProgress > 10 ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        aria-label="Quick contact access"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-xl" aria-hidden="true">💬</span>
      </motion.button>

      {/* Remove redundant keyboard shortcut hint since we have the live terminal now */}
    </>
  );
};

export default CommandLineNav;