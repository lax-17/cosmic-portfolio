import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Terminal, X, Maximize2, Minimize2 } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

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
        "AI/ML Engineer | Leeds, UK",
        "Specializing in Multi-modal Models, LLM Fine-tuning, Computer Vision",
        "40% accuracy improvement over published baselines"
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
        "├── Email: contact@laxmikant.dev",
        "├── LinkedIn: /in/laxmikant-nishad",
        "├── GitHub: @laxmikant-nishad",
        "├── Location: Leeds, UK",
        "└── Status: Available for opportunities",
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
    }
  };

  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    const [cmd, ...args] = trimmedCommand.split(' ');

    setIsTyping(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

    let output: string[] = [];

    if (cmd === 'clear') {
      setCommandHistory([]);
      setIsTyping(false);
      return;
    }

    if (cmd === 'echo') {
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

    setCommandHistory(prev => [...prev, newCommand]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        executeCommand(currentInput);
        setCommandHistory(prev => [...prev, {
          input: currentInput,
          output: [],
          timestamp: new Date()
        }]);
      } else {
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
      {/* Terminal Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Terminal size={20} />
      </motion.button>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed bottom-24 right-6 z-50 w-96 h-80 bg-terminal border border-terminal-border shadow-2xl ${
              isMinimized ? 'h-12' : ''
            }`}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border bg-panel">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  neural-terminal
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-muted/50 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted/50 rounded transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            {!isMinimized && (
              <div className="flex flex-col h-full">
                {/* Output Area */}
                <div
                  ref={terminalRef}
                  className="flex-1 p-3 font-mono text-sm overflow-y-auto bg-terminal"
                >
                  {/* Welcome Message */}
                  <div className="text-muted-foreground mb-2">
                    Neural Interface Terminal v2.1.0
                  </div>
                  <div className="text-muted-foreground mb-4">
                    Type 'help' for available commands.
                  </div>

                  {/* Command History */}
                  {commandHistory.map((cmd, index) => (
                    <div key={index} className="mb-2">
                      {cmd.input && (
                        <div className="flex items-center gap-2">
                          <span className="text-primary">$</span>
                          <span className="text-terminal-text">{cmd.input}</span>
                        </div>
                      )}
                      {cmd.output.map((line, lineIndex) => (
                        <div key={lineIndex} className="text-terminal-text ml-4">
                          {line}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Current Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-primary">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent outline-none text-terminal-text font-mono"
                      placeholder="Type a command..."
                      disabled={isTyping}
                    />
                    {isTyping && (
                      <motion.span
                        className="text-primary"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        ▶
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Status Bar */}
                <div className="px-3 py-1 border-t border-terminal-border bg-panel text-xs text-muted-foreground font-mono">
                  <div className="flex justify-between">
                    <span>Status: Connected</span>
                    <span>Commands: {Object.keys(availableCommands).length}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveTerminal;