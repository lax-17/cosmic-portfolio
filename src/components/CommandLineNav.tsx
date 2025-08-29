import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight, Terminal, Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const CommandLineNav = () => {
  const [currentSection, setCurrentSection] = useState("hero");
  const [command, setCommand] = useState("");
  const [showNav, setShowNav] = useState(false);

  const sections = [
    { id: "hero", command: "cd ~/", label: "Home" },
    { id: "projects", command: "cd ~/projects", label: "Projects" },
    { id: "skills", command: "cd ~/skills", label: "Skills" },
    { id: "experience", command: "cd ~/experience", label: "Experience" },
    { id: "contact", command: "cd ~/contact", label: "Contact" },
    // Direct resume action
    { id: "resume", command: "open ~/resume.pdf", label: "Resume", href: "/Updated_Resume%20AI%20ready%20A16.pdf" },
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
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const executeCommand = (cmd: string) => {
    const section = sections.find(s => s.command === cmd || s.id === cmd.replace("cd ~/", ""));
    if (!section) return;

    // Special handling for resume (open PDF)
    if (section.id === "resume" || (section as any).href) {
      const href = (section as any).href as string;
      if (href) window.open(href, "_blank");
      setCommand("");
      setShowNav(false);
      return;
    }

    const el = document.getElementById(section.id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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

  return (
    <>
      {/* Current Location Indicator */}
      <motion.div
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-xs font-mono"
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
        <span className="text-primary" aria-current="page">
          {currentSectionData?.command || "cd ~/"}
        </span>
        <span className="cursor text-primary" aria-hidden="true">█</span>
      </motion.div>

      {/* Resume quick button (top-right) */}
      <motion.a
        href="/Updated_Resume%20AI%20ready%20A16.pdf"
        download="Laxmikant_Nishad_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-xs font-mono text-primary bg-primary/10 hover:bg-primary/20 flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Download resume (PDF)"
      >
        <Download size={14} />
        Resume
      </motion.a>

      {/* Navigation Terminal */}
      <motion.div
        className={`nav-terminal ${showNav ? 'block' : 'hidden'}`}
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
            className="flex-1 bg-transparent outline-none text-terminal-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
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

        {/* Quick Commands */}
        <div id="nav-instructions" className="mt-3 text-xs text-muted-foreground" aria-label="Keyboard shortcuts">
          <div>Tab: autocomplete | Enter: execute | Esc: close</div>
        </div>
      </motion.div>

      {/* Section Quick Links */}
      <motion.nav
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
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

      {/* Remove redundant keyboard shortcut hint since we have the live terminal now */}
    </>
  );
};

export default CommandLineNav;