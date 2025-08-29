import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Keyboard, X, HelpCircle } from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  category: string;
}

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts: Shortcut[] = [
    // Navigation
    { key: "Ctrl+K", description: "Open command line navigation", category: "Navigation" },
    { key: "↑/↓", description: "Navigate through command history", category: "Terminal" },
    { key: "Tab", description: "Auto-complete commands", category: "Terminal" },
    { key: "Enter", description: "Execute command", category: "Terminal" },
    { key: "Esc", description: "Close terminal/navigation", category: "General" },

    // Portfolio Navigation
    { key: "./projects", description: "Navigate to projects section", category: "Navigation" },
    { key: "./skills", description: "Navigate to skills section", category: "Navigation" },
    { key: "./experience", description: "Navigate to experience section", category: "Navigation" },
    { key: "./contact", description: "Navigate to contact section", category: "Navigation" },

    // Terminal Commands
    { key: "help", description: "Show available commands", category: "Terminal" },
    { key: "whoami", description: "Display user information", category: "Terminal" },
    { key: "skills", description: "List technical skills", category: "Terminal" },
    { key: "projects", description: "Show project portfolio", category: "Terminal" },
    { key: "clear", description: "Clear terminal history", category: "Terminal" },
    { key: "pwd", description: "Show current directory", category: "Terminal" },
    { key: "ls", description: "List directory contents", category: "Terminal" },
    { key: "date", description: "Show current date/time", category: "Terminal" },
    { key: "ping", description: "Test connection", category: "Terminal" },

    // Special Commands
    { key: "matrix", description: "Enter the matrix simulation", category: "Fun" },
    { key: "hack", description: "Simulate hacking sequence", category: "Fun" },
    { key: "echo [text]", description: "Echo text to terminal", category: "Terminal" },
    { key: "cat [file]", description: "Display file contents", category: "Terminal" }
  ];

  const categories = [...new Set(shortcuts.map(s => s.category))];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Help Button */}
      <motion.button
        className="fixed bottom-6 left-6 z-[100] p-3 rounded-full bg-secondary text-secondary-foreground shadow-2xl hover:shadow-3xl transition-all duration-200 border-2 border-secondary-foreground/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        aria-label="Open keyboard shortcuts help"
        title="Keyboard Shortcuts (Press ? or Shift+/)"
      >
        <HelpCircle size={20} />
      </motion.button>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-panel border border-panel-border rounded-lg shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-panel-border">
                  <div className="flex items-center gap-3">
                    <Keyboard className="text-primary" size={24} />
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Keyboard Shortcuts</h2>
                      <p className="text-sm text-muted-foreground">Master the neural interface</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-muted/50 rounded transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-96 overflow-y-auto">
                  <div className="space-y-6">
                    {categories.map((category) => (
                      <div key={category}>
                        <h3 className="text-lg font-semibold text-primary mb-3 border-b border-panel-border pb-2">
                          {category}
                        </h3>
                        <div className="grid gap-2">
                          {shortcuts
                            .filter(shortcut => shortcut.category === category)
                            .map((shortcut, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center justify-between p-3 rounded border border-panel-border/50 hover:border-panel-border transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <span className="text-foreground font-mono">
                                  {shortcut.description}
                                </span>
                                <kbd className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm font-mono border border-panel-border">
                                  {shortcut.key}
                                </kbd>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-panel-border bg-muted/20">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd> or <kbd className="px-2 py-1 bg-muted rounded text-xs">Shift+/</kbd> to toggle</span>
                    <span>Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd> to close</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;