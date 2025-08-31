import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, Zap, Cpu, Network, Pause, Play, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataPacket {
  id: string;
  type: 'neural' | 'quantum' | 'binary' | 'cosmic';
  data: string;
  timestamp: number;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  size: number;
  color: string;
  opacity: number;
}

interface DataStream {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'output';
  rate: number; // packets per second
  active: boolean;
  color: string;
}

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  type: 'input' | 'processor' | 'output' | 'storage';
  connections: string[];
  activity: number; // 0-1
  label: string;
}

const CosmicDataStreamVisualizer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [packets, setPackets] = useState<DataPacket[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [streamIntensity, setStreamIntensity] = useState(50);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  const dataStreams: DataStream[] = [
    {
      id: 'neural-input',
      name: 'Neural Input Stream',
      type: 'input',
      rate: 2,
      active: true,
      color: 'hsl(var(--neural-green))'
    },
    {
      id: 'quantum-processing',
      name: 'Quantum Processing',
      type: 'processing',
      rate: 1.5,
      active: true,
      color: 'hsl(var(--neural-blue))'
    },
    {
      id: 'cosmic-output',
      name: 'Cosmic Output',
      type: 'output',
      rate: 1,
      active: true,
      color: 'hsl(var(--neural-pink))'
    },
    {
      id: 'binary-data',
      name: 'Binary Data Flow',
      type: 'processing',
      rate: 3,
      active: true,
      color: 'hsl(var(--muted))'
    }
  ];

  const networkNodes: NetworkNode[] = useMemo(() => [
    {
      id: 'input-1',
      x: 50,
      y: 150,
      type: 'input',
      connections: ['proc-1', 'proc-2'],
      activity: 0.8,
      label: 'Data Input'
    },
    {
      id: 'input-2',
      x: 50,
      y: 250,
      type: 'input',
      connections: ['proc-2', 'proc-3'],
      activity: 0.6,
      label: 'Neural Feed'
    },
    {
      id: 'proc-1',
      x: 200,
      y: 100,
      type: 'processor',
      connections: ['proc-4', 'storage-1'],
      activity: 0.9,
      label: 'Quantum CPU'
    },
    {
      id: 'proc-2',
      x: 200,
      y: 200,
      type: 'processor',
      connections: ['proc-4', 'proc-5'],
      activity: 0.7,
      label: 'Neural Core'
    },
    {
      id: 'proc-3',
      x: 200,
      y: 300,
      type: 'processor',
      connections: ['proc-5', 'storage-1'],
      activity: 0.5,
      label: 'Data Proc'
    },
    {
      id: 'proc-4',
      x: 350,
      y: 150,
      type: 'processor',
      connections: ['output-1'],
      activity: 0.8,
      label: 'Fusion Core'
    },
    {
      id: 'proc-5',
      x: 350,
      y: 250,
      type: 'processor',
      connections: ['output-2'],
      activity: 0.6,
      label: 'Logic Unit'
    },
    {
      id: 'storage-1',
      x: 275,
      y: 350,
      type: 'storage',
      connections: ['output-2'],
      activity: 0.4,
      label: 'Quantum Storage'
    },
    {
      id: 'output-1',
      x: 500,
      y: 150,
      type: 'output',
      connections: [],
      activity: 0.7,
      label: 'Primary Output'
    },
    {
      id: 'output-2',
      x: 500,
      y: 250,
      type: 'output',
      connections: [],
      activity: 0.5,
      label: 'Secondary Output'
    }
  ], []);

  const generateDataPacket = (stream: DataStream): DataPacket => {
    const packetTypes = {
      neural: ['∞', '∆', '∇', '∑', '∏', '∫', '∂', '∴', '∵', '∈'],
      quantum: ['⟨', '⟩', '⊗', '⊕', '⊙', '⊚', '⊛', '⊜', '⊝', '⊞'],
      binary: ['0', '1', '01', '10', '11', '00', '101', '010', '110', '001'],
      cosmic: ['★', '✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯']
    };

    const type = stream.id.includes('neural') ? 'neural' :
                 stream.id.includes('quantum') ? 'quantum' :
                 stream.id.includes('binary') ? 'binary' : 'cosmic';

    const dataOptions = packetTypes[type];
    const data = dataOptions[Math.floor(Math.random() * dataOptions.length)];

    return {
      id: `${stream.id}-${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
      x: Math.random() * 50,
      y: Math.random() * 400 + 50,
      velocity: {
        x: 0.5 + Math.random() * 1.5,
        y: (Math.random() - 0.5) * 0.5
      },
      size: 8 + Math.random() * 8,
      color: stream.color,
      opacity: 0.8 + Math.random() * 0.2
    };
  };

  const updatePackets = (deltaTime: number) => {
    setPackets(prevPackets => {
      let newPackets = [...prevPackets];

      // Generate new packets based on stream rates
      if (isRunning) {
        dataStreams.forEach(stream => {
          if (stream.active && Math.random() < (stream.rate * deltaTime * streamIntensity / 100)) {
            newPackets.push(generateDataPacket(stream));
          }
        });
      }

      // Update packet positions
      newPackets = newPackets.map(packet => ({
        ...packet,
        x: packet.x + packet.velocity.x * deltaTime * 60,
        y: packet.y + packet.velocity.y * deltaTime * 60,
        opacity: packet.opacity - deltaTime * 0.3
      }));

      // Remove packets that are off-screen or faded
      newPackets = newPackets.filter(packet => 
        packet.x < 600 && packet.opacity > 0
      );

      return newPackets;
    });
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw network connections
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.2)';
    ctx.lineWidth = 1;
    networkNodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = networkNodes.find(n => n.id === connectionId);
        if (targetNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();
        }
      });
    });

    // Draw network nodes
    networkNodes.forEach(node => {
      const nodeColors = {
        input: '#00ff88',
        processor: '#0088ff',
        output: '#ff0088',
        storage: '#ffaa00'
      };

      // Node glow effect
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 15);
      gradient.addColorStop(0, `${nodeColors[node.type]}${Math.floor(node.activity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Node core
      ctx.fillStyle = nodeColors[node.type];
      ctx.beginPath();
      ctx.arc(node.x, node.y, 4 + node.activity * 4, 0, Math.PI * 2);
      ctx.fill();

      // Activity pulse
      if (node.activity > 0.7) {
        ctx.strokeStyle = nodeColors[node.type];
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Draw data packets
    packets.forEach(packet => {
      ctx.save();
      ctx.globalAlpha = packet.opacity;
      
      // Packet glow
      const gradient = ctx.createRadialGradient(packet.x, packet.y, 0, packet.x, packet.y, packet.size);
      gradient.addColorStop(0, packet.color);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(packet.x, packet.y, packet.size, 0, Math.PI * 2);
      ctx.fill();

      // Packet data
      ctx.fillStyle = packet.color;
      ctx.font = `${packet.size}px JetBrains Mono`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(packet.data, packet.x, packet.y);
      
      ctx.restore();
    });

    // Draw data flow trails
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < packets.length - 1; i++) {
      const current = packets[i];
      const next = packets[i + 1];
      if (current.type === next.type && Math.abs(current.timestamp - next.timestamp) < 1000) {
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
    }
  };

  const animate = (currentTime: number) => {
    const deltaTime = (currentTime - lastTimeRef.current) / 1000;
    lastTimeRef.current = currentTime;

    if (deltaTime < 0.1) { // Cap delta time to prevent large jumps
      updatePackets(deltaTime);
      drawVisualization();
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, streamIntensity]);

  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      activePackets: packets.length,
      streams: dataStreams.map(stream => ({
        name: stream.name,
        type: stream.type,
        rate: stream.rate,
        active: stream.active
      })),
      networkNodes: networkNodes.map(node => ({
        id: node.id,
        type: node.type,
        activity: node.activity,
        label: node.label
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cosmic-data-stream.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/streams $ python cosmic_data_visualizer.py --real-time
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Visualization */}
        <div className="lg:col-span-3">
          <div className="code-panel">
            <div className="code-header flex justify-between items-center">
              <span className="text-xs cosmic-text">neural_data_stream.canvas</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-2"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-2"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportData}
                  className="px-2"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-b border-border p-4 bg-muted/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-xs">Stream Intensity:</span>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={streamIntensity}
                        onChange={(e) => setStreamIntensity(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs w-12">{streamIntensity}%</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {dataStreams.map(stream => (
                        <div key={stream.id} className="flex items-center gap-2 text-xs">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stream.color }}
                          />
                          <span className="flex-1">{stream.name}</span>
                          <span>{stream.rate}/s</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Canvas */}
            <div className="p-4 bg-terminal">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full border border-terminal-border rounded cosmic-glow"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
              />
            </div>

            {/* Status Bar */}
            <div className="border-t border-border p-3 bg-muted/50">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-primary" />
                    <span>Active Packets: {packets.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-accent" />
                    <span>Status: {isRunning ? 'Running' : 'Paused'}</span>
                  </div>
                </div>
                <div className="text-muted-foreground">
                  Neural Interface v2.1.0
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          {/* Stream Controls */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">stream_control.sh</span>
            </div>
            <div className="p-3 space-y-3">
              {dataStreams.map(stream => (
                <motion.div
                  key={stream.id}
                  className={`p-2 rounded border cursor-pointer transition-all ${
                    selectedStream === stream.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedStream(selectedStream === stream.id ? null : stream.id)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: stream.color }}
                    />
                    <span className="text-xs font-semibold">{stream.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Rate: {stream.rate} pkt/s | Type: {stream.type}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Network Status */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">network_status.json</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="text-xs space-y-1">
                <div className="text-muted-foreground">// Network Statistics</div>
                <div><span className="syntax-keyword">nodes</span>: <span className="syntax-number">{networkNodes.length}</span></div>
                <div><span className="syntax-keyword">active_streams</span>: <span className="syntax-number">{dataStreams.filter(s => s.active).length}</span></div>
                <div><span className="syntax-keyword">avg_activity</span>: <span className="syntax-number">
                  {Math.round(networkNodes.reduce((sum, node) => sum + node.activity, 0) / networkNodes.length * 100)}%
                </span></div>
                <div><span className="syntax-keyword">data_throughput</span>: <span className="syntax-number">{packets.length}</span> <span className="text-muted-foreground">packets</span></div>
              </div>

              <div className="border-t border-border pt-2 mt-2">
                <div className="text-muted-foreground text-xs mb-1">// Node Activity</div>
                {networkNodes.slice(0, 5).map(node => (
                  <div key={node.id} className="flex items-center gap-2 text-xs">
                    <div className="w-16 truncate">{node.label}</div>
                    <div className="flex-1 bg-muted rounded-full h-1">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${node.activity * 100}%`,
                          backgroundColor: node.activity > 0.7 ? 'hsl(var(--neural-green))' :
                                         node.activity > 0.4 ? 'hsl(var(--neural-blue))' :
                                         'hsl(var(--muted))'
                        }}
                      />
                    </div>
                    <span className="w-8 text-right">{Math.round(node.activity * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">actions.sh</span>
            </div>
            <div className="p-3 space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPackets([])}
                className="w-full justify-start text-xs"
              >
                <Database className="w-3 h-3 mr-2" />
                Clear Data Stream
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStreamIntensity(100)}
                className="w-full justify-start text-xs"
              >
                <Cpu className="w-3 h-3 mr-2" />
                Max Intensity
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={exportData}
                className="w-full justify-start text-xs"
              >
                <Network className="w-3 h-3 mr-2" />
                Export Network Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CosmicDataStreamVisualizer;