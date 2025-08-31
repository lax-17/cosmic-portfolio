import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Database, Network, Zap, Brain, Activity, 
  Code, Terminal, Layers, GitBranch, Star, Sparkles,
  ChevronRight, ExternalLink, Play, Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HolographicCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon: React.ReactNode;
  type: 'neural' | 'quantum' | 'data' | 'cosmic';
  stats?: { label: string; value: string; trend?: 'up' | 'down' | 'stable' }[];
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'secondary' }[];
  isActive?: boolean;
  glowIntensity?: number;
  children?: React.ReactNode;
}

interface DataPoint {
  timestamp: number;
  value: number;
}

const HolographicCard: React.FC<HolographicCardProps> = ({
  title,
  subtitle,
  description,
  icon,
  type,
  stats = [],
  actions = [],
  isActive = false,
  glowIntensity = 0.5,
  children
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const typeColors = {
    neural: {
      primary: 'hsl(var(--neural-green))',
      secondary: 'hsl(var(--neural-blue))',
      accent: 'rgba(0, 255, 136, 0.2)'
    },
    quantum: {
      primary: 'hsl(var(--neural-blue))',
      secondary: 'hsl(var(--neural-pink))',
      accent: 'rgba(0, 136, 255, 0.2)'
    },
    data: {
      primary: 'hsl(var(--neural-pink))',
      secondary: 'hsl(var(--neural-green))',
      accent: 'rgba(255, 0, 136, 0.2)'
    },
    cosmic: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--accent))',
      accent: 'rgba(100, 150, 255, 0.2)'
    }
  };

  const colors = typeColors[type];

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, z: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Holographic Glow Effect */}
      <div
        className="absolute inset-0 rounded-lg opacity-30 blur-xl transition-all duration-500"
        style={{
          background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
          transform: `scale(${isHovered ? 1.1 : 1})`,
          opacity: isActive ? 0.6 : isHovered ? 0.4 : 0.2
        }}
      />

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5 opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            boxShadow: `0 0 10px ${colors.primary}`
          }}
          animate={{
            y: isHovered ? [0, 200, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "linear"
          }}
        />
      </div>

      {/* Main Card */}
      <div
        className="relative bg-background/80 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300"
        style={{
          borderColor: isActive ? colors.primary : 'hsl(var(--border))',
          boxShadow: isActive 
            ? `0 0 20px ${colors.accent}, inset 0 0 20px ${colors.accent}`
            : isHovered 
            ? `0 0 15px ${colors.accent}`
            : 'none'
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.accent }}
              animate={isActive ? {
                boxShadow: [
                  `0 0 10px ${colors.primary}`,
                  `0 0 20px ${colors.primary}`,
                  `0 0 10px ${colors.primary}`
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div style={{ color: colors.primary }}>
                {icon}
              </div>
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold cosmic-text" style={{ color: colors.primary }}>
                {title}
              </h3>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Status Indicator */}
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.primary }}
            animate={isActive ? {
              opacity: [1, 0.3, 1],
              scale: [1, 1.2, 1]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-2 rounded border"
                style={{ borderColor: colors.accent }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xs text-muted-foreground">{stat.label}</div>
                <div className="text-lg font-mono font-semibold" style={{ color: colors.primary }}>
                  {stat.value}
                </div>
                {stat.trend && (
                  <div className={`text-xs ${
                    stat.trend === 'up' ? 'text-green-400' :
                    stat.trend === 'down' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {stat.trend === 'up' ? '↗' : stat.trend === 'down' ? '↘' : '→'}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Custom Content */}
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant === 'primary' ? 'default' : 'outline'}
                size="sm"
                onClick={action.onClick}
                className="text-xs"
                style={action.variant === 'primary' ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                  color: 'black'
                } : {
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                {action.label}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            ))}
          </div>
        )}

        {/* Corner Decorations */}
        <div className="absolute top-2 right-2 w-4 h-4">
          <div
            className="absolute top-0 right-0 w-2 h-0.5"
            style={{ backgroundColor: colors.primary, opacity: 0.6 }}
          />
          <div
            className="absolute top-0 right-0 w-0.5 h-2"
            style={{ backgroundColor: colors.primary, opacity: 0.6 }}
          />
        </div>
        <div className="absolute bottom-2 left-2 w-4 h-4">
          <div
            className="absolute bottom-0 left-0 w-2 h-0.5"
            style={{ backgroundColor: colors.primary, opacity: 0.6 }}
          />
          <div
            className="absolute bottom-0 left-0 w-0.5 h-2"
            style={{ backgroundColor: colors.primary, opacity: 0.6 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

const MiniChart: React.FC<{ data: DataPoint[]; color: string }> = ({ data, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = (index / (data.length - 1)) * canvas.width;
      const y = canvas.height - ((point.value - minValue) / range) * canvas.height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Add glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 5;
    ctx.stroke();
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={40}
      className="w-full h-10"
    />
  );
};

const HolographicUICards: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string | null>('neural-core');
  const [systemStatus, setSystemStatus] = useState<'online' | 'processing' | 'offline'>('online');

  // Generate sample data for charts
  const generateChartData = (points: number = 20): DataPoint[] => {
    return Array.from({ length: points }, (_, i) => ({
      timestamp: Date.now() - (points - i) * 1000,
      value: Math.sin(i * 0.3) * 50 + 50 + Math.random() * 20
    }));
  };

  const cards = [
    {
      id: 'neural-core',
      title: 'Neural Core',
      subtitle: 'Primary Processing Unit',
      description: 'Advanced neural processing system with quantum-enhanced capabilities for real-time AI computations.',
      icon: <Brain className="w-5 h-5" />,
      type: 'neural' as const,
      stats: [
        { label: 'CPU Usage', value: '87%', trend: 'up' as const },
        { label: 'Memory', value: '12.4GB', trend: 'stable' as const },
        { label: 'Throughput', value: '2.3K/s', trend: 'up' as const },
        { label: 'Latency', value: '0.8ms', trend: 'down' as const }
      ],
      actions: [
        { label: 'Monitor', onClick: () => console.log('Monitor neural core'), variant: 'primary' as const },
        { label: 'Configure', onClick: () => console.log('Configure neural core') }
      ]
    },
    {
      id: 'quantum-processor',
      title: 'Quantum Processor',
      subtitle: 'Quantum Computing Module',
      description: 'Quantum processing unit for complex calculations and cryptographic operations with superposition capabilities.',
      icon: <Zap className="w-5 h-5" />,
      type: 'quantum' as const,
      stats: [
        { label: 'Qubits', value: '256', trend: 'stable' as const },
        { label: 'Coherence', value: '99.7%', trend: 'up' as const },
        { label: 'Entanglement', value: '94.2%', trend: 'stable' as const },
        { label: 'Error Rate', value: '0.03%', trend: 'down' as const }
      ],
      actions: [
        { label: 'Calibrate', onClick: () => console.log('Calibrate quantum processor'), variant: 'primary' as const },
        { label: 'Test', onClick: () => console.log('Test quantum processor') }
      ]
    },
    {
      id: 'data-matrix',
      title: 'Data Matrix',
      subtitle: 'Information Storage Grid',
      description: 'Multidimensional data storage and retrieval system with real-time indexing and quantum encryption.',
      icon: <Database className="w-5 h-5" />,
      type: 'data' as const,
      stats: [
        { label: 'Storage', value: '847TB', trend: 'up' as const },
        { label: 'Read Speed', value: '15GB/s', trend: 'stable' as const },
        { label: 'Write Speed', value: '12GB/s', trend: 'up' as const },
        { label: 'Integrity', value: '100%', trend: 'stable' as const }
      ],
      actions: [
        { label: 'Analyze', onClick: () => console.log('Analyze data matrix'), variant: 'primary' as const },
        { label: 'Backup', onClick: () => console.log('Backup data matrix') }
      ]
    },
    {
      id: 'cosmic-network',
      title: 'Cosmic Network',
      subtitle: 'Interstellar Communication Hub',
      description: 'Advanced communication network spanning multiple dimensions with quantum entanglement protocols.',
      icon: <Network className="w-5 h-5" />,
      type: 'cosmic' as const,
      stats: [
        { label: 'Nodes', value: '1,247', trend: 'up' as const },
        { label: 'Bandwidth', value: '∞ TB/s', trend: 'stable' as const },
        { label: 'Latency', value: '0.001ms', trend: 'down' as const },
        { label: 'Uptime', value: '99.99%', trend: 'stable' as const }
      ],
      actions: [
        { label: 'Connect', onClick: () => console.log('Connect to cosmic network'), variant: 'primary' as const },
        { label: 'Scan', onClick: () => console.log('Scan cosmic network') }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/holographic $ python ui_cards.py --render --interactive
      </div>

      {/* System Status Bar */}
      <div className="mb-6 p-4 rounded-lg border border-primary/30 bg-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-primary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-mono">System Status: {systemStatus.toUpperCase()}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Holographic Interface v3.0 | Neural Sync: Active
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSystemStatus(systemStatus === 'online' ? 'processing' : 'online')}
            >
              {systemStatus === 'online' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="text-xs text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {cards.map((card) => (
          <HolographicCard
            key={card.id}
            title={card.title}
            subtitle={card.subtitle}
            description={card.description}
            icon={card.icon}
            type={card.type}
            stats={card.stats}
            actions={card.actions}
            isActive={activeCard === card.id}
            glowIntensity={activeCard === card.id ? 1 : 0.5}
          >
            {/* Mini performance chart */}
            <div className="mb-2">
              <div className="text-xs text-muted-foreground mb-1">Performance Graph</div>
              <MiniChart 
                data={generateChartData()} 
                color={card.type === 'neural' ? 'hsl(var(--neural-green))' :
                       card.type === 'quantum' ? 'hsl(var(--neural-blue))' :
                       card.type === 'data' ? 'hsl(var(--neural-pink))' :
                       'hsl(var(--primary))'} 
              />
            </div>
          </HolographicCard>
        ))}
      </div>

      {/* Interactive Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <HolographicCard
            title="System Overview"
            subtitle="Holographic Interface Dashboard"
            description="Real-time monitoring and control interface for all connected systems and modules."
            icon={<Activity className="w-5 h-5" />}
            type="cosmic"
            isActive={true}
          >
            <div className="grid grid-cols-4 gap-4 mb-4">
              {cards.map((card, index) => (
                <motion.button
                  key={card.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    activeCard === card.id 
                      ? 'border-primary bg-primary/10 text-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setActiveCard(activeCard === card.id ? null : card.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="mb-2">{card.icon}</div>
                  <div className="text-xs font-semibold">{card.title}</div>
                </motion.button>
              ))}
            </div>
            
            <div className="text-xs text-muted-foreground">
              Click on system modules to activate holographic monitoring mode.
            </div>
          </HolographicCard>
        </div>

        <div className="space-y-4">
          <HolographicCard
            title="Quick Actions"
            description="Rapid system control and diagnostic tools."
            icon={<Terminal className="w-5 h-5" />}
            type="neural"
            actions={[
              { label: 'System Scan', onClick: () => console.log('System scan'), variant: 'primary' },
              { label: 'Diagnostics', onClick: () => console.log('Diagnostics') },
              { label: 'Optimize', onClick: () => console.log('Optimize') }
            ]}
          />

          <HolographicCard
            title="Network Status"
            description="Cosmic network connectivity and performance metrics."
            icon={<Sparkles className="w-5 h-5" />}
            type="cosmic"
            stats={[
              { label: 'Connections', value: '∞', trend: 'stable' },
              { label: 'Sync Rate', value: '100%', trend: 'up' }
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HolographicUICards;