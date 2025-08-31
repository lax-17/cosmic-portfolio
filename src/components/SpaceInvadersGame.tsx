import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Trophy, Target, 
  Zap, Heart, Shield, Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX?: number;
  velocityY?: number;
  health?: number;
  type: 'player' | 'alien' | 'bullet' | 'alienBullet' | 'powerup';
}

interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  lives: number;
  level: number;
  highScore: number;
}

const SpaceInvadersGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keysRef = useRef<Set<string>>(new Set());
  
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    lives: 3,
    level: 1,
    highScore: parseInt(localStorage.getItem('spaceInvadersHighScore') || '0')
  });

  const [player, setPlayer] = useState<GameObject>({
    id: 'player',
    x: 275,
    y: 450,
    width: 50,
    height: 30,
    type: 'player',
    health: 1
  });

  const [aliens, setAliens] = useState<GameObject[]>([]);
  const [bullets, setBullets] = useState<GameObject[]>([]);
  const [alienBullets, setAlienBullets] = useState<GameObject[]>([]);
  const [powerups, setPowerups] = useState<GameObject[]>([]);
  const [lastAlienMoveTime, setLastAlienMoveTime] = useState(0);
  const [alienDirection, setAlienDirection] = useState(1);

  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 500;
  const PLAYER_SPEED = 5;
  const BULLET_SPEED = 8;
  const ALIEN_SPEED = 1;

  const initializeAliens = useCallback(() => {
    const newAliens: GameObject[] = [];
    const rows = 5;
    const cols = 10;
    const alienWidth = 30;
    const alienHeight = 20;
    const spacing = 50;
    const startX = 50;
    const startY = 50;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newAliens.push({
          id: `alien-${row}-${col}`,
          x: startX + col * spacing,
          y: startY + row * spacing,
          width: alienWidth,
          height: alienHeight,
          type: 'alien',
          health: 1
        });
      }
    }
    setAliens(newAliens);
  }, []);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, isPaused: false, score: 0, lives: 3, level: 1 }));
    setPlayer({ ...player, x: 275, y: 450 });
    setBullets([]);
    setAlienBullets([]);
    setPowerups([]);
    initializeAliens();
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: false, 
      isPaused: false, 
      score: 0, 
      lives: 3, 
      level: 1 
    }));
    setAliens([]);
    setBullets([]);
    setAlienBullets([]);
    setPowerups([]);
  };

  const shoot = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    
    setBullets(prev => [...prev, {
      id: `bullet-${Date.now()}`,
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 10,
      velocityY: -BULLET_SPEED,
      type: 'bullet'
    }]);
  }, [gameState.isPlaying, gameState.isPaused, player.x, player.y, player.width]);

  const checkCollisions = useCallback(() => {
    // Bullet vs Aliens
    setBullets(prevBullets => {
      const remainingBullets = [...prevBullets];
      
      setAliens(prevAliens => {
        const remainingAliens = [...prevAliens];
        
        prevBullets.forEach((bullet, bulletIndex) => {
          prevAliens.forEach((alien, alienIndex) => {
            if (
              bullet.x < alien.x + alien.width &&
              bullet.x + bullet.width > alien.x &&
              bullet.y < alien.y + alien.height &&
              bullet.y + bullet.height > alien.y
            ) {
              // Hit!
              remainingBullets.splice(bulletIndex, 1);
              remainingAliens.splice(alienIndex, 1);
              
              setGameState(prev => ({ ...prev, score: prev.score + 10 }));
              
              // Chance for powerup
              if (Math.random() < 0.1) {
                setPowerups(prevPowerups => [...prevPowerups, {
                  id: `powerup-${Date.now()}`,
                  x: alien.x,
                  y: alien.y,
                  width: 20,
                  height: 20,
                  velocityY: 2,
                  type: 'powerup'
                }]);
              }
            }
          });
        });
        
        return remainingAliens;
      });
      
      return remainingBullets;
    });

    // Alien bullets vs Player
    setAlienBullets(prevAlienBullets => {
      const remainingAlienBullets = [...prevAlienBullets];
      
      prevAlienBullets.forEach((bullet, index) => {
        if (
          bullet.x < player.x + player.width &&
          bullet.x + bullet.width > player.x &&
          bullet.y < player.y + player.height &&
          bullet.y + bullet.height > player.y
        ) {
          // Player hit!
          remainingAlienBullets.splice(index, 1);
          setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));
        }
      });
      
      return remainingAlienBullets;
    });

    // Player vs Powerups
    setPowerups(prevPowerups => {
      const remainingPowerups = [...prevPowerups];
      
      prevPowerups.forEach((powerup, index) => {
        if (
          powerup.x < player.x + player.width &&
          powerup.x + powerup.width > player.x &&
          powerup.y < player.y + player.height &&
          powerup.y + powerup.height > player.y
        ) {
          // Powerup collected!
          remainingPowerups.splice(index, 1);
          setGameState(prev => ({ ...prev, score: prev.score + 50 }));
        }
      });
      
      return remainingPowerups;
    });
  }, [player]);

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const currentTime = Date.now();

    // Move player
    setPlayer(prev => {
      let newX = prev.x;
      if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a')) {
        newX = Math.max(0, prev.x - PLAYER_SPEED);
      }
      if (keysRef.current.has('ArrowRight') || keysRef.current.has('d')) {
        newX = Math.min(CANVAS_WIDTH - prev.width, prev.x + PLAYER_SPEED);
      }
      return { ...prev, x: newX };
    });

    // Move bullets
    setBullets(prev => prev
      .map(bullet => ({ ...bullet, y: bullet.y + (bullet.velocityY || 0) }))
      .filter(bullet => bullet.y > -10)
    );

    // Move alien bullets
    setAlienBullets(prev => prev
      .map(bullet => ({ ...bullet, y: bullet.y + (bullet.velocityY || 0) }))
      .filter(bullet => bullet.y < CANVAS_HEIGHT + 10)
    );

    // Move powerups
    setPowerups(prev => prev
      .map(powerup => ({ ...powerup, y: powerup.y + (powerup.velocityY || 0) }))
      .filter(powerup => powerup.y < CANVAS_HEIGHT + 10)
    );

    // Move aliens
    if (currentTime - lastAlienMoveTime > 500) {
      setAliens(prev => {
        let newAliens = prev.map(alien => ({
          ...alien,
          x: alien.x + (alienDirection * ALIEN_SPEED * 10)
        }));

        // Check if aliens hit the edge
        const rightMost = Math.max(...newAliens.map(a => a.x + a.width));
        const leftMost = Math.min(...newAliens.map(a => a.x));

        if (rightMost >= CANVAS_WIDTH || leftMost <= 0) {
          setAlienDirection(prev => -prev);
          newAliens = newAliens.map(alien => ({
            ...alien,
            y: alien.y + 20
          }));
        }

        return newAliens;
      });
      setLastAlienMoveTime(currentTime);
    }

    // Aliens shoot randomly
    if (Math.random() < 0.002 && aliens.length > 0) {
      const shootingAlien = aliens[Math.floor(Math.random() * aliens.length)];
      setAlienBullets(prev => [...prev, {
        id: `alien-bullet-${Date.now()}`,
        x: shootingAlien.x + shootingAlien.width / 2,
        y: shootingAlien.y + shootingAlien.height,
        width: 4,
        height: 8,
        velocityY: 3,
        type: 'alienBullet'
      }]);
    }

    checkCollisions();

    // Check win/lose conditions
    if (aliens.length === 0) {
      setGameState(prev => ({ 
        ...prev, 
        level: prev.level + 1,
        score: prev.score + 100 * prev.level
      }));
      initializeAliens();
    }

    if (gameState.lives <= 0) {
      setGameState(prev => {
        const newHighScore = Math.max(prev.highScore, prev.score);
        localStorage.setItem('spaceInvadersHighScore', newHighScore.toString());
        return { 
          ...prev, 
          isPlaying: false,
          highScore: newHighScore
        };
      });
    }
  }, [gameState, player, aliens, bullets, alienBullets, lastAlienMoveTime, alienDirection, checkCollisions, initializeAliens]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw stars
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % CANVAS_WIDTH;
      const y = (i * 73) % CANVAS_HEIGHT;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw player
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Player details
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x + 20, player.y - 5, 10, 5); // Cannon

    // Draw aliens
    aliens.forEach(alien => {
      ctx.fillStyle = '#ff0088';
      ctx.fillRect(alien.x, alien.y, alien.width, alien.height);
      
      // Alien details
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(alien.x + 5, alien.y + 5, 5, 5); // Eye 1
      ctx.fillRect(alien.x + 20, alien.y + 5, 5, 5); // Eye 2
    });

    // Draw bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw alien bullets
    alienBullets.forEach(bullet => {
      ctx.fillStyle = '#ff4400';
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Draw powerups
    powerups.forEach(powerup => {
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
      
      // Powerup glow
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(powerup.x - 2, powerup.y - 2, powerup.width + 4, powerup.height + 4);
    });

    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px JetBrains Mono';
    ctx.fillText(`Score: ${gameState.score}`, 10, 25);
    ctx.fillText(`Lives: ${gameState.lives}`, 10, 45);
    ctx.fillText(`Level: ${gameState.level}`, 10, 65);
    ctx.fillText(`High Score: ${gameState.highScore}`, 450, 25);

    // Game over screen
    if (!gameState.isPlaying && gameState.score > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#ff0088';
      ctx.font = '32px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px JetBrains Mono';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      
      if (gameState.score === gameState.highScore) {
        ctx.fillStyle = '#00ff88';
        ctx.fillText('NEW HIGH SCORE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
      }
      
      ctx.textAlign = 'left';
    }
  }, [player, aliens, bullets, alienBullets, powerups, gameState]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.key);
    
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      shoot();
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      const loop = () => {
        gameLoop();
        draw();
        animationRef.current = requestAnimationFrame(loop);
      };
      animationRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameLoop, draw]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/games $ python space_invaders.py --neural-enhanced
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Game Canvas */}
        <div className="lg:col-span-3">
          <div className="code-panel">
            <div className="code-header flex justify-between items-center">
              <span className="text-xs cosmic-text">space_invaders.canvas</span>
              <div className="flex items-center gap-2">
                {!gameState.isPlaying ? (
                  <Button
                    onClick={startGame}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Game
                  </Button>
                ) : (
                  <Button
                    onClick={pauseGame}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {gameState.isPaused ? 'Resume' : 'Pause'}
                  </Button>
                )}
                <Button
                  onClick={resetGame}
                  variant="ghost"
                  size="sm"
                  className="px-2"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 bg-terminal">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full border border-terminal-border rounded cosmic-glow"
                style={{ backgroundColor: '#000011' }}
                tabIndex={0}
              />
            </div>

            {/* Controls */}
            <div className="border-t border-border p-3 bg-muted/50">
              <div className="text-xs text-muted-foreground text-center">
                Use <kbd className="px-1 py-0.5 bg-background rounded">←</kbd> <kbd className="px-1 py-0.5 bg-background rounded">→</kbd> or <kbd className="px-1 py-0.5 bg-background rounded">A</kbd> <kbd className="px-1 py-0.5 bg-background rounded">D</kbd> to move • <kbd className="px-1 py-0.5 bg-background rounded">Space</kbd> to shoot
              </div>
            </div>
          </div>
        </div>

        {/* Game Stats */}
        <div className="space-y-4">
          {/* Current Game */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">game_stats.json</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="text-xs space-y-1">
                <div className="text-muted-foreground">// Current Game</div>
                <div className="flex justify-between">
                  <span className="syntax-keyword">score</span>:
                  <span className="syntax-number">{gameState.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="syntax-keyword">lives</span>:
                  <span className="syntax-number">{gameState.lives}</span>
                </div>
                <div className="flex justify-between">
                  <span className="syntax-keyword">level</span>:
                  <span className="syntax-number">{gameState.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="syntax-keyword">aliens_remaining</span>:
                  <span className="syntax-number">{aliens.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="syntax-keyword">high_score</span>:
                  <span className="syntax-number">{gameState.highScore}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Status */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">status.log</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  gameState.isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`} />
                <span>Status: {
                  !gameState.isPlaying ? 'Ready' :
                  gameState.isPaused ? 'Paused' : 'Playing'
                }</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <Heart className="w-3 h-3 text-red-400" />
                <span>Lives: {gameState.lives}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <Target className="w-3 h-3 text-yellow-400" />
                <span>Aliens: {aliens.length}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <Zap className="w-3 h-3 text-blue-400" />
                <span>Bullets: {bullets.length}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">instructions.md</span>
            </div>
            <div className="p-3 text-xs space-y-2 text-muted-foreground">
              <div><strong>🎮 How to Play:</strong></div>
              <div>• Move with arrow keys or A/D</div>
              <div>• Press SPACE to shoot</div>
              <div>• Destroy all aliens to advance</div>
              <div>• Collect blue powerups for bonus points</div>
              <div>• Avoid alien bullets</div>
              
              <div className="pt-2 border-t border-border">
                <div><strong>🏆 Scoring:</strong></div>
                <div>• Alien destroyed: +10 points</div>
                <div>• Powerup collected: +50 points</div>
                <div>• Level completed: +100 × level</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">achievements.json</span>
            </div>
            <div className="p-3 space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <Trophy className="w-3 h-3 text-yellow-400" />
                <span>High Score: {gameState.highScore}</span>
              </div>
              {gameState.score > 500 && (
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-3 h-3" />
                  <span>Space Defender</span>
                </div>
              )}
              {gameState.level > 3 && (
                <div className="flex items-center gap-2 text-blue-400">
                  <Rocket className="w-3 h-3" />
                  <span>Level Master</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpaceInvadersGame;