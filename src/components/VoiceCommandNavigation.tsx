import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Volume2, VolumeX, Settings, 
  Brain, Zap, Activity, Command, Play, Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceCommand {
  command: string;
  aliases: string[];
  description: string;
  action: () => void;
  category: 'navigation' | 'system' | 'interaction';
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  addEventListener(type: 'result', listener: (event: SpeechRecognitionEvent) => void): void;
  addEventListener(type: 'error', listener: (event: SpeechRecognitionErrorEvent) => void): void;
  addEventListener(type: 'start' | 'end', listener: () => void): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const VoiceCommandNavigation: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [voiceLevel, setVoiceLevel] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [sensitivity, setSensitivity] = useState(0.7);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationRef = useRef<number>();

  const voiceCommands: VoiceCommand[] = [
    // Navigation Commands
    {
      command: 'go to home',
      aliases: ['home', 'go home', 'navigate home'],
      description: 'Navigate to the home section',
      category: 'navigation',
      action: () => scrollToSection('hero')
    },
    {
      command: 'go to projects',
      aliases: ['projects', 'show projects', 'navigate projects'],
      description: 'Navigate to the projects section',
      category: 'navigation',
      action: () => scrollToSection('projects')
    },
    {
      command: 'go to skills',
      aliases: ['skills', 'show skills', 'navigate skills'],
      description: 'Navigate to the skills section',
      category: 'navigation',
      action: () => scrollToSection('skills')
    },
    {
      command: 'go to experience',
      aliases: ['experience', 'show experience', 'navigate experience'],
      description: 'Navigate to the experience section',
      category: 'navigation',
      action: () => scrollToSection('experience')
    },
    {
      command: 'go to contact',
      aliases: ['contact', 'show contact', 'navigate contact'],
      description: 'Navigate to the contact section',
      category: 'navigation',
      action: () => scrollToSection('contact')
    },
    // System Commands
    {
      command: 'toggle theme',
      aliases: ['switch theme', 'change theme', 'dark mode', 'light mode'],
      description: 'Toggle between light and dark themes',
      category: 'system',
      action: () => {
        const themeToggle = document.querySelector('[aria-label*="theme"]') as HTMLButtonElement;
        if (themeToggle) themeToggle.click();
      }
    },
    {
      command: 'open terminal',
      aliases: ['show terminal', 'terminal', 'command line'],
      description: 'Open the interactive terminal',
      category: 'system',
      action: () => {
        const terminalButton = document.querySelector('[aria-label*="terminal"]') as HTMLButtonElement;
        if (terminalButton) terminalButton.click();
      }
    },
    {
      command: 'download resume',
      aliases: ['get resume', 'resume', 'cv'],
      description: 'Download the resume PDF',
      category: 'interaction',
      action: () => {
        const resumeLink = document.querySelector('a[href*="resume"]') as HTMLAnchorElement;
        if (resumeLink) resumeLink.click();
      }
    },
    // Voice Control Commands
    {
      command: 'stop listening',
      aliases: ['stop', 'silence', 'mute'],
      description: 'Stop voice recognition',
      category: 'system',
      action: () => setIsListening(false)
    },
    {
      command: 'help',
      aliases: ['show commands', 'what can you do', 'commands'],
      description: 'Show available voice commands',
      category: 'system',
      action: () => setShowSettings(true)
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const processVoiceCommand = useCallback((transcript: string, confidence: number) => {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    if (confidence < sensitivity) {
      return;
    }

    // Find matching command
    const matchedCommand = voiceCommands.find(cmd => 
      cmd.command === normalizedTranscript || 
      cmd.aliases.some(alias => normalizedTranscript.includes(alias.toLowerCase()))
    );

    if (matchedCommand) {
      setLastCommand(matchedCommand.command);
      setCommandHistory(prev => [matchedCommand.command, ...prev.slice(0, 9)]);
      
      // Execute command with a slight delay for visual feedback
      setTimeout(() => {
        matchedCommand.action();
      }, 500);

      // Provide audio feedback
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(`Executing ${matchedCommand.command}`);
        utterance.volume = 0.3;
        utterance.rate = 1.2;
        speechSynthesis.speak(utterance);
      }
    } else {
      setLastCommand(`Unrecognized: "${transcript}"`);
    }
  }, [sensitivity]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const initializeAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const updateVoiceLevel = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setVoiceLevel(average / 255);

        animationRef.current = requestAnimationFrame(updateVoiceLevel);
      };

      updateVoiceLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }, []);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.addEventListener('result', (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            processVoiceCommand(transcript, confidence);
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        setCurrentCommand(interimTranscript || finalTranscript);
      });

      recognition.addEventListener('start', () => {
        setIsListening(true);
      });

      recognition.addEventListener('end', () => {
        setIsListening(false);
        if (isEnabled) {
          // Restart listening if still enabled
          setTimeout(startListening, 1000);
        }
      });

      recognition.addEventListener('error', (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [language, processVoiceCommand, startListening, isEnabled]);

  useEffect(() => {
    if (isEnabled && isSupported) {
      initializeAudioVisualization();
      startListening();
    } else {
      stopListening();
    }
  }, [isEnabled, isSupported, initializeAudioVisualization, startListening, stopListening]);

  const toggleVoiceControl = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      // Provide initial instructions
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance('Voice control activated. Say "help" to see available commands.');
        utterance.volume = 0.5;
        speechSynthesis.speak(utterance);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-4 left-4 p-4 bg-muted/90 backdrop-blur-sm border border-border rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MicOff className="w-4 h-4" />
          Voice commands not supported in this browser
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Voice Control Toggle Button - Better mobile positioning */}
      <motion.button
        className={`fixed bottom-20 left-4 md:bottom-20 md:left-6 z-50 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 ${
          isEnabled
            ? 'bg-primary text-primary-foreground cosmic-glow'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleVoiceControl}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        aria-label={isEnabled ? "Disable voice control" : "Enable voice control"}
      >
        <motion.div
          animate={isListening ? {
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          } : {}}
          transition={{ duration: 2, repeat: isListening ? Infinity : 0 }}
        >
          {isEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </motion.div>

        {/* Voice Level Indicator */}
        {isEnabled && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{
              scale: 1 + voiceLevel * 0.5,
              opacity: 0.3 + voiceLevel * 0.7
            }}
            transition={{ duration: 0.1 }}
          />
        )}
      </motion.button>

      {/* Voice Status Panel */}
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            className="fixed bottom-32 left-4 md:left-6 z-50 w-72 md:w-80 bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg shadow-xl cosmic-glow"
            initial={{ opacity: 0, x: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold cosmic-text">Neural Voice Interface</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1"
                >
                  <Settings className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEnabled(false)}
                  className="p-1"
                >
                  <VolumeX className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Status:</span>
                <div className="flex items-center gap-1">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${isListening ? 'bg-primary' : 'bg-muted'}`}
                    animate={isListening ? { opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className={isListening ? 'text-primary' : 'text-muted-foreground'}>
                    {isListening ? 'Listening...' : 'Standby'}
                  </span>
                </div>
              </div>

              {/* Voice Level Visualization */}
              <div className="flex items-center gap-2 text-xs">
                <Volume2 className="w-3 h-3 text-muted-foreground" />
                <div className="flex-1 bg-muted rounded-full h-1">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    animate={{ width: `${voiceLevel * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-muted-foreground w-8">{Math.round(voiceLevel * 100)}%</span>
              </div>

              {/* Current Command */}
              {currentCommand && (
                <div className="p-2 bg-muted/50 rounded text-xs">
                  <div className="text-muted-foreground mb-1">Hearing:</div>
                  <div className="text-primary font-mono">{currentCommand}</div>
                </div>
              )}

              {/* Last Command */}
              {lastCommand && (
                <div className="p-2 bg-primary/10 rounded text-xs">
                  <div className="text-muted-foreground mb-1">Last Command:</div>
                  <div className="text-primary font-mono">{lastCommand}</div>
                  {confidence > 0 && (
                    <div className="text-muted-foreground mt-1">
                      Confidence: {Math.round(confidence * 100)}%
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-border p-3 space-y-3"
                >
                  <div className="text-xs font-semibold text-muted-foreground">Settings</div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Sensitivity:</span>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={sensitivity}
                        onChange={(e) => setSensitivity(Number(e.target.value))}
                        className="w-20"
                      />
                      <span className="w-8">{Math.round(sensitivity * 100)}%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span>Language:</span>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="text-xs bg-background border border-border rounded px-2 py-1"
                      >
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (UK)</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div className="font-semibold mb-1">Available Commands:</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {voiceCommands.slice(0, 8).map((cmd, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-primary">"{cmd.command}"</span>
                          <span className="text-muted-foreground">{cmd.category}</span>
                        </div>
                      ))}
                      {voiceCommands.length > 8 && (
                        <div className="text-muted-foreground">...and {voiceCommands.length - 8} more</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Command History */}
            {commandHistory.length > 0 && (
              <div className="border-t border-border p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Recent Commands</div>
                <div className="space-y-1 max-h-20 overflow-y-auto">
                  {commandHistory.slice(0, 3).map((cmd, index) => (
                    <div key={index} className="text-xs text-primary font-mono opacity-80">
                      {cmd}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceCommandNavigation;