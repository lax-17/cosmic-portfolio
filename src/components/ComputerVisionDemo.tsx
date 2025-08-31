import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Play, Square, Download, 
  Eye, Layers, Target, Zap, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DetectionResult {
  id: string;
  label: string;
  confidence: number;
  bbox: { x: number; y: number; width: number; height: number };
  color: string;
}

interface CVModel {
  id: string;
  name: string;
  type: 'object_detection' | 'face_detection' | 'edge_detection' | 'feature_matching';
  description: string;
  accuracy: number;
}

const ComputerVisionDemo: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('object_detection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [confidence, setConfidence] = useState(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cvModels: CVModel[] = [
    {
      id: 'object_detection',
      name: 'YOLO Object Detection',
      type: 'object_detection',
      description: 'Real-time object detection using YOLO architecture',
      accuracy: 0.89
    },
    {
      id: 'face_detection',
      name: 'Face Recognition',
      type: 'face_detection', 
      description: 'Face detection and recognition using deep learning',
      accuracy: 0.94
    },
    {
      id: 'edge_detection',
      name: 'Canny Edge Detection',
      type: 'edge_detection',
      description: 'Classical computer vision edge detection algorithm',
      accuracy: 0.85
    },
    {
      id: 'feature_matching',
      name: 'SIFT Feature Matching',
      type: 'feature_matching',
      description: 'Scale-invariant feature transform for image matching',
      accuracy: 0.78
    }
  ];

  const generateSampleImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create a sample scene
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

    // Draw objects for detection
    const objects = [
      { type: 'car', x: 100, y: 250, width: 80, height: 40, color: '#FF4500' },
      { type: 'person', x: 200, y: 220, width: 20, height: 60, color: '#FFB6C1' },
      { type: 'tree', x: 350, y: 180, width: 30, height: 80, color: '#8B4513' },
      { type: 'building', x: 450, y: 150, width: 60, height: 100, color: '#696969' }
    ];

    objects.forEach(obj => {
      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
      
      // Add some details
      if (obj.type === 'car') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(obj.x + 10, obj.y + 25, 15, 15); // Wheel
        ctx.fillRect(obj.x + 55, obj.y + 25, 15, 15); // Wheel
      } else if (obj.type === 'person') {
        ctx.fillStyle = '#FFDBAC';
        ctx.beginPath();
        ctx.arc(obj.x + 10, obj.y + 10, 8, 0, Math.PI * 2); // Head
        ctx.fill();
      } else if (obj.type === 'tree') {
        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.arc(obj.x + 15, obj.y + 20, 25, 0, Math.PI * 2); // Leaves
        ctx.fill();
      }
    });

    return objects;
  };

  const simulateDetection = async (modelType: string): Promise<DetectionResult[]> => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const model = cvModels.find(m => m.id === modelType);
    if (!model) return [];

    let results: DetectionResult[] = [];

    switch (model.type) {
      case 'object_detection':
        results = [
          {
            id: '1',
            label: 'car',
            confidence: 0.92,
            bbox: { x: 100, y: 250, width: 80, height: 40 },
            color: '#FF4500'
          },
          {
            id: '2', 
            label: 'person',
            confidence: 0.87,
            bbox: { x: 200, y: 220, width: 20, height: 60 },
            color: '#00FF00'
          },
          {
            id: '3',
            label: 'tree',
            confidence: 0.76,
            bbox: { x: 350, y: 180, width: 30, height: 80 },
            color: '#FFFF00'
          },
          {
            id: '4',
            label: 'building',
            confidence: 0.83,
            bbox: { x: 450, y: 150, width: 60, height: 100 },
            color: '#FF00FF'
          }
        ];
        break;

      case 'face_detection':
        results = [
          {
            id: '1',
            label: 'face',
            confidence: 0.94,
            bbox: { x: 202, y: 222, width: 16, height: 16 },
            color: '#00FF00'
          }
        ];
        break;

      case 'edge_detection':
        results = [
          {
            id: '1',
            label: 'edges',
            confidence: 1.0,
            bbox: { x: 0, y: 0, width: 600, height: 300 },
            color: '#FFFFFF'
          }
        ];
        break;

      case 'feature_matching':
        results = [
          {
            id: '1',
            label: 'keypoint',
            confidence: 0.89,
            bbox: { x: 120, y: 260, width: 4, height: 4 },
            color: '#FF0000'
          },
          {
            id: '2',
            label: 'keypoint', 
            confidence: 0.82,
            bbox: { x: 210, y: 230, width: 4, height: 4 },
            color: '#FF0000'
          },
          {
            id: '3',
            label: 'keypoint',
            confidence: 0.75,
            bbox: { x: 365, y: 200, width: 4, height: 4 },
            color: '#FF0000'
          }
        ];
        break;
    }

    // Filter by confidence threshold
    results = results.filter(result => result.confidence >= confidence);

    setIsProcessing(false);
    return results;
  };

  const runDetection = async () => {
    if (!uploadedImage) {
      // Generate sample image first
      generateSampleImage();
    }
    
    const results = await simulateDetection(selectedModel);
    setDetectionResults(results);
    drawDetections(results);
  };

  const drawDetections = (results: DetectionResult[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw the base image
    generateSampleImage();

    // Draw detection boxes
    results.forEach(result => {
      ctx.strokeStyle = result.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(result.bbox.x, result.bbox.y, result.bbox.width, result.bbox.height);

      // Draw label
      ctx.fillStyle = result.color;
      ctx.fillRect(result.bbox.x, result.bbox.y - 20, 100, 20);
      ctx.fillStyle = '#000000';
      ctx.font = '12px JetBrains Mono';
      ctx.fillText(
        `${result.label} ${Math.round(result.confidence * 100)}%`,
        result.bbox.x + 2,
        result.bbox.y - 6
      );
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      
      // Draw uploaded image to canvas
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const exportResults = () => {
    const exportData = {
      model: cvModels.find(m => m.id === selectedModel),
      detections: detectionResults,
      settings: { confidence },
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv-detection-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    // Initialize with sample image
    generateSampleImage();
  }, []);

  const currentModel = cvModels.find(m => m.id === selectedModel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/cv-demo $ python computer_vision_demo.py --model {selectedModel}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Canvas */}
        <div className="lg:col-span-3">
          <div className="code-panel">
            <div className="code-header flex justify-between items-center">
              <span className="text-xs cosmic-text">cv_canvas.py</span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  size="sm"
                  className="px-2"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button
                  onClick={runDetection}
                  disabled={isProcessing}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Eye className="w-4 h-4" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowSettings(!showSettings)}
                  variant="ghost"
                  size="sm"
                  className="px-2"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  onClick={exportResults}
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  disabled={detectionResults.length === 0}
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
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span>Confidence Threshold:</span>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={confidence}
                        onChange={(e) => setConfidence(Number(e.target.value))}
                        className="w-24"
                      />
                      <span>{Math.round(confidence * 100)}%</span>
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
                className="w-full border border-terminal-border rounded cosmic-glow cursor-crosshair"
                style={{ backgroundColor: '#000011' }}
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Results */}
            {detectionResults.length > 0 && (
              <div className="border-t border-border p-4 bg-muted/50">
                <div className="text-xs font-semibold mb-2">Detection Results:</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {detectionResults.map(result => (
                    <div key={result.id} className="p-2 rounded border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: result.color }}
                        />
                        <span className="text-xs font-semibold">{result.label}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          {/* Model Selection */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">cv_models.py</span>
            </div>
            <div className="p-3 space-y-2">
              {cvModels.map(model => (
                <motion.button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full text-left p-2 rounded border transition-all ${
                    selectedModel === model.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs font-semibold">{model.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {model.description}
                  </div>
                  <div className="text-xs">
                    Accuracy: {Math.round(model.accuracy * 100)}%
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Current Model Info */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">model_info.json</span>
            </div>
            <div className="p-3 space-y-2">
              {currentModel && (
                <div className="text-xs space-y-1">
                  <div className="text-muted-foreground">// Model Configuration</div>
                  <div><span className="syntax-keyword">name</span>: <span className="syntax-string">"{currentModel.name}"</span></div>
                  <div><span className="syntax-keyword">type</span>: <span className="syntax-string">"{currentModel.type}"</span></div>
                  <div><span className="syntax-keyword">accuracy</span>: <span className="syntax-number">{currentModel.accuracy}</span></div>
                  <div><span className="syntax-keyword">confidence_threshold</span>: <span className="syntax-number">{confidence}</span></div>
                  <div><span className="syntax-keyword">detections</span>: <span className="syntax-number">{detectionResults.length}</span></div>
                </div>
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
                onClick={() => {
                  generateSampleImage();
                  setDetectionResults([]);
                }}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Camera className="w-3 h-3 mr-2" />
                Generate Sample Scene
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Upload className="w-3 h-3 mr-2" />
                Upload Your Image
              </Button>
              <Button
                onClick={runDetection}
                disabled={isProcessing}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Target className="w-3 h-3 mr-2" />
                Run Detection
              </Button>
            </div>
          </div>

          {/* Technical Details */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">technical_specs.md</span>
            </div>
            <div className="p-3 text-xs space-y-2 text-muted-foreground">
              <div><strong>Real CV Techniques:</strong></div>
              <div>• YOLO: You Only Look Once architecture</div>
              <div>• CNN: Convolutional Neural Networks</div>
              <div>• SIFT: Scale-Invariant Feature Transform</div>
              <div>• Canny: Edge detection algorithm</div>
              <div className="pt-2 border-t border-border">
                <div><strong>Applications:</strong></div>
                <div>• Autonomous vehicles</div>
                <div>• Medical imaging</div>
                <div>• Security systems</div>
                <div>• Robotics and automation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ComputerVisionDemo;