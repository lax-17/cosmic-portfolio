import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, Target, Zap, Brain, Settings, Play, Pause, 
  RotateCcw, TrendingUp, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIAgent {
  id: string;
  name: string;
  type: 'pathfinding' | 'resource' | 'defense' | 'exploration';
  level: number;
  experience: number;
  accuracy: number;
  speed: number;
  energy: number;
  status: 'idle' | 'training' | 'deployed' | 'learning';
}

interface Mission {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  requiredAgents: string[];
  rewards: { experience: number; credits: number };
  status: 'available' | 'active' | 'completed' | 'failed';
  progress: number;
}

interface SpaceObject {
  id: string;
  x: number;
  y: number;
  type: 'asteroid' | 'planet' | 'station' | 'ship' | 'resource';
  value?: number;
  threat?: number;
}

const AISpaceMissionControl: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [spaceObjects, setSpaceObjects] = useState<SpaceObject[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'paused' | 'running'>('paused');
  const [credits, setCredits] = useState(1000);
  const [gameTime, setGameTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Initialize AI agents
    const initialAgents: AIAgent[] = [
      {
        id: 'pathfinder-1',
        name: 'Navigator AI',
        type: 'pathfinding',
        level: 1,
        experience: 0,
        accuracy: 0.7,
        speed: 0.8,
        energy: 100,
        status: 'idle'
      },
      {
        id: 'resource-1',
        name: 'Miner AI',
        type: 'resource',
        level: 1,
        experience: 0,
        accuracy: 0.6,
        speed: 0.5,
        energy: 100,
        status: 'idle'
      },
      {
        id: 'defense-1',
        name: 'Guardian AI',
        type: 'defense',
        level: 1,
        experience: 0,
        accuracy: 0.8,
        speed: 0.6,
        energy: 100,
        status: 'idle'
      }
    ];

    // Initialize missions
    const initialMissions: Mission[] = [
      {
        id: 'asteroid-mining',
        name: 'Asteroid Mining Operation',
        description: 'Deploy AI agents to mine valuable resources from nearby asteroids. Requires pathfinding and resource extraction algorithms.',
        difficulty: 'easy',
        requiredAgents: ['pathfinding', 'resource'],
        rewards: { experience: 50, credits: 200 },
        status: 'available',
        progress: 0
      },
      {
        id: 'planet-exploration',
        name: 'Planet Surface Exploration',
        description: 'Use reinforcement learning agents to explore unknown planet surfaces and map terrain features.',
        difficulty: 'medium',
        requiredAgents: ['pathfinding', 'exploration'],
        rewards: { experience: 100, credits: 400 },
        status: 'available',
        progress: 0
      },
      {
        id: 'defense-protocol',
        name: 'Space Station Defense',
        description: 'Train neural networks to detect and neutralize incoming threats using computer vision and decision trees.',
        difficulty: 'hard',
        requiredAgents: ['defense', 'pathfinding'],
        rewards: { experience: 200, credits: 800 },
        status: 'available',
        progress: 0
      }
    ];

    // Initialize space objects
    const initialSpaceObjects: SpaceObject[] = [
      { id: 'station-1', x: 400, y: 300, type: 'station' },
      { id: 'asteroid-1', x: 200, y: 150, type: 'asteroid', value: 100 },
      { id: 'asteroid-2', x: 600, y: 200, type: 'asteroid', value: 150 },
      { id: 'planet-1', x: 100, y: 400, type: 'planet' },
      { id: 'resource-1', x: 500, y: 100, type: 'resource', value: 200 },
    ];

    setAgents(initialAgents);
    setMissions(initialMissions);
    setSpaceObjects(initialSpaceObjects);
  };

  // Game loop
  useEffect(() => {
    if (gameState === 'running') {
      const gameLoop = () => {
        setGameTime(prev => prev + 1);
        updateAgents();
        updateMissions();
        drawSpace();
        animationRef.current = requestAnimationFrame(gameLoop);
      };
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]);

  const updateAgents = () => {
    setAgents(prev => prev.map(agent => {
      if (agent.status === 'training') {
        // Simulate AI training with learning curves
        const learningRate = 0.01;
        const newAccuracy = Math.min(0.99, agent.accuracy + learningRate * (1 - agent.accuracy));
        const newExperience = agent.experience + 1;
        
        return {
          ...agent,
          accuracy: newAccuracy,
          experience: newExperience,
          level: Math.floor(newExperience / 100) + 1
        };
      }
      return agent;
    }));
  };

  const updateMissions = () => {
    if (activeMission) {
      setMissions(prev => prev.map(mission => {
        if (mission.id === activeMission && mission.status === 'active') {
          const newProgress = Math.min(100, mission.progress + Math.random() * 2);
          
          if (newProgress >= 100) {
            // Mission completed
            setCredits(prevCredits => prevCredits + mission.rewards.credits);
            setAgents(prevAgents => prevAgents.map(agent => ({
              ...agent,
              experience: agent.experience + mission.rewards.experience / prevAgents.length,
              status: 'idle' as const
            })));
            
            return { ...mission, status: 'completed' as const, progress: 100 };
          }
          
          return { ...mission, progress: newProgress };
        }
        return mission;
      }));
    }
  };

  const drawSpace = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % canvas.width;
      const y = (i * 73) % canvas.height;
      const brightness = Math.sin(gameTime * 0.01 + i) * 0.5 + 0.5;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.8})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Draw space objects
    spaceObjects.forEach(obj => {
      ctx.save();
      ctx.translate(obj.x, obj.y);

      switch (obj.type) {
        case 'station':
          ctx.fillStyle = '#00ff88';
          ctx.fillRect(-15, -15, 30, 30);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-10, -10, 20, 20);
          break;
        
        case 'asteroid':
          ctx.fillStyle = '#888888';
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.fill();
          break;
        
        case 'planet':
          ctx.fillStyle = '#4488ff';
          ctx.beginPath();
          ctx.arc(0, 0, 20, 0, Math.PI * 2);
          ctx.fill();
          break;
        
        case 'resource':
          ctx.fillStyle = '#ffaa00';
          ctx.beginPath();
          ctx.arc(0, 0, 8, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      ctx.restore();
    });

    // Draw AI agents if deployed
    agents.forEach((agent, index) => {
      if (agent.status === 'deployed') {
        const x = 100 + index * 50 + Math.sin(gameTime * 0.02 + index) * 20;
        const y = 100 + Math.cos(gameTime * 0.02 + index) * 20;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Agent representation
        ctx.fillStyle = agent.type === 'pathfinding' ? '#00ff88' :
                       agent.type === 'resource' ? '#ffaa00' :
                       agent.type === 'defense' ? '#ff0088' : '#0088ff';
        
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Agent trail
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        
        ctx.restore();
      }
    });
  };

  const trainAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'training' }
        : agent
    ));
  };

  const deployAgent = (agentId: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: 'deployed' }
        : agent
    ));
  };

  const startMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    // Check if required agents are available
    const availableAgentTypes = agents
      .filter(agent => agent.status === 'idle')
      .map(agent => agent.type);
    
    const hasRequiredAgents = mission.requiredAgents.every(required => 
      availableAgentTypes.includes(required as any)
    );

    if (hasRequiredAgents) {
      setActiveMission(missionId);
      setMissions(prev => prev.map(m => 
        m.id === missionId 
          ? { ...m, status: 'active', progress: 0 }
          : m
      ));
      
      // Deploy required agents
      mission.requiredAgents.forEach(requiredType => {
        const agent = agents.find(a => a.type === requiredType && a.status === 'idle');
        if (agent) {
          deployAgent(agent.id);
        }
      });
    }
  };

  const resetGame = () => {
    setGameState('paused');
    setActiveMission(null);
    setGameTime(0);
    setCredits(1000);
    initializeGame();
  };

  const getAgentTypeColor = (type: string) => {
    switch (type) {
      case 'pathfinding': return '#00ff88';
      case 'resource': return '#ffaa00';
      case 'defense': return '#ff0088';
      case 'exploration': return '#0088ff';
      default: return '#ffffff';
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'pathfinding': return <Target className="w-4 h-4" />;
      case 'resource': return <Zap className="w-4 h-4" />;
      case 'defense': return <AlertTriangle className="w-4 h-4" />;
      case 'exploration': return <Rocket className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/space-mission $ python ai_mission_control.py --neural-agents
      </div>

      {/* Game Controls */}
      <div className="code-panel mb-4">
        <div className="code-header flex justify-between items-center">
          <span className="text-xs cosmic-text">mission_control.py</span>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              Credits: {credits} | Time: {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
            </div>
            <Button
              onClick={() => setGameState(gameState === 'running' ? 'paused' : 'running')}
              size="sm"
              className="flex items-center gap-2"
            >
              {gameState === 'running' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {gameState === 'running' ? 'Pause' : 'Start'}
            </Button>
            <Button
              onClick={resetGame}
              variant="ghost"
              size="sm"
              className="px-2"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Space Visualization */}
        <div className="lg:col-span-2">
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">space_radar.canvas</span>
            </div>
            <div className="p-4 bg-terminal">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full border border-terminal-border rounded cosmic-glow"
                style={{ backgroundColor: '#000011' }}
              />
            </div>
          </div>

          {/* Missions */}
          <div className="code-panel mt-4">
            <div className="code-header">
              <span className="text-xs cosmic-text">available_missions.json</span>
            </div>
            <div className="p-4 space-y-3">
              {missions.map(mission => (
                <motion.div
                  key={mission.id}
                  className={`p-3 rounded border transition-all ${
                    mission.status === 'active' ? 'border-primary bg-primary/10' :
                    mission.status === 'completed' ? 'border-green-500 bg-green-500/10' :
                    'border-border hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{mission.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        mission.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                        mission.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {mission.difficulty}
                      </span>
                      {mission.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{mission.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs">
                      Requires: {mission.requiredAgents.join(', ')}
                    </div>
                    <div className="flex items-center gap-2">
                      {mission.status === 'active' && (
                        <div className="text-xs text-primary">
                          Progress: {Math.round(mission.progress)}%
                        </div>
                      )}
                      {mission.status === 'available' && (
                        <Button
                          onClick={() => startMission(mission.id)}
                          size="sm"
                          className="text-xs"
                        >
                          Start Mission
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {mission.status === 'active' && (
                    <div className="mt-2 w-full bg-muted rounded-full h-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Agents Panel */}
        <div className="space-y-4">
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">ai_agents.py</span>
            </div>
            <div className="p-3 space-y-3">
              {agents.map(agent => (
                <motion.div
                  key={agent.id}
                  className={`p-3 rounded border cursor-pointer transition-all ${
                    selectedAgent === agent.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div style={{ color: getAgentTypeColor(agent.type) }}>
                      {getAgentTypeIcon(agent.type)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">Level {agent.level} {agent.type}</div>
                    </div>
                    <div className={`ml-auto w-2 h-2 rounded-full ${
                      agent.status === 'idle' ? 'bg-gray-400' :
                      agent.status === 'training' ? 'bg-yellow-400 animate-pulse' :
                      agent.status === 'deployed' ? 'bg-green-400 animate-pulse' :
                      'bg-blue-400'
                    }`} />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span>{Math.round(agent.accuracy * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span>{agent.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{agent.status}</span>
                    </div>
                  </div>

                  {selectedAgent === agent.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-border"
                    >
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            trainAgent(agent.id);
                          }}
                          disabled={agent.status !== 'idle'}
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          <Brain className="w-3 h-3 mr-1" />
                          Train
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deployAgent(agent.id);
                          }}
                          disabled={agent.status !== 'idle'}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          <Rocket className="w-3 h-3 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Game Stats */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">game_stats.json</span>
            </div>
            <div className="p-3 space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Total Agents:</span>
                <span>{agents.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Missions:</span>
                <span>{missions.filter(m => m.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed Missions:</span>
                <span>{missions.filter(m => m.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Average Agent Level:</span>
                <span>{(agents.reduce((sum, agent) => sum + agent.level, 0) / agents.length).toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">instructions.md</span>
            </div>
            <div className="p-3 text-xs space-y-2 text-muted-foreground">
              <div>🚀 <strong>How to Play:</strong></div>
              <div>1. Train AI agents to improve their accuracy</div>
              <div>2. Deploy agents on space missions</div>
              <div>3. Complete missions to earn credits and experience</div>
              <div>4. Level up your AI agents for harder missions</div>
              <div className="pt-2 border-t border-border">
                <div>💡 <strong>AI Concepts Demonstrated:</strong></div>
                <div>• Reinforcement Learning (agent training)</div>
                <div>• Pathfinding Algorithms</div>
                <div>• Neural Network Accuracy</div>
                <div>• Multi-Agent Systems</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AISpaceMissionControl;