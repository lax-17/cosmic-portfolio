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
  const [terminalTheme, setTerminalTheme] = useState<'default' | 'matrix' | 'hacker'>('matrix');
  const [gameNumber, setGameNumber] = useState<number | null>(null);
  const [gameAttempts, setGameAttempts] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [currentDirectory, setCurrentDirectory] = useState('/home/laxmikant');
  const [userInfo, setUserInfo] = useState({ user: 'laxmikant', host: 'neural-interface' });
  const [processes, setProcesses] = useState<string[]>(['systemd', 'sshd', 'nginx', 'node', 'terminal']);
  const [lastLogin, setLastLogin] = useState(new Date(Date.now() - 3600000)); // 1 hour ago
  const [cursorVisible, setCursorVisible] = useState(true);

  // Simple sound effect function
  const playSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Silently fail if Web Audio API is not supported
    }
  };
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
        "│   ├── 3 months with 4 researchers",
        "│   └── Medical NLP pipeline",
        "├── object_tracking_drone/",
        "│   ├── Real-time pursuit with PID control",
        "│   ├── OpenCV + GPS fusion",
        "│   ├── 2 months",
        "│   └── Autonomous navigation system",
        "└── fmri_image_reconstruction/",
        "    ├── GAN-based brain imaging",
        "    ├── StyleGAN2 + U-Net architectures",
        "    ├── 3 months solo project",
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
      output: [currentDirectory]
    },
    ls: {
      description: "List directory contents",
      output: [
        "drwxr-xr-x  2 laxmikant neural  4096 Dec 15 10:30 Documents/",
        "drwxr-xr-x  3 laxmikant neural  4096 Dec 15 09:45 Downloads/",
        "drwxr-xr-x  2 laxmikant neural  4096 Dec 14 16:20 Pictures/",
        "drwxr-xr-x  5 laxmikant neural  4096 Dec 15 11:15 Projects/",
        "-rw-r--r--  1 laxmikant neural   256 Dec 15 08:30 .bashrc",
        "-rw-r--r--  1 laxmikant neural   512 Dec 15 09:00 README.md",
        "-rw-------  1 laxmikant neural  1024 Dec 15 07:45 .ssh/",
        "lrwxrwxrwx  1 laxmikant neural    12 Dec 14 18:20 bin -> /usr/local/bin"
      ]
    },
    cd: {
      description: "Change directory",
      output: ["Usage: cd [directory]"]
    },
    ps: {
      description: "Show running processes",
      output: [
        "  PID TTY          TIME CMD",
        "  123 pts/0    00:00:01 systemd",
        "  456 pts/0    00:00:02 sshd",
        "  789 pts/0    00:00:05 nginx",
        " 1012 pts/0    00:00:03 node",
        " 1156 pts/0    00:00:00 bash",
        " 1201 pts/0    00:00:00 terminal"
      ]
    },
    top: {
      description: "Show system processes",
      output: [
        "top - 13:45:23 up 2 days,  5:23,  1 user,  load average: 0.52, 0.58, 0.59",
        "Tasks: 107 total,   1 running, 106 sleeping,   0 stopped,   0 zombie",
        "%Cpu(s):  5.2 us,  2.1 sy,  0.0 ni, 92.1 id,  0.5 wa,  0.0 hi,  0.1 si,  0.0 st",
        "MiB Mem :   8192.0 total,   2048.0 free,   4096.0 used,   2048.0 buff/cache",
        "MiB Swap:   2048.0 total,   1024.0 free,   1024.0 used,    512.0 avail Mem",
        "",
        "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND",
        "  456 root      20   0  1123456  45678  12345 S   2.1   0.6   0:05.23 sshd",
        "  789 www-data  20   0   987654  34567   8901 S   1.8   0.4   0:03.45 nginx",
        " 1012 laxmikant 20   0  2345678  78901  23456 S   5.2   1.0   0:02.34 node",
        " 1156 laxmikant 20   0   456789  12345   5678 S   0.1   0.2   0:00.01 bash"
      ]
    },
    df: {
      description: "Show disk usage",
      output: [
        "Filesystem     1K-blocks    Used Available Use% Mounted on",
        "/dev/sda1       52428800 15728640  34603008  32% /",
        "tmpfs             4194304       0   4194304   0% /tmp",
        "/dev/sdb1      104857600 52428800  47185920  53% /home",
        "udev               512000     1024    510976   1% /dev"
      ]
    },
    free: {
      description: "Show memory usage",
      output: [
        "               total        used        free      shared  buff/cache   available",
        "Mem:        8388608     4194304     2097152      524288     2097152     3145728",
        "Swap:       2097152     1048576     1048576"
      ]
    },
    uptime: {
      description: "Show system uptime",
      output: [` ${Math.floor(Math.random() * 24) + 1} days, ${Math.floor(Math.random() * 24)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')},  1 user,  load average: ${Math.random().toFixed(2)}, ${Math.random().toFixed(2)}, ${Math.random().toFixed(2)}`]
    },
    whoami: {
      description: "Display current user info",
      output: [
        `${userInfo.user}@${userInfo.host}:~$ whoami`,
        userInfo.user,
        "AI/ML Engineer | Neural Interface Terminal",
        "Specializing in Large Language Models & Computer Vision",
        "",
        "Last login:", lastLogin.toLocaleString(),
        "",
        "System Information:",
        "├── OS: Neural Linux 5.15.0-neural",
        "├── Kernel: 5.15.0-41-generic",
        "├── Architecture: x86_64",
        "└── Terminal: Neural Terminal v2.1.0"
      ]
    },
    uname: {
      description: "Show system information",
      output: ["Linux neural-interface 5.15.0-neural #1 SMP Neural Linux 5.15.0-41-generic x86_64 x86_64 x86_64 GNU/Linux"]
    },
    history: {
      description: "Show command history",
      output: commandHistory.slice(-10).map((cmd, idx) => `${String(commandHistory.length - 9 + idx).padStart(4, ' ')}  ${cmd.input || '(empty)'}`).concat(["", "Type 'history -c' to clear history"])
    },
    "history -c": {
      description: "Clear command history",
      output: ["Command history cleared."]
    },
    
    
    
    
    
    
    grep: {
      description: "Search for patterns in files",
      output: ["Usage: grep [options] pattern [file...]", "Options:", "  -i    Ignore case", "  -n    Show line numbers", "  -r    Recursive search"]
    },
    find: {
      description: "Search for files in directory hierarchy",
      output: ["Usage: find [path] [expression]", "Examples:", "  find . -name '*.txt'    Find all .txt files", "  find . -type f         Find all files", "  find . -type d         Find all directories"]
    },
    wc: {
      description: "Print newline, word, and byte counts",
      output: ["Usage: wc [options] [file...]", "Options:", "  -l    Print line count", "  -w    Print word count", "  -c    Print byte count"]
    },
    head: {
      description: "Output the first part of files",
      output: ["Usage: head [options] [file...]", "Options:", "  -n N    Print first N lines (default 10)"]
    },
    tail: {
      description: "Output the last part of files",
      output: ["Usage: tail [options] [file...]", "Options:", "  -n N    Print last N lines (default 10)", "  -f      Follow file changes"]
    },
    
    
    hostname: {
      description: "Show or set system hostname",
      output: [userInfo.host]
    },
    id: {
      description: "Print user and group information",
      output: [`uid=1000(${userInfo.user}) gid=1000(${userInfo.user}) groups=1000(${userInfo.user}),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),120(lp),131(lxd),132(sambashare)`]
    },
    env: {
      description: "Display environment variables",
      output: [
        "SHELL=/bin/bash",
        "USER=" + userInfo.user,
        "HOME=/home/" + userInfo.user,
        "PWD=" + currentDirectory,
        "LANG=en_US.UTF-8",
        "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "TERM=xterm-256color",
        "EDITOR=nano"
      ]
    },
    which: {
      description: "Locate a command",
      output: ["Usage: which [command]"]
    },
    type: {
      description: "Display information about command type",
      output: ["Usage: type [command]"]
    },
    file: {
      description: "Determine file type",
      output: ["Usage: file [filename]"]
    },
    
    
    
    
    
    
    nslookup: {
      description: "Query DNS name servers",
      output: ["Usage: nslookup [domain]"]
    },
    traceroute: {
      description: "Trace packet route to host",
      output: ["Usage: traceroute [host]"]
    },
    ifconfig: {
      description: "Configure network interfaces",
      output: [
        "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
        "        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255",
        "        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>",
        "        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)",
        "        RX packets 12345  bytes 1234567 (1.2 MiB)",
        "        RX errors 0  dropped 0  overruns 0  frame 0",
        "        TX packets 6789  bytes 987654 (987.6 KiB)",
        "        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0",
        "",
        "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536",
        "        inet 127.0.0.1  netmask 255.0.0.0",
        "        inet6 ::1  prefixlen 128  scopeid 0x10<host>",
        "        loop  txqueuelen 1000  (Local Loopback)",
        "        RX packets 1234  bytes 56789 (56.7 KiB)",
        "        RX errors 0  dropped 0  overruns 0  frame 0",
        "        TX packets 1234  bytes 56789 (56.7 KiB)",
        "        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0"
      ]
    },
    
    
    
    
    
    
    
    
    
    
    man: {
      description: "Display manual page",
      output: ["Usage: man [command]", "Available commands: help, pwd, ls, cd, ps, top, df, free, uptime, whoami, uname, history, grep, find, wc, head, tail, hostname, id, env, which, type, file, nslookup, traceroute, ifconfig, date, echo, ping, cat, clear"]
    },
    clear: {
      description: "Clear terminal history",
      output: []
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
    
    
    
    resize: {
      description: "Resize terminal window",
      output: [
        "Terminal is now resizable!",
        "Drag the bottom-right corner to resize",
        "Or drag the title bar to move the terminal"
      ]
    },
    
    
    
    
    
    
    
    "help file": {
      description: "Show file system commands",
      output: [
        "🗂️  File System Commands:",
        "",
        "  pwd           - Print working directory",
        "  ls            - List directory contents",
        "  cd [dir]      - Change directory",
        "  mkdir [dir]   - Create directory",
        "  rmdir [dir]   - Remove empty directory",
        "  touch [file]  - Create empty file or update timestamp",
        "  rm [file]     - Remove files or directories",
        "  cp [src] [dst]- Copy files and directories",
        "  mv [src] [dst]- Move or rename files and directories",
        "  cat [file]    - Display file contents",
        "",
        "Examples:",
        "  mkdir projects    - Create a 'projects' directory",
        "  touch hello.txt   - Create an empty file",
        "  rm -r old_dir     - Remove directory recursively",
        "  cp file1 file2    - Copy file1 to file2"
      ]
    },
    "help system": {
      description: "Show system information commands",
      output: [
        "🖥️  System Information Commands:",
        "",
        "  ps            - Show running processes",
        "  top           - Show system processes (detailed)",
        "  df            - Show disk usage",
        "  free          - Show memory usage",
        "  uptime        - Show system uptime",
        "  uname         - Show system information",
        "  hostname      - Show system hostname",
        "  id            - Show user and group information",
        "  env           - Show environment variables",
        "  which [cmd]   - Locate a command",
        "  type [cmd]    - Show command type",
        "  file [file]   - Determine file type",
        "  history       - Show command history",
        "  man [cmd]     - Display manual page",
        "",
        "Examples:",
        "  ps            - List all running processes",
        "  df -h         - Show disk usage in human readable format",
        "  free -h       - Show memory usage in human readable format",
        "  env | grep PATH - Show PATH environment variable"
      ]
    },
    "help network": {
      description: "Show network commands",
      output: [
        "🌐 Network Commands:",
        "",
        "  ping [host]   - Test network connection",
        "  nslookup [dom]- Query DNS name servers",
        "  traceroute [h]- Trace packet route to host",
        "  ifconfig      - Configure network interfaces",
        "",
        "Examples:",
        "  ping google.com     - Test connection to Google",
        "  nslookup example.com - Get DNS information",
        "  traceroute 8.8.8.8  - Trace route to Google DNS",
        "  ifconfig            - Show network interface information"
      ]
    },
    
    "help all": {
      description: "Show all available commands",
      output: [
        "📋 All Available Commands:",
        "",
        "🎯 Portfolio Commands:",
        "  help, whoami, skills, projects, contact",
        "",
        "🗂️  File System:",
        "  pwd, ls, cd, cat",
        "",
        "🔍 Text Processing:",
        "  grep, find, wc, head, tail",
        "",
        "🖥️  System Info:",
        "  ps, top, df, free, uptime, uname, hostname, id, env, which, type, file, history, man",
        "",
        "🌐 Network:",
        "  ping, nslookup, traceroute, ifconfig",
        "",
        "🛠️  Utilities:",
        "  clear, date, echo",
        "",
        "📖 Help Commands:",
        "  help file, help system, help network, help all",
        "",
        "🎯 Portfolio Commands:",
        "  help, whoami, skills, projects, contact",
        "",
        "🗂️  File System:",
        "  pwd, ls, cd, cat",
        "",
        "🔍 Text Processing:",
        "  grep, find, wc, head, tail",
        "",
        "🖥️  System Info:",
        "  ps, top, df, free, uptime, uname, hostname, id, env, which, type, file, history, man",
        "",
        "🌐 Network:",
        "  ping, nslookup, traceroute, ifconfig",
        "",
        "🛠️  Utilities:",
        "  clear, date, echo",
        "",
        "🎉 Fun & Games:",
        "  matrix, hack, joke, fortune, 8ball, quote, ascii, game, guess",
        "",
        "🎨 Customization:",
        "  theme, fun, resize",
        "",
        "📖 Help Commands:",
        "  help file, help system, help network, help dev, help all"
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

    // Play typing sound effect
    playSound(800, 0.1);

    // Faster processing with minimal delay for better UX
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 150));

    let output: string[] = [];

    if (cmd === 'clear') {
      setCommandHistory([]);
      setIsTyping(false);
      return;
    }

    if (cmd === 'guess') {
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
    } else if (cmd === 'cd') {
      const newDir = args[0];
      if (!newDir || newDir === '~') {
        setCurrentDirectory('/home/laxmikant');
        output = [];
      } else if (newDir === '..') {
        const parts = currentDirectory.split('/');
        parts.pop();
        const newPath = parts.length > 1 ? parts.join('/') : '/';
        setCurrentDirectory(newPath);
        output = [];
      } else if (newDir.startsWith('/')) {
        setCurrentDirectory(newDir);
        output = [];
      } else {
        const newPath = currentDirectory === '/' ? `/${newDir}` : `${currentDirectory}/${newDir}`;
        setCurrentDirectory(newPath);
        output = [];
      }
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
      } else if (file === '.bashrc') {
        output = [
          "# ~/.bashrc",
          "export PATH=$PATH:/usr/local/bin",
          "export EDITOR=nano",
          "alias ll='ls -alF'",
          "alias la='ls -A'",
          "alias l='ls -CF'",
          "PS1='\\u@\\h:\\w\\$ '"
        ];
      } else {
        output = [`cat: ${file}: No such file or directory`];
      }
    } else if (cmd === 'history') {
      if (args[0] === '-c') {
        setCommandHistory([]);
        output = ["Command history cleared."];
      } else {
        output = commandHistory.slice(-10).map((cmd, idx) => `${String(commandHistory.length - 9 + idx).padStart(4, ' ')}  ${cmd.input || '(empty)'}`).concat(["", "Type 'history -c' to clear history"]);
      }
    } else if (cmd === 'man') {
      const command = args[0];
      if (command && availableCommands[command as keyof typeof availableCommands]) {
        output = [
          `Manual page for ${command}`,
          "NAME",
          `    ${command} - ${availableCommands[command as keyof typeof availableCommands].description}`,
          "",
          "SYNOPSIS",
          `    ${command} [options]`,
          "",
          "DESCRIPTION",
          `    ${availableCommands[command as keyof typeof availableCommands].description}`,
          "",
          "SEE ALSO",
          "    help(1), man(1)"
        ];
      } else {
        output = ["Usage: man [command]", "Available commands: help, pwd, ls, cd, ps, top, df, free, uptime, whoami, uname, history"];
      }
    } else if (availableCommands[cmd as keyof typeof availableCommands]) {
      output = availableCommands[cmd as keyof typeof availableCommands].output;
    } else if (trimmedCommand === '') {
      output = [];
    } else {
      output = [
        `bash: ${cmd}: command not found`,
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
          text: 'text-green-300',
          prompt: 'text-green-400',
          border: 'border-green-600',
          glow: 'shadow-green-500/30',
          header: 'bg-gray-900/95',
          caret: 'caret-green-400',
        };
      case 'hacker':
        return {
          background: 'bg-gray-900',
          text: 'text-red-400',
          prompt: 'text-red-400',
          border: 'border-red-500',
          glow: 'shadow-red-500/50',
          header: 'bg-gray-800/95',
          caret: 'caret-red-400',
        };
      default:
        return {
          background: 'bg-terminal',
          text: 'text-terminal-text',
          prompt: 'text-blue-400',
          border: 'border-terminal-border',
          glow: 'cosmic-glow',
          header: 'bg-slate-800/70',
          caret: 'caret-blue-400',
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
        // Ensure cursor is at the end of input
        if (inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.value.length;
          inputRef.current.selectionEnd = inputRef.current.value.length;
        }
      }, 100);
    }
  }, [isOpen, isMinimized, currentInput]);

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

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

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
            <div className={`w-full h-full group backdrop-blur-md ${themeStyles.background} border ${themeStyles.border} shadow-2xl rounded-none overflow-hidden transition-all duration-300 ${isDragging ? 'cursor-move shadow-blue-500/20' : ''} ${isResizing ? `cursor-${resizeDirection === 'bottom-right' ? 'se' : resizeDirection === 'bottom-left' ? 'sw' : resizeDirection === 'top-right' ? 'ne' : 'nw'}-resize` : ''} hover:shadow-blue-500/10 ${themeStyles.glow}`}>
              {/* Terminal Header - Modern Glassmorphism Design */}
              <header
                className={`flex items-center justify-between px-4 py-3 ${themeStyles.header} backdrop-blur-sm border-b ${themeStyles.border} cursor-move select-none`}
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
                    <h2 id="terminal-title" className={`text-sm font-medium ${themeStyles.text} font-mono`}>
                      {terminalTheme === 'matrix' ? 'The Matrix Terminal' : `${userInfo.user}@${userInfo.host}:~`}
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
                    className={`flex-1 p-4 pr-3 pb-6 font-mono text-[13px] md:text-sm overflow-y-auto overflow-x-hidden overscroll-contain ${themeStyles.background} min-h-0 ${themeStyles.text} leading-relaxed terminal-output`}
                    style={{ scrollbarGutter: 'stable' }}
                    role="log"
                    aria-live="polite"
                    aria-label="Terminal output"
                    aria-describedby="terminal-description"
                  >
                    {/* Welcome Message */}
                    <div id="terminal-description" className={`mb-3 ${themeStyles.prompt} font-mono text-sm`}>
                      {terminalTheme === 'matrix' ? (
                        <>
                          Wake up, Neo... The Matrix has you.
                          <br />
                          Neural Terminal v2.1.0 - MATRIX MODE 🕶️
                        </>
                      ) : (
                        <>
                          Welcome to Neural Linux (GNU/Linux 5.15.0-neural x86_64)
                          Last login: {lastLogin.toLocaleString()} from 127.0.0.1
                        </>
                      )}
                    </div>
                    <div className={`mb-6 ${themeStyles.text} italic font-mono text-sm opacity-70`}>
                      * Type 'help' for available commands
                      * Use ↑/↓ arrows to navigate command history
                      * Press Tab for auto-completion
                      {terminalTheme === 'matrix' && (
                        <>
                          <br />
                          * Type 'theme default' to exit Matrix mode
                        </>
                      )}
                    </div>

                    {/* Command History */}
                    {commandHistory.map((cmd, index) => (
                      <div key={index} className="mb-4 group">
                        {cmd.input && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`${themeStyles.prompt} font-mono text-sm`}>
                              {userInfo.user}@{userInfo.host}:{currentDirectory.replace('/home/laxmikant', '~')}$
                            </span>
                            <span className={`${themeStyles.text} font-medium font-mono`}>{cmd.input}</span>
                          </div>
                        )}
                        <div className="ml-6 space-y-1">
                          {cmd.output.map((line, lineIndex) => (
                            <motion.div
                              key={lineIndex}
                              className={`${themeStyles.text} leading-relaxed font-mono text-sm opacity-90`}
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

                    {/* Current Input Line - Inside Terminal Content */}
                    {!isTyping && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`${themeStyles.prompt} font-mono text-sm`}>
                          {userInfo.user}@{userInfo.host}:{currentDirectory.replace('/home/laxmikant', '~')}$
                        </span>
                        <div className="flex-1 relative">
                          <input
                            ref={inputRef}
                            type="text"
                            value={currentInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            className={`w-full bg-transparent outline-none ${themeStyles.text} ${themeStyles.caret} font-mono text-sm placeholder-current/30 focus:outline-none`}
                            placeholder=""
                            disabled={isTyping}
                            aria-label="Terminal command input"
                            aria-describedby="terminal-instructions"
                            autoFocus
                            spellCheck={false}
                            autoCorrect="off"
                            autoCapitalize="off"
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    )}
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