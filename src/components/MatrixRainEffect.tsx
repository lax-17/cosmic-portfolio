import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  characters: string[];
  opacity: number;
  length: number;
}

interface MatrixRainProps {
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  characters?: 'binary' | 'katakana' | 'neural' | 'cosmic';
  isVisible?: boolean;
}

const MatrixRainEffect: React.FC<MatrixRainProps> = ({
  intensity = 'medium',
  color = 'hsl(var(--neural-green))',
  characters = 'neural',
  isVisible = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const columnsRef = useRef<MatrixColumn[]>([]);
  const [showControls, setShowControls] = useState(false);
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const [currentColor, setCurrentColor] = useState(color);
  const [currentCharSet, setCurrentCharSet] = useState(characters);
  const [isActive, setIsActive] = useState(isVisible);

  const characterSets = {
    binary: ['0', '1'],
    katakana: [
      'ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク', 'ケ', 'コ',
      'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト',
      'ナ', 'ニ', 'ヌ', 'ネ', 'ノ', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
      'マ', 'ミ', 'ム', 'メ', 'モ', 'ヤ', 'ユ', 'ヨ', 'ラ', 'リ',
      'ル', 'レ', 'ロ', 'ワ', 'ヲ', 'ン'
    ],
    neural: [
      '∞', '∆', '∇', '∑', '∏', '∫', '∂', '∴', '∵', '∈',
      '∉', '∋', '∌', '∀', '∃', '∄', '∅', '∪', '∩', '⊂',
      '⊃', '⊆', '⊇', '⊊', '⊋', '⊕', '⊗', '⊙', '⊚', '⊛',
      'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'λ', 'μ',
      'π', 'ρ', 'σ', 'τ', 'φ', 'χ', 'ψ', 'ω'
    ],
    cosmic: [
      '★', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯',
      '⟨', '⟩', '⊗', '⊕', '⊙', '⊚', '⊛', '⊜', '⊝', '⊞',
      '◊', '◈', '◉', '◎', '●', '○', '◐', '◑', '◒', '◓',
      '▲', '▼', '◆', '◇', '■', '□', '▪', '▫', '▬', '▭'
    ]
  };

  const intensitySettings = {
    low: { columnCount: 30, speed: 0.5, opacity: 0.3 },
    medium: { columnCount: 50, speed: 1, opacity: 0.5 },
    high: { columnCount: 80, speed: 1.5, opacity: 0.7 }
  };

  const initializeColumns = (canvas: HTMLCanvasElement) => {
    const settings = intensitySettings[currentIntensity];
    const columnWidth = 20;
    const columnCount = Math.floor(canvas.width / columnWidth);
    
    columnsRef.current = Array.from({ length: Math.min(columnCount, settings.columnCount) }, (_, i) => ({
      x: i * columnWidth,
      y: Math.random() * canvas.height,
      speed: (Math.random() * 2 + 1) * settings.speed,
      characters: Array.from({ length: Math.floor(Math.random() * 20) + 10 }, () =>
        characterSets[currentCharSet][Math.floor(Math.random() * characterSets[currentCharSet].length)]
      ),
      opacity: Math.random() * settings.opacity + 0.2,
      length: Math.floor(Math.random() * 15) + 5
    }));
  };

  const drawMatrix = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const fontSize = 14;
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;

    columnsRef.current.forEach((column) => {
      column.characters.forEach((char, index) => {
        const y = column.y - index * fontSize;
        
        if (y > canvas.height) return;

        // Calculate opacity based on position in column
        const fadeOpacity = Math.max(0, 1 - (index / column.length));
        const alpha = column.opacity * fadeOpacity;

        // Highlight the leading character
        if (index === 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 1.5})`;
          ctx.shadowColor = currentColor;
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = currentColor.replace(')', `, ${alpha})`).replace('hsl(', 'hsla(');
          ctx.shadowBlur = 0;
        }

        ctx.fillText(char, column.x, y);

        // Occasionally change characters for dynamic effect
        if (Math.random() < 0.01) {
          column.characters[index] = characterSets[currentCharSet][
            Math.floor(Math.random() * characterSets[currentCharSet].length)
          ];
        }
      });

      // Move column down
      column.y += column.speed;

      // Reset column when it goes off screen
      if (column.y - column.length * fontSize > canvas.height) {
        column.y = -column.length * fontSize;
        column.x = Math.random() * canvas.width;
        column.speed = (Math.random() * 2 + 1) * intensitySettings[currentIntensity].speed;
        column.opacity = Math.random() * intensitySettings[currentIntensity].opacity + 0.2;
      }
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawMatrix(canvas, ctx);
    animationRef.current = requestAnimationFrame(animate);
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initializeColumns(canvas);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    resizeCanvas();
    
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);

    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, currentIntensity, currentColor, currentCharSet]);

  useEffect(() => {
    if (isActive && canvasRef.current) {
      initializeColumns(canvasRef.current);
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [isActive, currentIntensity, currentCharSet]);

  return (
    <>
      {/* Matrix Rain Canvas */}
      <canvas
        ref={canvasRef}
        className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          background: 'transparent',
          mixBlendMode: 'screen'
        }}
      />

      {/* Control Button */}
      <motion.button
        className="fixed top-20 right-4 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowControls(!showControls)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        aria-label="Matrix rain controls"
      >
        <Zap className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
      </motion.button>

      {/* Control Panel */}
      {showControls && (
        <motion.div
          className="fixed top-32 right-4 z-50 w-64 bg-background/90 backdrop-blur-sm border border-primary/30 rounded-lg shadow-xl cosmic-glow"
          initial={{ opacity: 0, x: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold cosmic-text">Matrix Rain</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsActive(!isActive)}
              className="p-1"
            >
              {isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
          </div>

          {/* Controls */}
          <div className="p-3 space-y-4">
            {/* Intensity Control */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Intensity</label>
              <div className="grid grid-cols-3 gap-1">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={currentIntensity === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentIntensity(level)}
                    className="text-xs capitalize"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>

            {/* Character Set Control */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Character Set</label>
              <div className="grid grid-cols-2 gap-1">
                {(['binary', 'katakana', 'neural', 'cosmic'] as const).map((set) => (
                  <Button
                    key={set}
                    variant={currentCharSet === set ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentCharSet(set)}
                    className="text-xs capitalize"
                  >
                    {set}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Control */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground">Color Theme</label>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { name: 'Neural', color: 'hsl(var(--neural-green))' },
                  { name: 'Quantum', color: 'hsl(var(--neural-blue))' },
                  { name: 'Cosmic', color: 'hsl(var(--neural-pink))' },
                  { name: 'Classic', color: '#00ff00' }
                ].map((theme) => (
                  <Button
                    key={theme.name}
                    variant={currentColor === theme.color ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentColor(theme.color)}
                    className="text-xs"
                    style={currentColor === theme.color ? {
                      backgroundColor: theme.color,
                      borderColor: theme.color,
                      color: 'black'
                    } : {
                      borderColor: theme.color,
                      color: theme.color
                    }}
                  >
                    {theme.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Status:</span>
                <div className="flex items-center gap-1">
                  <motion.div
                    className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-muted'}`}
                    animate={isActive ? { opacity: [1, 0.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Columns:</span>
                <span className="text-primary">{intensitySettings[currentIntensity].columnCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-muted-foreground">Characters:</span>
                <span className="text-primary">{characterSets[currentCharSet].length}</span>
              </div>
            </div>

            {/* Sample Characters */}
            <div className="pt-2 border-t border-border">
              <div className="text-xs font-semibold text-muted-foreground mb-1">Sample Characters:</div>
              <div 
                className="text-sm font-mono p-2 bg-muted/50 rounded text-center"
                style={{ color: currentColor }}
              >
                {characterSets[currentCharSet].slice(0, 10).join(' ')}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

// Standalone Matrix Rain Background Component
const MatrixRainBackground: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after some time to not be too distracting
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 30000); // Hide after 30 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <MatrixRainEffect
      intensity="low"
      color="hsl(var(--neural-green))"
      characters="neural"
      isVisible={isVisible}
    />
  );
};

export default MatrixRainEffect;
export { MatrixRainBackground };