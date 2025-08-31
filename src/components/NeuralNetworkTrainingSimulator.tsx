import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, RotateCcw, Settings, TrendingUp, Brain, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
  learningRate: number;
  timestamp: number;
}

interface NetworkLayer {
  id: string;
  type: 'input' | 'hidden' | 'output';
  neurons: number;
  activation: string;
  weights: number[][];
  biases: number[];
  activations: number[];
}

interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: 'adam' | 'sgd' | 'rmsprop';
  architecture: number[];
}

const NeuralNetworkTrainingSimulator: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [trainingHistory, setTrainingHistory] = useState<TrainingMetrics[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<TrainingConfig>({
    epochs: 100,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: 'adam',
    architecture: [784, 128, 64, 10]
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const trainingIntervalRef = useRef<NodeJS.Timeout>();

  const networkLayers: NetworkLayer[] = useMemo(() => {
    return config.architecture.map((neurons, index) => ({
      id: `layer-${index}`,
      type: index === 0 ? 'input' : index === config.architecture.length - 1 ? 'output' : 'hidden',
      neurons,
      activation: index === 0 ? 'linear' : index === config.architecture.length - 1 ? 'softmax' : 'relu',
      weights: Array(neurons).fill(0).map(() => 
        Array(config.architecture[index + 1] || neurons).fill(0).map(() => 
          (Math.random() - 0.5) * 2
        )
      ),
      biases: Array(neurons).fill(0).map(() => (Math.random() - 0.5) * 2),
      activations: Array(neurons).fill(0).map(() => Math.random())
    }));
  }, [config.architecture]);

  const generateTrainingData = (): TrainingMetrics => {
    const epoch = currentEpoch;
    const progress = Math.min(epoch / config.epochs, 1);
    
    // Simulate realistic training curves
    const baseLoss = 2.3; // Starting cross-entropy loss
    const targetLoss = 0.1;
    const lossDecay = Math.exp(-progress * 3);
    const loss = targetLoss + (baseLoss - targetLoss) * lossDecay + (Math.random() - 0.5) * 0.1;
    
    const baseAccuracy = 0.1; // Random chance for 10 classes
    const targetAccuracy = 0.95;
    const accuracy = baseAccuracy + (targetAccuracy - baseAccuracy) * (1 - Math.exp(-progress * 2.5)) + (Math.random() - 0.5) * 0.05;
    
    // Validation metrics (slightly worse than training)
    const valLoss = loss * (1.1 + Math.random() * 0.2);
    const valAccuracy = accuracy * (0.9 + Math.random() * 0.1);
    
    // Learning rate decay
    const learningRate = config.learningRate * Math.pow(0.95, Math.floor(epoch / 10));

    return {
      epoch,
      loss: Math.max(0, loss),
      accuracy: Math.min(1, Math.max(0, accuracy)),
      valLoss: Math.max(0, valLoss),
      valAccuracy: Math.min(1, Math.max(0, valAccuracy)),
      learningRate,
      timestamp: Date.now()
    };
  };

  const updateNetworkActivations = () => {
    // Simulate forward pass with random activations
    networkLayers.forEach((layer, layerIndex) => {
      layer.activations = layer.activations.map((_, neuronIndex) => {
        if (layerIndex === 0) {
          // Input layer - simulate input data
          return Math.random();
        } else {
          // Hidden/output layers - simulate activation based on previous layer
          const prevLayer = networkLayers[layerIndex - 1];
          let activation = 0;
          prevLayer.activations.forEach((prevActivation, prevIndex) => {
            if (prevLayer.weights[prevIndex] && prevLayer.weights[prevIndex][neuronIndex] !== undefined) {
              activation += prevActivation * prevLayer.weights[prevIndex][neuronIndex];
            }
          });
          activation += layer.biases[neuronIndex];
          
          // Apply activation function
          switch (layer.activation) {
            case 'relu':
              return Math.max(0, activation);
            case 'sigmoid':
              return 1 / (1 + Math.exp(-activation));
            case 'softmax':
              return Math.exp(activation); // Simplified, would need normalization
            default:
              return activation;
          }
        }
      });
    });
  };

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const layerSpacing = canvas.width / (networkLayers.length + 1);
    const maxNeurons = Math.max(...networkLayers.map(l => l.neurons));

    networkLayers.forEach((layer, layerIndex) => {
      const x = layerSpacing * (layerIndex + 1);
      const neuronSpacing = canvas.height / (layer.neurons + 1);

      // Draw connections to next layer
      if (layerIndex < networkLayers.length - 1) {
        const nextLayer = networkLayers[layerIndex + 1];
        const nextX = layerSpacing * (layerIndex + 2);
        const nextNeuronSpacing = canvas.height / (nextLayer.neurons + 1);

        layer.activations.forEach((activation, neuronIndex) => {
          const y = neuronSpacing * (neuronIndex + 1);
          
          nextLayer.activations.forEach((_, nextNeuronIndex) => {
            const nextY = nextNeuronSpacing * (nextNeuronIndex + 1);
            
            if (layer.weights[neuronIndex] && layer.weights[neuronIndex][nextNeuronIndex] !== undefined) {
              const weight = layer.weights[neuronIndex][nextNeuronIndex];
              const opacity = Math.min(1, Math.abs(weight) * activation);
              
              ctx.strokeStyle = weight > 0 
                ? `rgba(0, 255, 136, ${opacity * 0.3})` 
                : `rgba(255, 0, 136, ${opacity * 0.3})`;
              ctx.lineWidth = Math.abs(weight) * 2;
              
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(nextX, nextY);
              ctx.stroke();
            }
          });
        });
      }

      // Draw neurons
      layer.activations.forEach((activation, neuronIndex) => {
        const y = neuronSpacing * (neuronIndex + 1);
        const radius = 8 + activation * 8;

        // Neuron glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        const color = layer.type === 'input' ? '0, 255, 136' : 
                     layer.type === 'output' ? '255, 0, 136' : '0, 136, 255';
        
        gradient.addColorStop(0, `rgba(${color}, ${activation})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        ctx.fill();

        // Neuron core
        ctx.fillStyle = `rgba(${color}, ${0.8 + activation * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Activation pulse
        if (activation > 0.7) {
          ctx.strokeStyle = `rgba(${color}, 0.6)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, radius + Math.sin(Date.now() * 0.01 + neuronIndex) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Layer labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '12px JetBrains Mono';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${layer.type.toUpperCase()} (${layer.neurons})`,
        x,
        canvas.height - 10
      );
    });
  };

  const drawTrainingChart = () => {
    const canvas = chartCanvasRef.current;
    if (!canvas || trainingHistory.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 1; i < 5; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    if (trainingHistory.length === 0) return;

    const maxEpoch = Math.max(...trainingHistory.map(m => m.epoch));
    const maxLoss = Math.max(...trainingHistory.map(m => Math.max(m.loss, m.valLoss)));

    // Draw loss curves
    const drawCurve = (data: number[], color: string, label: string) => {
      if (data.length < 2) return;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      data.forEach((value, index) => {
        const x = padding + (chartWidth / Math.max(1, data.length - 1)) * index;
        const y = canvas.height - padding - (value / maxLoss) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Draw points
      ctx.fillStyle = color;
      data.forEach((value, index) => {
        const x = padding + (chartWidth / Math.max(1, data.length - 1)) * index;
        const y = canvas.height - padding - (value / maxLoss) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    drawCurve(trainingHistory.map(m => m.loss), 'rgba(0, 255, 136, 0.8)', 'Training Loss');
    drawCurve(trainingHistory.map(m => m.valLoss), 'rgba(255, 0, 136, 0.8)', 'Validation Loss');

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '10px JetBrains Mono';
    ctx.textAlign = 'left';
    ctx.fillText('Loss', 10, 20);
    ctx.fillText('Epoch', canvas.width - 50, canvas.height - 10);

    // Legend
    ctx.fillStyle = 'rgba(0, 255, 136, 0.8)';
    ctx.fillRect(canvas.width - 120, 20, 10, 10);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Train Loss', canvas.width - 105, 29);

    ctx.fillStyle = 'rgba(255, 0, 136, 0.8)';
    ctx.fillRect(canvas.width - 120, 35, 10, 10);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('Val Loss', canvas.width - 105, 44);
  };

  const startTraining = () => {
    setIsTraining(true);
    setCurrentEpoch(0);
    setTrainingHistory([]);

    trainingIntervalRef.current = setInterval(() => {
      setCurrentEpoch(prev => {
        const newEpoch = prev + 1;
        
        if (newEpoch >= config.epochs) {
          setIsTraining(false);
          if (trainingIntervalRef.current) {
            clearInterval(trainingIntervalRef.current);
          }
          return prev;
        }

        const metrics = generateTrainingData();
        setTrainingHistory(prevHistory => [...prevHistory, { ...metrics, epoch: newEpoch }]);
        
        return newEpoch;
      });
    }, 100); // Update every 100ms for smooth animation
  };

  const stopTraining = () => {
    setIsTraining(false);
    if (trainingIntervalRef.current) {
      clearInterval(trainingIntervalRef.current);
    }
  };

  const resetTraining = () => {
    stopTraining();
    setCurrentEpoch(0);
    setTrainingHistory([]);
  };

  useEffect(() => {
    const animate = () => {
      if (isTraining) {
        updateNetworkActivations();
      }
      drawNetwork();
      drawTrainingChart();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (trainingIntervalRef.current) {
        clearInterval(trainingIntervalRef.current);
      }
    };
  }, [isTraining, trainingHistory, networkLayers]);

  const currentMetrics = trainingHistory[trainingHistory.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/training $ python neural_trainer.py --architecture {config.architecture.join('-')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Network Visualization */}
        <div className="lg:col-span-2 space-y-4">
          <div className="code-panel">
            <div className="code-header flex justify-between items-center">
              <span className="text-xs cosmic-text">neural_network.canvas</span>
              <div className="flex items-center gap-2">
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
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block mb-1">Epochs:</label>
                      <input
                        type="number"
                        value={config.epochs}
                        onChange={(e) => setConfig(prev => ({ ...prev, epochs: Number(e.target.value) }))}
                        className="w-full px-2 py-1 bg-background border border-border rounded"
                        disabled={isTraining}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Learning Rate:</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={config.learningRate}
                        onChange={(e) => setConfig(prev => ({ ...prev, learningRate: Number(e.target.value) }))}
                        className="w-full px-2 py-1 bg-background border border-border rounded"
                        disabled={isTraining}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Batch Size:</label>
                      <input
                        type="number"
                        value={config.batchSize}
                        onChange={(e) => setConfig(prev => ({ ...prev, batchSize: Number(e.target.value) }))}
                        className="w-full px-2 py-1 bg-background border border-border rounded"
                        disabled={isTraining}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Optimizer:</label>
                      <select
                        value={config.optimizer}
                        onChange={(e) => setConfig(prev => ({ ...prev, optimizer: e.target.value as any }))}
                        className="w-full px-2 py-1 bg-background border border-border rounded"
                        disabled={isTraining}
                      >
                        <option value="adam">Adam</option>
                        <option value="sgd">SGD</option>
                        <option value="rmsprop">RMSprop</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 bg-terminal">
              <canvas
                ref={canvasRef}
                width={600}
                height={300}
                className="w-full border border-terminal-border rounded cosmic-glow"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
              />
            </div>
          </div>

          {/* Training Chart */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">training_metrics.chart</span>
            </div>
            <div className="p-4 bg-terminal">
              <canvas
                ref={chartCanvasRef}
                width={600}
                height={200}
                className="w-full border border-terminal-border rounded cosmic-glow"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
              />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          {/* Training Controls */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">training_control.sh</span>
            </div>
            <div className="p-3 space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={startTraining}
                  disabled={isTraining}
                  className="flex-1 flex items-center gap-2"
                  size="sm"
                >
                  <Play className="w-4 h-4" />
                  Start
                </Button>
                <Button
                  onClick={stopTraining}
                  disabled={!isTraining}
                  variant="outline"
                  size="sm"
                >
                  <Pause className="w-4 h-4" />
                </Button>
                <Button
                  onClick={resetTraining}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={isTraining ? 'text-primary' : 'text-muted-foreground'}>
                    {isTraining ? 'Training...' : 'Stopped'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Epoch:</span>
                  <span>{currentEpoch} / {config.epochs}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(currentEpoch / config.epochs) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Metrics */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">current_metrics.json</span>
            </div>
            <div className="p-3 space-y-2">
              {currentMetrics ? (
                <div className="text-xs space-y-1">
                  <div className="text-muted-foreground">// Training Metrics</div>
                  <div><span className="syntax-keyword">loss</span>: <span className="syntax-number">{currentMetrics.loss.toFixed(4)}</span></div>
                  <div><span className="syntax-keyword">accuracy</span>: <span className="syntax-number">{(currentMetrics.accuracy * 100).toFixed(2)}%</span></div>
                  <div><span className="syntax-keyword">val_loss</span>: <span className="syntax-number">{currentMetrics.valLoss.toFixed(4)}</span></div>
                  <div><span className="syntax-keyword">val_accuracy</span>: <span className="syntax-number">{(currentMetrics.valAccuracy * 100).toFixed(2)}%</span></div>
                  <div><span className="syntax-keyword">learning_rate</span>: <span className="syntax-number">{currentMetrics.learningRate.toExponential(2)}</span></div>
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  No training data available.
                  <br />Start training to see metrics.
                </div>
              )}
            </div>
          </div>

          {/* Network Architecture */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">architecture.yaml</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="text-xs space-y-1">
                <div className="text-muted-foreground"># Network Architecture</div>
                {networkLayers.map((layer, index) => (
                  <div key={layer.id} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{
                      backgroundColor: layer.type === 'input' ? 'hsl(var(--neural-green))' :
                                     layer.type === 'output' ? 'hsl(var(--neural-pink))' :
                                     'hsl(var(--neural-blue))'
                    }} />
                    <span className="syntax-keyword">{layer.type}</span>:
                    <span className="syntax-number">{layer.neurons}</span>
                    <span className="text-muted-foreground">({layer.activation})</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <div className="text-muted-foreground"># Configuration</div>
                  <div><span className="syntax-keyword">optimizer</span>: {config.optimizer}</div>
                  <div><span className="syntax-keyword">batch_size</span>: {config.batchSize}</div>
                </div>
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
                onClick={() => setConfig(prev => ({ ...prev, epochs: 50, learningRate: 0.01 }))}
                className="w-full justify-start text-xs"
                disabled={isTraining}
              >
                <Brain className="w-3 h-3 mr-2" />
                Quick Training
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfig(prev => ({ ...prev, epochs: 200, learningRate: 0.0001 }))}
                className="w-full justify-start text-xs"
                disabled={isTraining}
              >
                <TrendingUp className="w-3 h-3 mr-2" />
                Deep Training
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfig(prev => ({ ...prev, architecture: [784, 256, 128, 64, 10] }))}
                className="w-full justify-start text-xs"
                disabled={isTraining}
              >
                <Zap className="w-3 h-3 mr-2" />
                Complex Network
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NeuralNetworkTrainingSimulator;