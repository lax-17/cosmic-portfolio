import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [terminalState, setTerminalState] = useState({
    position: { x: 0, y: 0 },
    size: { width: 520, height: 520 } // default larger size for better readability/proportions
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();
  const [matrixMode, setMatrixMode] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState<'default' | 'matrix' | 'hacker'>('default');
  const [gameNumber, setGameNumber] = useState<number | null>(null);
  const [gameAttempts, setGameAttempts] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSizeRef = useRef(terminalState.size);
  const currentPositionRef = useRef(terminalState.position);
  // Auto-scroll state: true = stick to bottom, false = preserve scroll position
  const autoScrollRef = useRef(true);
  const { trackTerminalCommand } = useEnhancedAnalytics();

  const availableCommands = {
    help: {
      description: "Show available commands",
      output: [
        "🚀 Available commands:",
        "",
        "📋 Portfolio Commands:",
        "  help          - Show this help message",
        "  whoami        - Display current user info",
        "  skills        - List technical skills",
        "  projects      - Show project portfolio",
        "  contact       - Display contact information",
        "",
        "🛠️  Utility Commands:",
        "  clear         - Clear terminal history",
        "  date          - Show current date/time",
        "  echo [text]   - Echo text to terminal",
        "  pwd           - Show current directory",
        "  ls            - List directory contents",
        "  cat [file]    - Display file contents",
        "  ping          - Test connection",
        "",
        "🎉 Fun Commands:",
        "  matrix        - Enter the Matrix",
        "  hack          - Simulate hacking sequence",
        "  joke          - Tell a random joke",
        "  fortune       - Get a fortune cookie message",
        "  8ball         - Ask the magic 8-ball",
        "  quote         - Get an inspirational quote",
        "  ascii         - Show ASCII art",
        "  game          - Play number guessing game",
        "  guess [num]   - Make a guess in the game",
        "",
        "🎨 Customization:",
        "  theme         - Change terminal theme",
        "  fun           - Enable fun mode",
        "",
        "⌨️  Keyboard Shortcuts:",
        "  ↑/↓           - Navigate command history",
        "  Tab           - Auto-complete commands",
        "  Ctrl+L        - Clear terminal",
        "  Esc           - Close suggestions",
        "",
        "Type any command to get started! ✨"
      ]
    },
    whoami: {
      description: "Display current user info",
      output: [
        "🤖 laxmikant@neural-interface:~$ whoami",
        "👨‍💻 laxmikant_nishad",
        "🎯 Applied AI/ML Engineer | Leeds, UK",
        "🧠 Specializing in LLMs, Transformers, and multi-modal systems",
        "⚡ QLoRA fine-tuning • Structured JSON outputs • Docker/llama.cpp",
        "",
        "🌟 Passionate about building trustworthy AI systems that make a difference!",
        "🚀 Always learning, always innovating, always coding!"
      ]
    },
    skills: {
      description: "List technical skills",
      output: [
        "🚀 Core Technologies:",
        "├── 🤖 Machine Learning: PyTorch, Transformers, Hugging Face",
        "├── 👁️  Computer Vision: OpenCV, DINOv2, Image Processing",
        "├── 💬 NLP: Llama 3, QLoRA, RAG, Text Processing",
        "├── 🛠️  Tools: Python, Docker, Linux, CUDA, Git",
        "└── ⚛️  Frameworks: React, TypeScript, Node.js",
        "",
        "📊 Proficiency Levels:",
        "├── 🔥 PyTorch: 90% (Expert Level)",
        "├── 🎯 Computer Vision: 92% (Master Level)",
        "├── 🐍 Python: 95% (Guru Level)",
        "└── 🐧 Linux: 91% (Advanced Level)",
        "",
        "💡 Specialties: Multi-modal AI, LLM Fine-tuning, Production ML Pipelines"
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
        "  joke    - Tell a random joke",
        "  fortune - Get a fortune cookie",
        "  8ball   - Ask the magic 8-ball",
        "  quote   - Get an inspirational quote",
        "  ascii   - Show ASCII art",
        "  game    - Play a guessing game",
        "  theme   - Change appearance"
      ]
    },
    joke: {
      description: "Tell a random joke",
      output: (() => {
        const jokes = [
          "Why did the computer go to therapy? It had too many bytes of emotional baggage! 🤖",
          "Why did the programmer quit his job? Because he didn't get arrays! 💻",
          "What do you call a computer that sings? A Dell! 🎵",
          "Why was the JavaScript developer sad? Because he didn't know how to 'null' his feelings! 😢",
          "Why did the AI go to school? To improve its learning algorithm! 🧠",
          "What did the ocean say to the beach? Nothing, it just waved! 🌊"
        ];
        return [jokes[Math.floor(Math.random() * jokes.length)]];
      })()
    },
    fortune: {
      description: "Get a fortune cookie message",
      output: (() => {
        const fortunes = [
          "🎭 You will discover a hidden talent for programming poetry.",
          "🌟 A cosmic opportunity will present itself in your next project.",
          "💡 Your innovative ideas will light up the digital world.",
          "🚀 Prepare for liftoff - your career is about to reach new heights!",
          "🎯 Your precision in code will lead to perfect execution in life.",
          "🔮 The matrix has chosen you for greatness.",
          "⚡ Your neural networks will fire with brilliant insights.",
          "🌈 Debug your doubts and compile your dreams."
        ];
        return ["🍪 " + fortunes[Math.floor(Math.random() * fortunes.length)]];
      })()
    },
    "8ball": {
      description: "Ask the magic 8-ball a question",
      output: (() => {
        const answers = [
          "🎱 It is certain",
          "🎱 It is decidedly so",
          "🎱 Without a doubt",
          "🎱 Yes definitely",
          "🎱 You may rely on it",
          "🎱 As I see it, yes",
          "🎱 Most likely",
          "🎱 Outlook good",
          "🎱 Yes",
          "🎱 Signs point to yes",
          "🎱 Reply hazy, try again",
          "🎱 Ask again later",
          "🎱 Better not tell you now",
          "🎱 Cannot predict now",
          "🎱 Concentrate and ask again",
          "🎱 Don't count on it",
          "🎱 My reply is no",
          "🎱 My sources say no",
          "🎱 Outlook not so good",
          "🎱 Very doubtful"
        ];
        return [answers[Math.floor(Math.random() * answers.length)]];
      })()
    },
    quote: {
      description: "Get an inspirational quote",
      output: (() => {
        const quotes = [
          "\"The best way to predict the future is to create it.\" - Peter Drucker",
          "\"Code is poetry written in logic.\" - Unknown",
          "\"Innovation distinguishes between a leader and a follower.\" - Steve Jobs",
          "\"The only way to do great work is to love what you do.\" - Steve Jobs",
          "\"Your most unhappy customers are your greatest source of learning.\" - Bill Gates",
          "\"The future belongs to those who believe in the beauty of their dreams.\" - Eleanor Roosevelt"
        ];
        return [quotes[Math.floor(Math.random() * quotes.length)]];
      })()
    },
    ascii: {
      description: "Show ASCII art",
      output: (() => {
        const arts = [
          [
            "     .-\"\"\"\"\"-.",
            "    /        \\",
            "   |  Neural  |",
            "    \\  Net   /",
            "     '-....-'"
          ],
          [
            "   _______",
            "  /       \\",
            " |  CODE   |",
            "  \\_______/",
            "     | |",
            "     | |",
            "     | |"
          ],
          [
            "    .-~~~-.",
            "   /       \\",
            "  |  AI     |",
            "   \\       /",
            "    `-...-'"
          ]
        ];
        return arts[Math.floor(Math.random() * arts.length)];
      })()
    },
    game: {
      description: "Play a number guessing game",
      output: [
        "🎮 Welcome to the Number Guessing Game!",
        "I'm thinking of a number between 1 and 100.",
        "Type 'guess [number]' to make a guess!",
        "Type 'game' again to start over.",
        "",
        "Good luck! 🍀"
      ]
    }
  };

  // Generate command suggestions
  const generateSuggestions = useCallback((input: string) => {
    if (!input.trim()) return [];

    const commands = Object.keys(availableCommands);
    return commands.filter(cmd =>
      cmd.toLowerCase().startsWith(input.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
  }, [availableCommands]);

  const executeCommand = useCallback(async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    const [cmd, ...args] = trimmedCommand.split(' ');

    setIsTyping(true);

    // Faster processing with minimal delay for better UX
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 150));

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
    } else if (cmd === 'guess') {
      const guess = parseInt(args[0]);
      if (gameNumber === null) {
        output = ["🎮 No game in progress! Type 'game' to start a new game."];
      } else if (isNaN(guess) || guess < 1 || guess > 100) {
        output = ["🎯 Please guess a number between 1 and 100!"];
      } else if (guess === gameNumber) {
        output = [
          `🎉 Congratulations! You guessed ${gameNumber} correctly!`,
          `📊 It took you ${gameAttempts + 1} attempts.`,
          "🏆 You're a mind reader!",
          "",
          "Type 'game' to play again!"
        ];
        setGameNumber(null);
        setGameAttempts(0);
      } else {
        const hint = guess < gameNumber ? "📈 Too low!" : "📉 Too high!";
        setGameAttempts(prev => prev + 1);
        output = [
          `${hint} Try again!`,
          `Attempts: ${gameAttempts + 1}`
        ];
      }
    } else if (cmd === 'game') {
      const newNumber = Math.floor(Math.random() * 100) + 1;
      setGameNumber(newNumber);
      setGameAttempts(0);
      output = [
        "🎮 New game started!",
        "I'm thinking of a number between 1 and 100.",
        "Type 'guess [number]' to make a guess!",
        "",
        "Good luck! 🍀"
      ];
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
        `❌ Command not found: '${cmd}'`,
        `💡 Type 'help' to see all available commands`,
        `🔍 Try these similar commands:`,
        ...Object.keys(availableCommands).filter(c => c.includes(cmd) || cmd.includes(c)).slice(0, 3).map(c => `   • ${c}`)
      ];
    }

    const newCommand: Command = {
      input: command,
      output,
      timestamp: new Date()
    };

    // Track terminal command usage
    trackTerminalCommand(command);

    setCommandHistory(prev => {
      const newHistory = [...prev, newCommand];
      // Limit history to last 50 commands for performance
      return newHistory.length > 50 ? newHistory.slice(-50) : newHistory;
    });
    setIsTyping(false);
  }, [availableCommands, trackTerminalCommand]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentInput(value);

    if (value.trim()) {
      const newSuggestions = generateSuggestions(value);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
      setSelectedSuggestion(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [generateSuggestions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(prev =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        return;
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        if (selectedSuggestion >= 0) {
          e.preventDefault();
          setCurrentInput(suggestions[selectedSuggestion]);
          setShowSuggestions(false);
          setSelectedSuggestion(-1);
          return;
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        return;
      }
    }

    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        executeCommand(currentInput);
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      } else {
        // Track empty command
        trackTerminalCommand('');
        setCommandHistory(prev => {
          const newHistory = [...prev, {
            input: '',
            output: [],
            timestamp: new Date()
          }];
          return newHistory.length > 50 ? newHistory.slice(-50) : newHistory;
        });
      }
      setCurrentInput('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp' && !showSuggestions) {
      e.preventDefault();
      const commands = commandHistory.filter(cmd => cmd.input.trim());
      if (commands.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commands.length - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commands[commands.length - 1 - newIndex].input);
      }
    } else if (e.key === 'ArrowDown' && !showSuggestions) {
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
    } else if (e.key === 'Tab' && !showSuggestions) {
      e.preventDefault();
      // Auto-complete functionality
      const commands = Object.keys(availableCommands);
      const match = commands.find(cmd => cmd.startsWith(currentInput));
      if (match) {
        setCurrentInput(match);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      // Ctrl+L to clear terminal
      setCommandHistory([]);
      setCurrentInput('');
      setHistoryIndex(-1);
      setShowSuggestions(false);
    }
  }, [currentInput, commandHistory, historyIndex, executeCommand, trackTerminalCommand, showSuggestions, suggestions, selectedSuggestion]);

  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only allow dragging from the header area, not from buttons or resize grips
    const target = e.target as Element;
    if (target.closest('button') || target.closest('.resize-grip')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    // Get the current terminal position relative to viewport
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && containerRef.current) {
      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Schedule update for next animation frame
      animationFrameRef.current = requestAnimationFrame(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate new position based on cursor and initial grab offset
        const newLeft = e.clientX - dragOffsetRef.current.x;
        const newTop = e.clientY - dragOffsetRef.current.y;

        // Constrain to viewport with 40px bottom margin for better spacing
        const constrainedLeft = Math.max(24, Math.min(viewportWidth - currentSizeRef.current.width - 24, newLeft));
        const constrainedTop = Math.max(
          24,
          Math.min(viewportHeight - (isMinimized ? 48 : currentSizeRef.current.height) - 40, newTop)
        );

        // Update DOM directly for smooth performance
        if (containerRef.current) {
          containerRef.current.style.transform = `translate(${constrainedLeft - currentPositionRef.current.x}px, ${constrainedTop - currentPositionRef.current.y}px)`;
        }
      });
    }
  }, [isDragging, isMinimized]);

  const handleMouseUp = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Sync the actual position from transform back to state
    if (containerRef.current && isDragging) {
      const transform = containerRef.current.style.transform;
      if (transform) {
        const match = transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
        if (match) {
          const translateX = parseFloat(match[1]);
          const translateY = parseFloat(match[2]);
          const actualX = currentPositionRef.current.x + translateX;
          const actualY = currentPositionRef.current.y + translateY;

          // Update refs and state
          currentPositionRef.current = { x: actualX, y: actualY };
          setTerminalState(prev => ({
            ...prev,
            position: { x: actualX, y: actualY }
          }));

          // Reset transform
          containerRef.current.style.transform = '';
        }
      }
    }

    setIsDragging(false);
  }, [isDragging]);

  // Resize functionality
  const handleResizeMouseDown = useCallback((direction: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  }, []);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing && resizeDirection && containerRef.current) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newWidth = currentSizeRef.current.width;
      let newHeight = currentSizeRef.current.height;
      let newX = currentPositionRef.current.x;
      let newY = currentPositionRef.current.y;

      switch (resizeDirection) {
        case 'bottom-right':
          newWidth = Math.max(300, Math.min(1200, currentSizeRef.current.width + deltaX));
          newHeight = Math.max(200, Math.min(800, currentSizeRef.current.height + deltaY));
          break;
        case 'bottom-left':
          newWidth = Math.max(300, Math.min(1200, currentSizeRef.current.width - deltaX));
          newHeight = Math.max(200, Math.min(800, currentSizeRef.current.height + deltaY));
          newX = Math.max(24, Math.min(viewportWidth - newWidth - 24, currentPositionRef.current.x + deltaX));
          break;
        case 'top-right':
          newWidth = Math.max(300, Math.min(1200, currentSizeRef.current.width + deltaX));
          newHeight = Math.max(200, Math.min(800, currentSizeRef.current.height - deltaY));
          newY = Math.max(24, Math.min(viewportHeight - newHeight - 24, currentPositionRef.current.y + deltaY));
          break;
        case 'top-left':
          newWidth = Math.max(300, Math.min(1200, currentSizeRef.current.width - deltaX));
          newHeight = Math.max(200, Math.min(800, currentSizeRef.current.height - deltaY));
          newX = Math.max(24, Math.min(viewportWidth - newWidth - 24, currentPositionRef.current.x + deltaX));
          newY = Math.max(24, Math.min(viewportHeight - newHeight - 24, currentPositionRef.current.y + deltaY));
          break;
      }

      // Update DOM directly for smooth performance
      containerRef.current.style.width = `${newWidth}px`;
      containerRef.current.style.height = `${newHeight}px`;
      containerRef.current.style.left = `${newX}px`;
      containerRef.current.style.top = `${newY}px`;

      // Update refs
      currentSizeRef.current = { width: newWidth, height: newHeight };
      currentPositionRef.current = { x: newX, y: newY };

      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
    }
  }, [isResizing, resizeDirection, dragStart.x, dragStart.y]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
    // Sync state with refs
    setTerminalState({
      position: currentPositionRef.current,
      size: currentSizeRef.current
    });
  }, []);

  // Global mouse event listeners with proper cleanup
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'move';

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isResizing) {
      const cursorMap = {
        'bottom-right': 'se-resize',
        'bottom-left': 'sw-resize',
        'top-right': 'ne-resize',
        'top-left': 'nw-resize'
      };
      document.addEventListener('mousemove', handleResizeMouseMove, { passive: false });
      document.addEventListener('mouseup', handleResizeMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = cursorMap[resizeDirection!] || 'se-resize';

      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleResizeMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isResizing, handleResizeMouseMove]);

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

  // Initialize position to center on mount and keep within bounds on resize
  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setTerminalState(prev => ({
      ...prev,
      position: {
        x: Math.max(24, Math.round((vw - prev.size.width) / 2)),
        y: Math.max(24, Math.round((vh - (isMinimized ? 48 : prev.size.height) - 40) / 2))
      }
    }));

    const onResize = () => {
      const vw2 = window.innerWidth;
      const vh2 = window.innerHeight;
      setTerminalState(prev => ({
        ...prev,
        position: {
          x: Math.max(24, Math.min(vw2 - prev.size.width - 24, prev.position.x)),
          y: Math.max(24, Math.min(vh2 - (isMinimized ? 48 : prev.size.height) - 24, prev.position.y))
        }
      }));
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // Intentionally not depending on size/isMinimized to avoid jumping during user interaction
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      // Focus with a slight delay for better UX
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  // Global Escape key handling (close suggestions first, then terminal)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSuggestions) {
          setShowSuggestions(false);
          setSelectedSuggestion(-1);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, showSuggestions]);

  // Sync refs with state
  useEffect(() => {
    currentSizeRef.current = terminalState.size;
    currentPositionRef.current = terminalState.position;
  }, [terminalState.size, terminalState.position]);

  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;

    // If user is near the bottom or autoScroll is enabled, keep pinned to bottom
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;

    if (autoScrollRef.current || nearBottom) {
      requestAnimationFrame(() => {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'auto' // immediate to avoid jank
        });
      });
    }
  }, [commandHistory, isTyping]);

  return (
    <>
      {/* Terminal Toggle Button - Modern Glassmorphism Design */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white shadow-2xl hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: isOpen ? 180 : 0
        }}
        transition={{
          delay: 0.5,
          duration: 0.4,
          ease: "easeOut"
        }}
        aria-label={isOpen ? "Close interactive terminal" : "Open interactive terminal"}
        aria-expanded={isOpen}
      >
        <Terminal size={22} aria-hidden="true" />
        {isOpen && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
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
              left: `${terminalState.position.x}px`,
              top: `${terminalState.position.y}px`,
              width: `${terminalState.size.width}px`,
              height: isMinimized ? '48px' : `${terminalState.size.height}px`
            }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{
              duration: 0.15,
              ease: "easeOut"
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terminal-title"
            aria-describedby="terminal-description"
          >
            <div className={`w-full h-full group backdrop-blur-md bg-slate-900/80 border border-white/10 shadow-2xl rounded-2xl overflow-visible transition-all duration-300 ${isDragging ? 'cursor-move shadow-blue-500/20' : ''} ${isResizing ? `cursor-${resizeDirection === 'bottom-right' ? 'se' : resizeDirection === 'bottom-left' ? 'sw' : resizeDirection === 'top-right' ? 'ne' : 'nw'}-resize` : ''} hover:shadow-blue-500/10`}>
              {/* Terminal Header - Modern Glassmorphism Design */}
              <header
                className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-800/70 to-slate-900/70 backdrop-blur-sm border-b border-white/10 cursor-move select-none"
                onMouseDown={handleMouseDown}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-2" aria-label="Terminal window controls">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/50"
                      aria-label="Close terminal"
                      title="Close"
                    />
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                      aria-label={isMinimized ? "Restore terminal" : "Minimize terminal"}
                      title={isMinimized ? "Restore" : "Minimize"}
                    />
                    <button
                      onClick={() => {
                        // Simple maximize/restore toggle with centering
                        const vw = window.innerWidth;
                        const vh = window.innerHeight;
                        const maxWidth = Math.min(720, vw - 48);
                        const maxHeight = Math.min(540, vh - 64);
                        setIsMinimized(false);
                        setTerminalState(prev => ({
                          ...prev,
                          size: { width: maxWidth, height: maxHeight },
                          position: {
                            x: Math.max(24, Math.round((vw - maxWidth) / 2)),
                            y: Math.max(24, Math.round((vh - maxHeight - 40) / 2)),
                          }
                        }));
                      }}
                      className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400/50"
                      aria-label="Maximize and center"
                      title="Maximize"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <h2 id="terminal-title" className="text-sm font-medium text-white/90 font-mono">
                      Neural Terminal
                    </h2>
                    <span className="sr-only">Theme: {terminalTheme}</span>
                    {matrixMode && <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />}
                  </div>
                </div>
                <div className="flex items-center gap-2" role="group" aria-label="Terminal controls">
                </div>
              </header>

              {/* Terminal Content */}
              {!isMinimized && (
                <div className="h-full flex flex-col relative">
                  {/* Output Area - Modern Design */}
                  <div
                    ref={terminalRef}
                    onScroll={(e) => {
                      const el = e.currentTarget;
                      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
                      autoScrollRef.current = nearBottom;
                    }}
                    className="flex-1 p-4 pr-3 pb-6 font-mono text-[13px] md:text-sm overflow-y-auto overflow-x-hidden overscroll-contain bg-transparent min-h-0 text-white/90 leading-relaxed terminal-output"
                    style={{ scrollbarGutter: 'stable' }}
                    role="log"
                    aria-live="polite"
                    aria-label="Terminal output"
                    aria-describedby="terminal-description"
                  >
                    {/* Welcome Message */}
                    <div id="terminal-description" className="mb-3 text-blue-400 font-semibold">
                      🚀 Neural Interface Terminal v2.1.0 - {terminalTheme.toUpperCase()} MODE
                      {matrixMode && " 🕶️"}
                    </div>
                    <div className="mb-6 text-white/70 italic">
                      💡 Type 'help' for available commands. Try 'fun' for extra features!
                    </div>

                    {/* Command History */}
                    {commandHistory.map((cmd, index) => (
                      <div key={index} className="mb-4 group">
                        {cmd.input && (
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-blue-400 font-bold">$</span>
                            <span className="text-white/90 font-medium">{cmd.input}</span>
                          </div>
                        )}
                        <div className="ml-6 space-y-1">
                          {cmd.output.map((line, lineIndex) => (
                            <motion.div
                              key={lineIndex}
                              className="text-white/80 leading-relaxed"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                delay: lineIndex * 0.008,
                                duration: 0.15,
                                ease: "easeOut"
                              }}
                            >
                              {line}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area - Modern Design */}
                  <div className="flex-shrink-0 px-4 py-4 pb-6 bg-gradient-to-r from-slate-900/60 to-slate-900/30 border-t border-white/10 relative rounded-b-2xl min-h-[64px]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)' }}>
                    <div className="flex items-center gap-3" role="group" aria-label="Terminal command input">
                      <span className="text-blue-400 font-bold text-lg">$</span>
                      <div className="flex-1 relative">
                        <input
                          ref={inputRef}
                          type="text"
                          value={currentInput}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          className="w-full bg-transparent outline-none text-white/90 font-mono text-sm placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-400/60 focus:ring-offset-0 focus:bg-white/5 rounded-md px-3 py-2.5 transition-all duration-200"
                          placeholder="Type a command…"
                          disabled={isTyping}
                          aria-label="Terminal command input"
                          aria-describedby="terminal-instructions"
                        />

                        {/* Command Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                          <motion.div
                            className="absolute bottom-full left-0 right-0 mb-2 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 max-h-40 overflow-y-auto"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                          >
                            {suggestions.map((suggestion, index) => (
                              <button
                                key={suggestion}
                                onClick={() => {
                                  setCurrentInput(suggestion);
                                  setShowSuggestions(false);
                                  setSelectedSuggestion(-1);
                                  inputRef.current?.focus();
                                }}
                                className={`w-full text-left px-3 py-2 text-sm font-mono transition-colors ${
                                  index === selectedSuggestion
                                    ? 'bg-blue-500/30 text-blue-300'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                <span className="text-blue-400">$</span> {suggestion}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>

                      {isTyping && (
                        <motion.div
                          className="flex items-center gap-2 text-blue-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.span
                            animate={{
                              opacity: [1, 0.3, 1],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            aria-label="Processing command"
                          >
                            {matrixMode ? '█' : '●'}
                          </motion.span>
                          <span className="text-xs text-white/60">Processing...</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Resize Grips */}
                  {/* Bottom-Right */}
                  <div
                    className="resize-grip absolute bottom-0 right-0 w-12 h-12 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-end justify-end rounded-tl-md"
                    onMouseDown={handleResizeMouseDown('bottom-right')}
                    title="Drag to resize from bottom-right"
                  >
                    <div className="w-6 h-6 border-r-2 border-b-2 border-white/30 rounded-tl-md"></div>
                  </div>
                  {/* Bottom-Left */}
                  <div
                    className="resize-grip absolute bottom-0 left-0 w-12 h-12 cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-end justify-start rounded-tr-md"
                    onMouseDown={handleResizeMouseDown('bottom-left')}
                    title="Drag to resize from bottom-left"
                  >
                    <div className="w-6 h-6 border-l-2 border-b-2 border-white/30 rounded-tr-md"></div>
                  </div>
                  {/* Top-Right */}
                  <div
                    className="resize-grip absolute top-0 right-0 w-12 h-12 cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-start justify-end rounded-bl-md"
                    onMouseDown={handleResizeMouseDown('top-right')}
                    title="Drag to resize from top-right"
                  >
                    <div className="w-6 h-6 border-r-2 border-t-2 border-white/30 rounded-bl-md"></div>
                  </div>
                  {/* Top-Left */}
                  <div
                    className="resize-grip absolute top-0 left-0 w-12 h-12 cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-start justify-start rounded-br-md"
                    onMouseDown={handleResizeMouseDown('top-left')}
                    title="Drag to resize from top-left"
                  >
                    <div className="w-6 h-6 border-l-2 border-t-2 border-white/30 rounded-br-md"></div>
                  </div>

                  {/* Status bar removed to keep layout symmetric and avoid input clipping */}
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