import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight, Terminal } from "lucide-react";

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
    if (section) {
      document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
      setCommand("");
      setShowNav(false);
    }
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

  // Auto-show nav briefly when section changes
  useEffect(() => {
    setShowNav(true);
    const timer = setTimeout(() => setShowNav(false), 2000);
    return () => clearTimeout(timer);
  }, [currentSection]);

  const currentSectionData = sections.find(s => s.id === currentSection);

  return (
    <>
      {/* Current Location Indicator */}
      <motion.div
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-xs font-mono"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Terminal size={14} className="text-primary" />
        <span className="text-muted-foreground">
          laxmikant@portfolio:
        </span>
        <span className="text-primary">
          {currentSectionData?.command || "cd ~/"}
        </span>
        <span className="cursor text-primary">█</span>
      </motion.div>

      {/* Navigation Terminal */}
      <motion.div
        className={`nav-terminal ${showNav ? 'block' : 'hidden'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : 20 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <ChevronRight size={14} className="text-primary" />
          <span className="text-muted-foreground text-xs">
            Navigation - Press Ctrl+K to toggle
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-primary">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type command or section name..."
            className="flex-1 bg-transparent outline-none text-terminal-text font-mono text-sm focus-terminal"
            autoFocus={showNav}
          />
        </div>

        {/* Command Suggestions */}
        {command && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 space-y-1"
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
                  className="block w-full text-left px-2 py-1 text-xs hover-highlight font-mono"
                  whileHover={{ x: 4 }}
                >
                  <span className="text-secondary">{section.command}</span>
                  <span className="text-muted-foreground ml-2">// {section.label}</span>
                </motion.button>
              ))}
          </motion.div>
        )}

        {/* Quick Commands */}
        <div className="mt-3 text-xs text-muted-foreground">
          <div>Tab: autocomplete | Enter: execute | Esc: close</div>
        </div>
      </motion.div>

      {/* Section Quick Links */}
      <motion.div
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="code-panel w-48">
          <div className="code-header">
            <span className="text-xs">navigation.json</span>
          </div>
          <div className="p-3 space-y-1">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => executeCommand(section.command)}
                className={`block w-full text-left text-xs font-mono p-1 transition-colors ${
                  currentSection === section.id 
                    ? 'text-primary bg-primary/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ x: 4 }}
              >
                <span className="syntax-string">"{section.id}"</span>: 
                <span className="syntax-string ml-1">"{section.label}"</span>
                {currentSection === section.id && (
                  <span className="text-primary ml-2">←</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Keyboard Shortcut Hint */}
      <motion.div
        className="fixed bottom-4 right-4 z-40 text-xs font-mono text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Press <span className="text-primary">Ctrl+K</span> for navigation
      </motion.div>
    </>
  );
};

export default CommandLineNav;