import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, Settings, Play, Pause, 
  Headphones, Waves, Zap, Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoundEffect {
  id: string;
  name: string;
  category: 'ui' | 'ambient' | 'notification' | 'interaction';
  frequency: number;
  duration: number;
  volume: number;
  type: 'sine' | 'square' | 'sawtooth' | 'triangle' | 'noise';
  description: string;
}

interface CosmicAudioContext {
  context: AudioContext | null;
  gainNode: GainNode | null;
  isEnabled: boolean;
}

const CosmicSoundEffects: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.3);
  const [ambientEnabled, setAmbientEnabled] = useState(true);
  const [uiSoundsEnabled, setUiSoundsEnabled] = useState(true);
  const [currentAmbient, setCurrentAmbient] = useState<string>('cosmic-hum');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const ambientOscillatorRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  const soundEffects: SoundEffect[] = [
    // UI Sounds
    {
      id: 'button-hover',
      name: 'Button Hover',
      category: 'ui',
      frequency: 800,
      duration: 0.1,
      volume: 0.2,
      type: 'sine',
      description: 'Subtle hover feedback'
    },
    {
      id: 'button-click',
      name: 'Button Click',
      category: 'ui',
      frequency: 1200,
      duration: 0.15,
      volume: 0.3,
      type: 'square',
      description: 'Click confirmation'
    },
    {
      id: 'navigation',
      name: 'Navigation',
      category: 'ui',
      frequency: 600,
      duration: 0.3,
      volume: 0.25,
      type: 'triangle',
      description: 'Section navigation sound'
    },
    {
      id: 'terminal-type',
      name: 'Terminal Typing',
      category: 'ui',
      frequency: 1000,
      duration: 0.05,
      volume: 0.15,
      type: 'square',
      description: 'Terminal keystroke'
    },
    
    // Notification Sounds
    {
      id: 'success',
      name: 'Success',
      category: 'notification',
      frequency: 880,
      duration: 0.5,
      volume: 0.4,
      type: 'sine',
      description: 'Success notification'
    },
    {
      id: 'error',
      name: 'Error',
      category: 'notification',
      frequency: 200,
      duration: 0.8,
      volume: 0.3,
      type: 'sawtooth',
      description: 'Error alert'
    },
    {
      id: 'neural-pulse',
      name: 'Neural Pulse',
      category: 'interaction',
      frequency: 440,
      duration: 0.6,
      volume: 0.35,
      type: 'sine',
      description: 'Neural network activation'
    },
    {
      id: 'quantum-entangle',
      name: 'Quantum Entanglement',
      category: 'interaction',
      frequency: 1760,
      duration: 1.0,
      volume: 0.25,
      type: 'triangle',
      description: 'Quantum state change'
    },
    
    // Ambient Sounds
    {
      id: 'cosmic-hum',
      name: 'Cosmic Hum',
      category: 'ambient',
      frequency: 60,
      duration: -1, // Continuous
      volume: 0.1,
      type: 'sine',
      description: 'Deep space ambient hum'
    },
    {
      id: 'neural-static',
      name: 'Neural Static',
      category: 'ambient',
      frequency: 2000,
      duration: -1,
      volume: 0.05,
      type: 'noise',
      description: 'Neural network background static'
    }
  ];

  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = masterVolume;
    }
  }, [masterVolume]);

  const createNoiseBuffer = (context: AudioContext, duration: number = 1): AudioBuffer => {
    const bufferSize = context.sampleRate * duration;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  };

  const playSound = useCallback((soundId: string, customFreq?: number, customVolume?: number) => {
    if (!isEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    const sound = soundEffects.find(s => s.id === soundId);
    if (!sound) return;

    // Skip UI sounds if disabled
    if (sound.category === 'ui' && !uiSoundsEnabled) return;

    const context = audioContextRef.current;
    const frequency = customFreq || sound.frequency;
    const volume = customVolume || sound.volume;

    if (sound.type === 'noise') {
      // Create noise sound
      const buffer = createNoiseBuffer(context, sound.duration);
      const source = context.createBufferSource();
      const gainNode = context.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(gainNodeRef.current!);
      
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + sound.duration);
      
      source.start(context.currentTime);
      source.stop(context.currentTime + sound.duration);
    } else {
      // Create oscillator sound
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.type = sound.type as OscillatorType;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      
      // Add some frequency modulation for more interesting sounds
      if (sound.category === 'interaction') {
        oscillator.frequency.exponentialRampToValueAtTime(
          frequency * 0.8, 
          context.currentTime + sound.duration
        );
      }
      
      oscillator.connect(gainNode);
      gainNode.connect(gainNodeRef.current!);
      
      // Envelope
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
      
      if (sound.duration > 0) {
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + sound.duration);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + sound.duration);
      }
    }
  }, [isEnabled, uiSoundsEnabled, soundEffects]);

  const startAmbientSound = useCallback((soundId: string) => {
    if (!isEnabled || !ambientEnabled || !audioContextRef.current || !gainNodeRef.current) return;

    // Stop current ambient sound
    if (ambientOscillatorRef.current) {
      ambientOscillatorRef.current.stop();
      ambientOscillatorRef.current = null;
    }

    const sound = soundEffects.find(s => s.id === soundId && s.category === 'ambient');
    if (!sound) return;

    const context = audioContextRef.current;
    
    if (sound.type === 'noise') {
      // Create continuous noise
      const buffer = createNoiseBuffer(context, 2); // 2-second loop
      const source = context.createBufferSource();
      const gainNode = context.createGain();
      
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNode);
      gainNode.connect(gainNodeRef.current!);
      
      gainNode.gain.setValueAtTime(sound.volume, context.currentTime);
      ambientGainRef.current = gainNode;
      
      source.start();
      ambientOscillatorRef.current = source as any;
    } else {
      // Create continuous oscillator
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.type = sound.type as OscillatorType;
      oscillator.frequency.setValueAtTime(sound.frequency, context.currentTime);
      
      // Add subtle frequency modulation
      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      lfo.frequency.setValueAtTime(0.1, context.currentTime);
      lfoGain.gain.setValueAtTime(5, context.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      oscillator.connect(gainNode);
      gainNode.connect(gainNodeRef.current!);
      
      gainNode.gain.setValueAtTime(sound.volume, context.currentTime);
      ambientGainRef.current = gainNode;
      
      oscillator.start();
      lfo.start();
      ambientOscillatorRef.current = oscillator;
    }
  }, [isEnabled, ambientEnabled, soundEffects]);

  const stopAmbientSound = useCallback(() => {
    if (ambientOscillatorRef.current) {
      ambientOscillatorRef.current.stop();
      ambientOscillatorRef.current = null;
    }
  }, []);

  // Initialize audio context when enabled
  useEffect(() => {
    if (isEnabled) {
      initializeAudioContext();
    }
  }, [isEnabled, initializeAudioContext]);

  // Update master volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = masterVolume;
    }
  }, [masterVolume]);

  // Start/stop ambient sound
  useEffect(() => {
    if (isEnabled && ambientEnabled) {
      startAmbientSound(currentAmbient);
    } else {
      stopAmbientSound();
    }

    return () => {
      stopAmbientSound();
    };
  }, [isEnabled, ambientEnabled, currentAmbient, startAmbientSound, stopAmbientSound]);

  // Add event listeners for UI sounds
  useEffect(() => {
    if (!isEnabled || !uiSoundsEnabled) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.matches('button, a[href], input, textarea, select, [role="button"]')) {
        playSound('button-hover');
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.matches('button, a[href], [role="button"]')) {
        playSound('button-click');
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.target && (e.target as Element).matches('input[type="text"], textarea')) {
        playSound('terminal-type', 800 + Math.random() * 400, 0.1);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [isEnabled, uiSoundsEnabled, playSound]);

  // Expose playSound function globally for other components
  useEffect(() => {
    (window as any).cosmicSounds = {
      play: playSound,
      success: () => playSound('success'),
      error: () => playSound('error'),
      neuralPulse: () => playSound('neural-pulse'),
      quantumEntangle: () => playSound('quantum-entangle'),
      navigation: () => playSound('navigation')
    };

    return () => {
      delete (window as any).cosmicSounds;
    };
  }, [playSound]);

  const toggleSoundSystem = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      // Resume audio context if needed
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } else {
      // Stop ambient sound when disabled
      stopAmbientSound();
    }
  };

  return (
    <>
      {/* Sound Control Toggle - Better mobile positioning */}
      <motion.button
        className={`fixed bottom-32 left-4 md:bottom-32 md:left-6 z-50 p-2 md:p-3 rounded-full shadow-lg transition-all duration-300 ${
          isEnabled
            ? 'bg-primary/20 text-primary border border-primary/50 cosmic-glow'
            : 'bg-muted/80 text-muted-foreground border border-border hover:bg-muted'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSoundSystem}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3 }}
        aria-label={isEnabled ? "Disable cosmic sounds" : "Enable cosmic sounds"}
        title={isEnabled ? "Sound effects enabled" : "Click to enable sound effects"}
      >
        {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        {isEnabled && (
          <motion.div
            className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Tooltip - Mobile responsive positioning */}
      {isEnabled && (
        <motion.div
          className="fixed bottom-44 left-4 md:bottom-44 md:left-6 z-50 px-2 py-1 bg-background/90 backdrop-blur-sm border border-border rounded text-xs text-muted-foreground pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 2 }}
        >
          Sound effects active
        </motion.div>
      )}
    </>
  );
};

export default CosmicSoundEffects;