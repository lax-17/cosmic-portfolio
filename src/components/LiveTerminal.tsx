import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Terminal, X, Maximize2, Minimize2, Move, Sparkles, Zap } from "lucide-react";
import { useEnhancedAnalytics } from "@/hooks/useAnalytics";

interface Command {
  input: string;
  output: string[];
  timestamp: Date;
}

const LiveTerminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 384, height: 320 }); // w-96 = 384px, h-80 = 320px
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [matrixMode, setMatrixMode] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState<'default' | 'matrix' | 'hacker'>('default');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackTerminalCommand } = useEnhancedAnalytics();

  const availableCommands = {
    help: {
      description: "Show available commands",
      output: [
        "Available commands:",
        "  help          - Show this help message",
        "  whoami        - Display current user info",
        "  skills        - List technical skills",
        "  projects      - Show project portfolio",
        "  contact       - Display contact information",
        "  clear         - Clear terminal history",
        "  date          - Show current date/time",
        "  echo [text]   - Echo text to terminal",
        "  pwd           - Show current directory",
        "  ls            - List directory contents",
        "  cat [file]    - Display file contents",
        "  ping          - Test connection",
        "  matrix        - Enter the matrix",
        "  hack          - Simulate hacking sequence"
      ]
    },
    whoami: {
      description: "Display current user info",
      output: [
        "laxmikant@neural-interface:~$ whoami",
        "laxmikant_nishad",
        "Applied AI/ML Engineer | Leeds, UK",
        "Specializing in LLMs, Transformers, and multi-modal systems",
        "QLoRA fine-tuning • Structured JSON outputs • Docker/llama.cpp"
      ]
    },
    skills: {
      description: "List technical skills",
      output: [
        "Core Technologies:",
        "├── Machine Learning: PyTorch, Transformers, Hugging Face",
        "├── Computer Vision: OpenCV, DINOv2, Image Processing",
        "├── NLP: Llama 3, QLoRA, RAG, Text Processing",
        "├── Tools: Python, Docker, Linux, CUDA, Git",
        "└── Frameworks: React, TypeScript, Node.js",
        "",
        "Proficiency Levels:",
        "├── PyTorch: 90%",
        "├── Computer Vision: 92%",
        "├── Python: 95%",
        "└── Linux: 91%"
      ]
    },
    projects: {
      description: "Show project portfolio",
      output: [
        "Project Portfolio:",
        "├── clinical_narrative_assistant/",
        "│   ├── Fine-tuned Llama 3 with QLoRA",
        "│   ├── Processed 600+ patient profiles",
        "│   └── Medical NLP pipeline",
        "├── object_tracking_drone/",
        "│   ├── Real-time pursuit with PID control",
        "│   ├── OpenCV + GPS fusion",
        "│   └── Autonomous navigation system",
        "└── fmri_image_reconstruction/",
        "    ├── GAN-based brain imaging",
        "    ├── StyleGAN2 + U-Net architectures",
        "    └── Medical imaging reconstruction"
      ]
    },
    contact: {
      description: "Display contact information",
      output: [
        "Contact Information:",
        "├── Email: laxmikant.data@gmail.com",
        "├── Phone: +44 7470398416",
        "├── LinkedIn: /in/laxmikant-nishad",
        "├── GitHub: @lax-17",
        "├── Location: Leeds, UK",
        "└── Status: Seeking to build production-ready, trustworthy LLM systems",
        "",
        "Technical Specialties:",
        "├── Multi-modal AI systems",
        "├── Large Language Model fine-tuning",
        "├── Computer Vision applications",
        "└── Production ML pipelines"
      ]
    },
    pwd: {
      description: "Show current directory",
      output: ["/home/laxmikant/portfolio"]
    },
    ls: {
      description: "List directory contents",
      output: [
        "drwxr-xr-x  laxmikant  neural  4096  projects/",
        "drwxr-xr-x  laxmikant  neural  4096  skills/",
        "drwxr-xr-x  laxmikant  neural  4096  experience/",
        "-rw-r--r--  laxmikant  neural   256  README.md",
        "-rw-r--r--  laxmikant  neural   512  portfolio.py",
        "-rw-r--r--  laxmikant  neural   128  .bashrc"
      ]
    },
    date: {
      description: "Show current date/time",
      output: [new Date().toString()]
    },
    ping: {
      description: "Test connection",
      output: [
        "PING neural-interface.local (127.0.0.1): 56 data bytes",
        "64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms",
        "64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.039 ms",
        "64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.041 ms",
        "--- neural-interface.local ping statistics ---",
        "3 packets transmitted, 3 packets received, 0.0% packet loss",
        "round-trip min/avg/max/stddev = 0.039/0.041/0.042/0.001 ms"
      ]
    },
    matrix: {
      description: "Enter the matrix",
      output: [
        "Wake up, Neo...",
        "The Matrix has you...",
        "Follow the white rabbit.",
        "Knock, knock, Neo.",
        "",
        "💊 Red pill or blue pill?",
        "",
        "Type 'red' or 'blue' to choose your path..."
      ]
    },
    hack: {
      description: "Simulate hacking sequence",
      output: [
        "Initializing neural interface...",
        "Bypassing security protocols...",
        "Accessing mainframe...",
        "Decrypting data streams...",
        "WARNING: Unauthorized access detected!",
        "Deploying countermeasures...",
        "Connection terminated.",
        "",
        "Just kidding! This is a simulation. 😄"
      ]
    },
    theme: {
      description: "Change terminal theme",
      output: [
        "Available themes:",
        "  default - Standard neural interface",
        "  matrix  - Enter the Matrix",
        "  hacker  - Elite hacker mode",
        "",
        "Usage: theme [default|matrix|hacker]"
      ]
    },
    resize: {
      description: "Resize terminal window",
      output: [
        "Terminal is now resizable!",
        "Drag the bottom-right corner to resize",
        "Or drag the title bar to move the terminal"
      ]
    },
    fun: {
      description: "Enable fun mode",
      output: [
        "🎉 Fun mode activated!",
        "✨ Terminal is now extra sparkly!",
        "🚀 Ready for cosmic adventures!",
        "",
        "Try these fun commands:",
        "  matrix  - Enter the Matrix",
        "  hack    - Simulate hacking",
        "  theme   - Change appearance"
      ]
    }
  };

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    const [cmd, ...args] = trimmedCommand.split(' ');

    setIsTyping(true);

    // Simulate processing delay with fun animations
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    let output: string[] = [];

    if (cmd === 'clear') {
      setCommandHistory([]);
      setIsTyping(false);
      return;
    }

    // Special theme command
    if (cmd === 'theme') {
      const theme = args[0] as 'default' | 'matrix' | 'hacker';
      if (['default', 'matrix', 'hacker'].includes(theme)) {
        setTerminalTheme(theme);
        setMatrixMode(theme === 'matrix');
        output = [`Theme changed to: ${theme}`];
        if (theme === 'matrix') {
          output.push("Welcome to the Matrix... 🕶️");
        } else if (theme === 'hacker') {
          output.push("Elite hacker mode activated! 💀");
        }
      } else {
        output = availableCommands.theme.output;
      }
    } else if (cmd === 'echo') {
      output = [args.join(' ')];
    } else if (cmd === 'cat') {
      const file = args[0];
      if (file === 'README.md') {
        output = [
          "# Laxmikant Nishad - Neural Portfolio",
          "",
          "AI/ML Engineer specializing in:",
          "- Multi-modal model development",
          "- LLM fine-tuning and optimization",
          "- Computer vision applications",
          "- Production ML pipeline deployment",
          "",
          "Based in Leeds, UK | Available for opportunities"
        ];
      } else {
        output = [`cat: ${file}: No such file or directory`];
      }
    } else if (availableCommands[cmd as keyof typeof availableCommands]) {
      output = availableCommands[cmd as keyof typeof availableCommands].output;
    } else if (trimmedCommand === '') {
      output = [];
    } else {
      output = [
        `Command not found: ${cmd}`,
        `Type 'help' for available commands.`
      ];
    }

    const newCommand: Command = {
      input: command,
      output,
      timestamp: new Date()
    };

    // Track terminal command usage
    trackTerminalCommand(command);

    setCommandHistory(prev => [...prev, newCommand]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        executeCommand(currentInput);
      } else {
        // Track empty command
        trackTerminalCommand('');
        setCommandHistory(prev => [...prev, {
          input: '',
          output: [],
          timestamp: new Date()
        }]);
      }
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = commandHistory.filter(cmd => cmd.input.trim());
      if (commands.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commands.length - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commands[commands.length - 1 - newIndex].input);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const commands = commandHistory.filter(cmd => cmd.input.trim());
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commands[commands.length - 1 - newIndex].input);
      } else {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete functionality
      const commands = Object.keys(availableCommands);
      const match = commands.find(cmd => cmd.startsWith(currentInput));
      if (match) {
        setCurrentInput(match);
      }
    }
  };

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as Element).closest('.terminal-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Resize functionality
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX - size.width,
      y: e.clientY - size.height
    });
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      setSize({
        width: Math.max(300, e.clientX - dragStart.x),
        height: Math.max(200, e.clientY - dragStart.y)
      });
    }
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
  };

  // Global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
      };
    }
  }, [isResizing, dragStart]);

  // Theme styles
  const getThemeStyles = () => {
    switch (terminalTheme) {
      case 'matrix':
        return {
          background: 'bg-black',
          text: 'text-green-400',
          border: 'border-green-500',
          glow: 'shadow-green-500/50'
        };
      case 'hacker':
        return {
          background: 'bg-gray-900',
          text: 'text-red-400',
          border: 'border-red-500',
          glow: 'shadow-red-500/50'
        };
      default:
        return {
          background: 'bg-terminal',
          text: 'text-terminal-text',
          border: 'border-terminal-border',
          glow: 'cosmic-glow'
        };
    }
  };

  const themeStyles = getThemeStyles();

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory, isTyping]);

  return (
    <>
      {/* Terminal Toggle Button - Enhanced with fun animations */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background cosmic-glow"
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: isOpen ? 180 : 0
        }}
        transition={{ delay: 1 }}
        aria-label={isOpen ? "Close interactive terminal" : "Open interactive terminal"}
        aria-expanded={isOpen}
      >
        <Terminal size={20} aria-hidden="true" />
        {matrixMode && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 10px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            className="fixed z-50 select-none"
            style={{
              bottom: `${24 + position.y}px`,
              right: `${24 + position.x}px`,
              width: `${size.width}px`,
              height: isMinimized ? '48px' : `${size.height}px`
            }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terminal-title"
            aria-describedby="terminal-description"
            onMouseDown={handleMouseDown}
          >
            <div className={`w-full h-full border ${themeStyles.border} shadow-2xl ${themeStyles.glow} ${themeStyles.background} rounded-lg overflow-hidden ${isDragging ? 'cursor-move' : ''}`}>
              {/* Terminal Header - Draggable */}
              <header className={`terminal-header flex items-center justify-between px-3 py-2 border-b ${themeStyles.border} bg-panel cursor-move`}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1" aria-label="Terminal window controls">
                    <div className="w-3 h-3 rounded-full bg-red-500" aria-label="Close terminal"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500" aria-label="Minimize terminal"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500" aria-label="Maximize terminal"></div>
                  </div>
                  <Move className="w-3 h-3 text-muted-foreground" />
                  <h2 id="terminal-title" className="text-xs text-muted-foreground font-mono sr-only">
                    Neural Terminal
                  </h2>
                  <span className={`text-xs font-mono ${themeStyles.text}`} aria-hidden="true">
                    neural-terminal-{terminalTheme}
                  </span>
                  {matrixMode && <Sparkles className="w-3 h-3 text-green-400 animate-pulse" />}
                </div>
                <div className="flex items-center gap-1" role="group" aria-label="Terminal controls">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="p-1 hover:bg-muted/50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label={isMinimized ? "Maximize terminal" : "Minimize terminal"}
                  >
                    {isMinimized ? <Maximize2 size={12} aria-hidden="true" /> : <Minimize2 size={12} aria-hidden="true" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-muted/50 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    aria-label="Close terminal"
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </div>
              </header>

              {/* Terminal Content */}
              {!isMinimized && (
                <div className="h-full flex flex-col relative">
                  {/* Output Area */}
                  <div
                    ref={terminalRef}
                    className={`flex-1 p-3 font-mono text-sm overflow-y-auto ${themeStyles.background} min-h-0 ${themeStyles.text}`}
                    role="log"
                    aria-live="polite"
                    aria-label="Terminal output"
                    aria-describedby="terminal-description"
                  >
                    {/* Welcome Message */}
                    <div id="terminal-description" className={`mb-2 cosmic-text ${themeStyles.text}`}>
                      Neural Interface Terminal v2.1.0 - {terminalTheme.toUpperCase()} MODE
                      {matrixMode && " 🕶️"}
                    </div>
                    <div className={`mb-4 ${themeStyles.text}`}>
                      Type 'help' for available commands. Try 'fun' for extra features!
                    </div>

                    {/* Command History */}
                    {commandHistory.map((cmd, index) => (
                      <div key={index} className="mb-2">
                        {cmd.input && (
                          <div className="flex items-center gap-2">
                            <span className={`cosmic-text ${terminalTheme === 'matrix' ? 'text-green-400' : terminalTheme === 'hacker' ? 'text-red-400' : 'text-primary'}`}>$</span>
                            <span className={themeStyles.text}>{cmd.input}</span>
                          </div>
                        )}
                        {cmd.output.map((line, lineIndex) => (
                          <motion.div
                            key={lineIndex}
                            className={`${themeStyles.text} ml-4`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: lineIndex * 0.05 }}
                          >
                            {line}
                          </motion.div>
                        ))}
                      </div>
                    ))}

                    {/* Current Input */}
                    <div className="flex items-center gap-2" role="group" aria-label="Terminal command input">
                      <span className={`cosmic-text ${terminalTheme === 'matrix' ? 'text-green-400' : terminalTheme === 'hacker' ? 'text-red-400' : 'text-primary'}`} aria-hidden="true">$</span>
                      <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`flex-1 bg-transparent outline-none ${themeStyles.text} font-mono focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background`}
                        placeholder="Type a command..."
                        disabled={isTyping}
                        aria-label="Terminal command input"
                        aria-describedby="terminal-instructions"
                      />
                      {isTyping && (
                        <motion.span
                          className={`cosmic-glow ${terminalTheme === 'matrix' ? 'text-green-400' : terminalTheme === 'hacker' ? 'text-red-400' : 'text-primary'}`}
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                          aria-label="Processing command"
                        >
                          {matrixMode ? '█' : '▶'}
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Resize Handle */}
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-muted/50 hover:bg-muted transition-colors"
                    onMouseDown={handleResizeMouseDown}
                    title="Drag to resize"
                  >
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground"></div>
                  </div>

                  {/* Status Bar */}
                  <div className={`px-3 py-1 border-t ${themeStyles.border} bg-panel text-xs text-muted-foreground font-mono`} role="status" aria-live="polite" aria-label="Terminal status">
                    <div className="flex justify-between items-center">
                      <span>Status: Connected {matrixMode && '🔴'}</span>
                      <div className="flex items-center gap-2">
                        <span>Commands: {Object.keys(availableCommands).length}</span>
                        {terminalTheme !== 'default' && <Zap className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveTerminal;