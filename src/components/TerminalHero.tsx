import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TerminalHero = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const terminalLines = [
    ">>> import laxmikant_nishad as ln",
    ">>> ln.role = 'AI/ML Engineer'",
    ">>> ln.location = 'Leeds, UK'", 
    ">>> ln.expertise = ['PyTorch', 'Transformers', 'Computer Vision']",
    ">>> ln.achievements = '40% accuracy improvement over baselines'",
    ">>> ln.status = 'available_for_opportunities'",
    ">>> ln.show_portfolio()"
  ];

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      const line = terminalLines[currentLine];
      if (currentIndex < line.length) {
        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + line[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setDisplayText(prev => prev + "\n");
          setCurrentIndex(0);
        }, 800);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, currentLine]);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-start p-8" aria-labelledby="hero-heading">
      <div className="w-full max-w-4xl">
        {/* Main Heading */}
        <h1 id="hero-heading" className="sr-only">
          Laxmikant Nishad - AI/ML Engineer Portfolio
        </h1>

        {/* Terminal Window */}
        <div className="terminal-panel" role="region" aria-label="Interactive portfolio terminal">
          {/* Terminal Header */}
          <header className="terminal-header">
            <div className="flex gap-2" aria-label="Terminal window controls">
              <div className="terminal-dot bg-red-500" aria-label="Close terminal"></div>
              <div className="terminal-dot bg-yellow-500" aria-label="Minimize terminal"></div>
              <div className="terminal-dot bg-green-500" aria-label="Maximize terminal"></div>
            </div>
            <div className="text-xs text-muted-foreground" aria-label="Current file">portfolio.py</div>
          </header>

          {/* Terminal Content */}
          <div className="terminal-content min-h-[400px]">
            <div className="text-muted-foreground mb-4">
              Neural Interface v2.1.0 - Data Visualization Terminal
            </div>
            <div className="text-muted-foreground mb-6">
              Initializing AI/ML Engineer profile...
            </div>
            
            <pre className="text-terminal-text whitespace-pre-wrap">
              {displayText}
              {currentLine < terminalLines.length && <span className="cursor">█</span>}
            </pre>

            {currentLine >= terminalLines.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 space-y-4"
              >
                <div className="text-primary">
                  Portfolio successfully loaded!
                </div>
                <div className="flex gap-4 flex-wrap">
                   <button
                     onClick={() => document.getElementById('projects')?.scrollIntoView()}
                     className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                     aria-label="Navigate to projects section"
                   >
                     ./projects --list
                   </button>
                   <button
                     onClick={() => document.getElementById('experience')?.scrollIntoView()}
                     className="px-4 py-2 border border-secondary text-secondary hover:bg-secondary hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
                     aria-label="Navigate to experience section"
                   >
                     ./experience --timeline
                   </button>
                   <button
                     onClick={() => document.getElementById('contact')?.scrollIntoView()}
                     className="px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                     aria-label="Navigate to contact section"
                   >
                     ./contact --info
                   </button>
                 </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Side Data Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 w-64 hidden lg:block"
        >
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs">system.json</span>
            </div>
            <div className="p-4 text-xs space-y-2">
              <div className="text-muted-foreground">// Live System Data</div>
              <div><span className="syntax-keyword">status</span>: <span className="syntax-string">"active"</span></div>
              <div><span className="syntax-keyword">location</span>: <span className="syntax-string">"Leeds, UK"</span></div>
              <div><span className="syntax-keyword">experience</span>: <span className="syntax-number">3</span> years</div>
              <div><span className="syntax-keyword">projects</span>: <span className="syntax-number">10</span>+</div>
              <div><span className="syntax-keyword">accuracy_boost</span>: <span className="syntax-number">40</span>%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TerminalHero;