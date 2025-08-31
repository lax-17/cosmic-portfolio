import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, Zap, RotateCcw, Play, Pause, Square, 
  Settings, Activity, Cpu, Database, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Qubit {
  id: string;
  state: { alpha: number; beta: number }; // |0⟩ and |1⟩ amplitudes
  phase: number;
  entangled: string[];
  position: { x: number; y: number };
  isActive: boolean;
}

interface QuantumGate {
  id: string;
  name: string;
  type: 'single' | 'double';
  matrix: number[][];
  description: string;
  symbol: string;
}

interface QuantumCircuit {
  qubits: Qubit[];
  gates: { gate: QuantumGate; targets: string[]; step: number }[];
  measurements: { qubit: string; result: 0 | 1; probability: number }[];
}

const QuantumComputingVisualizer: React.FC = () => {
  const [circuit, setCircuit] = useState<QuantumCircuit>({ qubits: [], gates: [], measurements: [] });
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQubit, setSelectedQubit] = useState<string | null>(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const quantumGates: QuantumGate[] = useMemo(() => [
    {
      id: 'hadamard',
      name: 'Hadamard',
      type: 'single',
      matrix: [[1/Math.sqrt(2), 1/Math.sqrt(2)], [1/Math.sqrt(2), -1/Math.sqrt(2)]],
      description: 'Creates superposition - equal probability of |0⟩ and |1⟩',
      symbol: 'H'
    },
    {
      id: 'pauli-x',
      name: 'Pauli-X',
      type: 'single',
      matrix: [[0, 1], [1, 0]],
      description: 'Quantum NOT gate - flips |0⟩ to |1⟩ and vice versa',
      symbol: 'X'
    },
    {
      id: 'pauli-y',
      name: 'Pauli-Y',
      type: 'single',
      matrix: [[0, -1], [1, 0]],
      description: 'Rotation around Y-axis with phase flip',
      symbol: 'Y'
    },
    {
      id: 'pauli-z',
      name: 'Pauli-Z',
      type: 'single',
      matrix: [[1, 0], [0, -1]],
      description: 'Phase flip gate - adds π phase to |1⟩',
      symbol: 'Z'
    },
    {
      id: 'cnot',
      name: 'CNOT',
      type: 'double',
      matrix: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]],
      description: 'Controlled NOT - flips target if control is |1⟩',
      symbol: '⊕'
    },
    {
      id: 'phase',
      name: 'Phase',
      type: 'single',
      matrix: [[1, 0], [0, Math.cos(Math.PI/4) + Math.sin(Math.PI/4)]],
      description: 'Adds phase rotation to |1⟩ state',
      symbol: 'S'
    }
  ], []);

  const initializeCircuit = () => {
    const qubits: Qubit[] = Array.from({ length: 4 }, (_, i) => ({
      id: `q${i}`,
      state: { alpha: 1, beta: 0 }, // Start in |0⟩ state
      phase: 0,
      entangled: [],
      position: { x: 100, y: 100 + i * 80 },
      isActive: false
    }));

    // Create a sample quantum circuit
    const gates = [
      { gate: quantumGates[0], targets: ['q0'], step: 0 }, // Hadamard on q0
      { gate: quantumGates[4], targets: ['q0', 'q1'], step: 1 }, // CNOT q0->q1
      { gate: quantumGates[0], targets: ['q2'], step: 2 }, // Hadamard on q2
      { gate: quantumGates[4], targets: ['q2', 'q3'], step: 3 }, // CNOT q2->q3
      { gate: quantumGates[1], targets: ['q1'], step: 4 }, // Pauli-X on q1
    ];

    setCircuit({ qubits, gates, measurements: [] });
    setCurrentStep(0);
  };

  const applyGate = (gate: QuantumGate, targetIds: string[]) => {
    setCircuit(prev => {
      const newQubits = [...prev.qubits];
      
      if (gate.type === 'single' && targetIds.length === 1) {
        const targetIndex = newQubits.findIndex(q => q.id === targetIds[0]);
        if (targetIndex !== -1) {
          const qubit = newQubits[targetIndex];
          const [a, b] = gate.matrix;
          
          // Apply matrix multiplication
          const newAlpha = a[0] * qubit.state.alpha + a[1] * qubit.state.beta;
          const newBeta = b[0] * qubit.state.alpha + b[1] * qubit.state.beta;
          
          newQubits[targetIndex] = {
            ...qubit,
            state: { alpha: newAlpha, beta: newBeta },
            isActive: true
          };
        }
      } else if (gate.type === 'double' && targetIds.length === 2) {
        // Simplified CNOT implementation
        const controlIndex = newQubits.findIndex(q => q.id === targetIds[0]);
        const targetIndex = newQubits.findIndex(q => q.id === targetIds[1]);
        
        if (controlIndex !== -1 && targetIndex !== -1) {
          const control = newQubits[controlIndex];
          const target = newQubits[targetIndex];
          
          // If control qubit has high probability of being |1⟩, flip target
          if (Math.abs(control.state.beta) > 0.5) {
            newQubits[targetIndex] = {
              ...target,
              state: { alpha: target.state.beta, beta: target.state.alpha },
              isActive: true
            };
          }
          
          // Mark both as entangled
          newQubits[controlIndex].entangled = [...new Set([...control.entangled, targetIds[1]])];
          newQubits[targetIndex].entangled = [...new Set([...target.entangled, targetIds[0]])];
        }
      }
      
      return { ...prev, qubits: newQubits };
    });
  };

  const measureQubit = (qubitId: string) => {
    setCircuit(prev => {
      const qubit = prev.qubits.find(q => q.id === qubitId);
      if (!qubit) return prev;
      
      const prob0 = Math.abs(qubit.state.alpha) ** 2;
      const prob1 = Math.abs(qubit.state.beta) ** 2;
      const result = Math.random() < prob0 ? 0 : 1;
      
      const newMeasurements = [
        ...prev.measurements,
        { qubit: qubitId, result: result as 0 | 1, probability: result === 0 ? prob0 : prob1 }
      ];
      
      // Collapse the qubit state
      const newQubits = prev.qubits.map(q => 
        q.id === qubitId 
          ? { ...q, state: result === 0 ? { alpha: 1, beta: 0 } : { alpha: 0, beta: 1 } }
          : q
      );
      
      return { ...prev, qubits: newQubits, measurements: newMeasurements };
    });
  };

  const runCircuit = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentStep(0);
    
    const executeStep = (step: number) => {
      if (step >= circuit.gates.length) {
        setIsRunning(false);
        return;
      }
      
      const gateOperation = circuit.gates[step];
      applyGate(gateOperation.gate, gateOperation.targets);
      setCurrentStep(step + 1);
      
      setTimeout(() => {
        executeStep(step + 1);
      }, 1000 / animationSpeed);
    };
    
    executeStep(0);
  };

  const resetCircuit = () => {
    setIsRunning(false);
    initializeCircuit();
  };

  const drawQuantumState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw qubits
    circuit.qubits.forEach((qubit, index) => {
      const x = 100;
      const y = 80 + index * 100;
      
      // Qubit circle
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fillStyle = qubit.isActive ? 'rgba(0, 255, 136, 0.3)' : 'rgba(100, 150, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = qubit.isActive ? '#00ff88' : '#6496ff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Qubit label
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(qubit.id, x, y + 5);

      // State vector visualization (Bloch sphere representation)
      const prob0 = Math.abs(qubit.state.alpha) ** 2;
      const prob1 = Math.abs(qubit.state.beta) ** 2;
      
      // |0⟩ probability bar
      ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
      ctx.fillRect(x + 50, y - 15, prob0 * 100, 10);
      
      // |1⟩ probability bar
      ctx.fillStyle = 'rgba(255, 0, 136, 0.8)';
      ctx.fillRect(x + 50, y + 5, prob1 * 100, 10);

      // Probability labels
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`|0⟩: ${(prob0 * 100).toFixed(1)}%`, x + 160, y - 5);
      ctx.fillText(`|1⟩: ${(prob1 * 100).toFixed(1)}%`, x + 160, y + 15);

      // Entanglement connections
      qubit.entangled.forEach(entangledId => {
        const entangledQubit = circuit.qubits.find(q => q.id === entangledId);
        if (entangledQubit) {
          const entangledIndex = circuit.qubits.indexOf(entangledQubit);
          const entangledY = 80 + entangledIndex * 100;
          
          ctx.beginPath();
          ctx.moveTo(x + 30, y);
          ctx.lineTo(x + 30, entangledY);
          ctx.strokeStyle = 'rgba(255, 0, 136, 0.5)';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    });

    // Draw circuit gates
    circuit.gates.forEach((gateOp, index) => {
      if (index < currentStep) {
        const x = 300 + index * 80;
        const targetY = 80 + circuit.qubits.findIndex(q => q.id === gateOp.targets[0]) * 100;
        
        // Gate box
        ctx.fillStyle = 'rgba(0, 136, 255, 0.3)';
        ctx.fillRect(x - 20, targetY - 20, 40, 40);
        ctx.strokeStyle = '#0088ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 20, targetY - 20, 40, 40);
        
        // Gate symbol
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px JetBrains Mono';
        ctx.textAlign = 'center';
        ctx.fillText(gateOp.gate.symbol, x, targetY + 5);
        
        // Control line for two-qubit gates
        if (gateOp.gate.type === 'double' && gateOp.targets.length === 2) {
          const controlY = 80 + circuit.qubits.findIndex(q => q.id === gateOp.targets[0]) * 100;
          const targetY2 = 80 + circuit.qubits.findIndex(q => q.id === gateOp.targets[1]) * 100;
          
          ctx.beginPath();
          ctx.moveTo(x, controlY);
          ctx.lineTo(x, targetY2);
          ctx.strokeStyle = '#0088ff';
          ctx.lineWidth = 3;
          ctx.stroke();
          
          // Control dot
          ctx.beginPath();
          ctx.arc(x, controlY, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#0088ff';
          ctx.fill();
        }
      }
    });

    // Draw measurements
    circuit.measurements.forEach((measurement, index) => {
      const qubitIndex = circuit.qubits.findIndex(q => q.id === measurement.qubit);
      const x = 600;
      const y = 80 + qubitIndex * 100;
      
      // Measurement box
      ctx.fillStyle = 'rgba(255, 136, 0, 0.3)';
      ctx.fillRect(x - 15, y - 15, 30, 30);
      ctx.strokeStyle = '#ff8800';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 15, y - 15, 30, 30);
      
      // Result
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(measurement.result.toString(), x, y + 5);
      
      // Probability
      ctx.font = '10px JetBrains Mono';
      ctx.fillText(`${(measurement.probability * 100).toFixed(1)}%`, x, y + 25);
    });
  };

  useEffect(() => {
    initializeCircuit();
  }, []);

  useEffect(() => {
    const animate = () => {
      drawQuantumState();
      
      // Reset active state after animation
      setTimeout(() => {
        setCircuit(prev => ({
          ...prev,
          qubits: prev.qubits.map(q => ({ ...q, isActive: false }))
        }));
      }, 500);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [circuit, currentStep]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/quantum $ python quantum_simulator.py --qubits 4 --visualize
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Quantum Circuit Visualization */}
        <div className="lg:col-span-3">
          <div className="code-panel">
            <div className="code-header flex justify-between items-center">
              <span className="text-xs cosmic-text">quantum_circuit.canvas</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={runCircuit}
                  disabled={isRunning}
                  className="px-2"
                >
                  <Play className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRunning(false)}
                  disabled={!isRunning}
                  className="px-2"
                >
                  <Pause className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCircuit}
                  className="px-2"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-2"
                >
                  <Settings className="w-4 h-4" />
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
                      <span className="text-xs">Animation Speed:</span>
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.5"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs w-8">{animationSpeed}x</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Click on qubits to measure their states. Gates are applied sequentially.
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 bg-terminal">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full border border-terminal-border rounded cosmic-glow"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  // Check if click is on a qubit
                  circuit.qubits.forEach((qubit, index) => {
                    const qubitX = 100;
                    const qubitY = 80 + index * 100;
                    const distance = Math.sqrt((x - qubitX) ** 2 + (y - qubitY) ** 2);
                    
                    if (distance < 30) {
                      measureQubit(qubit.id);
                    }
                  });
                }}
              />
            </div>

            {/* Status Bar */}
            <div className="border-t border-border p-3 bg-muted/50">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-primary" />
                    <span>Step: {currentStep} / {circuit.gates.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Atom className="w-3 h-3 text-accent" />
                    <span>Qubits: {circuit.qubits.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-secondary" />
                    <span>Status: {isRunning ? 'Running' : 'Ready'}</span>
                  </div>
                </div>
                <div className="text-muted-foreground">
                  Quantum Simulator v1.0
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          {/* Quantum Gates */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">quantum_gates.py</span>
            </div>
            <div className="p-3 space-y-2">
              {quantumGates.slice(0, 4).map(gate => (
                <motion.div
                  key={gate.id}
                  className="p-2 rounded border border-border hover:border-primary/50 cursor-pointer transition-all"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (selectedQubit) {
                      applyGate(gate, [selectedQubit]);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs font-mono">
                      {gate.symbol}
                    </div>
                    <span className="text-xs font-semibold">{gate.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{gate.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Qubit States */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">qubit_states.json</span>
            </div>
            <div className="p-3 space-y-2">
              {circuit.qubits.map(qubit => {
                const prob0 = Math.abs(qubit.state.alpha) ** 2;
                const prob1 = Math.abs(qubit.state.beta) ** 2;
                
                return (
                  <motion.div
                    key={qubit.id}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      selectedQubit === qubit.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedQubit(selectedQubit === qubit.id ? null : qubit.id)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{qubit.id}</span>
                      <div className="flex items-center gap-1">
                        {qubit.entangled.length > 0 && (
                          <span className="text-xs text-secondary">⟷</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            measureQubit(qubit.id);
                          }}
                          className="p-1 h-auto"
                        >
                          <Database className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-8">|0⟩:</span>
                        <div className="flex-1 bg-muted rounded-full h-1">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${prob0 * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-right">{(prob0 * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-8">|1⟩:</span>
                        <div className="flex-1 bg-muted rounded-full h-1">
                          <div
                            className="h-full bg-secondary rounded-full transition-all"
                            style={{ width: `${prob1 * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-right">{(prob1 * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Measurements */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">measurements.log</span>
            </div>
            <div className="p-3 space-y-1">
              {circuit.measurements.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  No measurements yet.
                  <br />Click on qubits to measure.
                </div>
              ) : (
                circuit.measurements.map((measurement, index) => (
                  <div key={index} className="text-xs font-mono">
                    <span className="text-primary">{measurement.qubit}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="text-accent">|{measurement.result}⟩</span>
                    <span className="text-muted-foreground"> ({(measurement.probability * 100).toFixed(1)}%)</span>
                  </div>
                ))
              )}
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
                onClick={() => {
                  circuit.qubits.forEach(qubit => measureQubit(qubit.id));
                }}
                className="w-full justify-start text-xs"
              >
                <Database className="w-3 h-3 mr-2" />
                Measure All Qubits
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  circuit.qubits.forEach(qubit => {
                    applyGate(quantumGates[0], [qubit.id]); // Apply Hadamard to all
                  });
                }}
                className="w-full justify-start text-xs"
              >
                <Atom className="w-3 h-3 mr-2" />
                Superposition All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetCircuit}
                className="w-full justify-start text-xs"
              >
                <RotateCcw className="w-3 h-3 mr-2" />
                Reset Circuit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuantumComputingVisualizer;