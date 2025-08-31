import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, RotateCcw, Download, Upload, Settings, Terminal, Code, Cpu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  category: 'ml' | 'cv' | 'nlp' | 'data';
}

interface ExecutionResult {
  output: string[];
  error?: string;
  executionTime: number;
  memoryUsage?: number;
}

const InteractiveCodePlayground: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<string>('pytorch-basic');
  const [code, setCode] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const codeExamples: CodeExample[] = [
    {
      id: 'pytorch-basic',
      title: 'PyTorch Neural Network',
      language: 'python',
      category: 'ml',
      description: 'Basic neural network implementation with PyTorch',
      code: `import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np

# Define a simple neural network
class NeuralNet(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(NeuralNet, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, output_size)
        
    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        return out

# Create model instance
model = NeuralNet(input_size=784, hidden_size=128, output_size=10)
print(f"Model architecture: {model}")
print(f"Total parameters: {sum(p.numel() for p in model.parameters())}")

# Generate sample data
X = torch.randn(32, 784)  # Batch of 32 samples
y = torch.randint(0, 10, (32,))  # Random labels

# Forward pass
outputs = model(X)
print(f"Output shape: {outputs.shape}")
print("Neural network initialized successfully!")`
    },
    {
      id: 'transformers-example',
      title: 'Transformer Attention',
      language: 'python',
      category: 'nlp',
      description: 'Multi-head attention mechanism implementation',
      code: `import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attention_weights = torch.softmax(scores, dim=-1)
        output = torch.matmul(attention_weights, V)
        return output, attention_weights
    
    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)
        
        # Linear transformations
        Q = self.W_q(query).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        
        # Apply attention
        attn_output, attn_weights = self.scaled_dot_product_attention(Q, K, V, mask)
        
        # Concatenate heads
        attn_output = attn_output.transpose(1, 2).contiguous().view(
            batch_size, -1, self.d_model)
        
        # Final linear layer
        output = self.W_o(attn_output)
        return output, attn_weights

# Example usage
d_model, num_heads = 512, 8
seq_len, batch_size = 10, 2

attention = MultiHeadAttention(d_model, num_heads)
x = torch.randn(batch_size, seq_len, d_model)

output, weights = attention(x, x, x)
print(f"Input shape: {x.shape}")
print(f"Output shape: {output.shape}")
print(f"Attention weights shape: {weights.shape}")
print("Multi-head attention computed successfully!")`
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision Pipeline',
      language: 'python',
      category: 'cv',
      description: 'Image processing with OpenCV and feature detection',
      code: `import cv2
import numpy as np
from typing import Tuple, List

class ImageProcessor:
    def __init__(self):
        self.sift = cv2.SIFT_create()
        self.orb = cv2.ORB_create()
    
    def detect_features(self, image: np.ndarray, method='sift') -> Tuple[List, np.ndarray]:
        """Detect keypoints and descriptors in image"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        
        if method == 'sift':
            keypoints, descriptors = self.sift.detectAndCompute(gray, None)
        elif method == 'orb':
            keypoints, descriptors = self.orb.detectAndCompute(gray, None)
        else:
            raise ValueError("Method must be 'sift' or 'orb'")
        
        return keypoints, descriptors
    
    def match_features(self, desc1: np.ndarray, desc2: np.ndarray, ratio_threshold=0.75):
        """Match features between two images using FLANN matcher"""
        FLANN_INDEX_KDTREE = 1
        index_params = dict(algorithm=FLANN_INDEX_KDTREE, trees=5)
        search_params = dict(checks=50)
        
        flann = cv2.FlannBasedMatcher(index_params, search_params)
        matches = flann.knnMatch(desc1, desc2, k=2)
        
        # Apply Lowe's ratio test
        good_matches = []
        for match_pair in matches:
            if len(match_pair) == 2:
                m, n = match_pair
                if m.distance < ratio_threshold * n.distance:
                    good_matches.append(m)
        
        return good_matches
    
    def apply_gaussian_blur(self, image: np.ndarray, kernel_size=15, sigma=0):
        """Apply Gaussian blur to image"""
        return cv2.GaussianBlur(image, (kernel_size, kernel_size), sigma)
    
    def edge_detection(self, image: np.ndarray, low_threshold=50, high_threshold=150):
        """Detect edges using Canny edge detector"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) if len(image.shape) == 3 else image
        return cv2.Canny(gray, low_threshold, high_threshold)

# Simulate image processing pipeline
print("Initializing Computer Vision Pipeline...")
processor = ImageProcessor()

# Create synthetic image data
height, width = 480, 640
synthetic_image = np.random.randint(0, 255, (height, width, 3), dtype=np.uint8)

# Add some geometric shapes for feature detection
cv2.rectangle(synthetic_image, (100, 100), (200, 200), (255, 255, 255), -1)
cv2.circle(synthetic_image, (400, 300), 50, (0, 255, 0), -1)

print(f"Processing image of shape: {synthetic_image.shape}")

# Detect features
keypoints, descriptors = processor.detect_features(synthetic_image, method='sift')
print(f"Detected {len(keypoints)} SIFT keypoints")

# Apply image processing
blurred = processor.apply_gaussian_blur(synthetic_image)
edges = processor.edge_detection(synthetic_image)

print(f"Applied Gaussian blur: {blurred.shape}")
print(f"Edge detection result: {edges.shape}")
print("Computer vision pipeline executed successfully!")`
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis & Visualization',
      language: 'python',
      category: 'data',
      description: 'Statistical analysis and data visualization',
      code: `import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
import json

class DataAnalyzer:
    def __init__(self):
        self.data = None
        self.stats = {}
    
    def generate_synthetic_data(self, n_samples=1000) -> pd.DataFrame:
        """Generate synthetic dataset for analysis"""
        np.random.seed(42)
        
        data = {
            'feature_1': np.random.normal(50, 15, n_samples),
            'feature_2': np.random.exponential(2, n_samples),
            'feature_3': np.random.uniform(0, 100, n_samples),
            'category': np.random.choice(['A', 'B', 'C'], n_samples),
            'target': np.random.binomial(1, 0.3, n_samples)
        }
        
        # Add some correlation
        data['feature_4'] = data['feature_1'] * 0.5 + np.random.normal(0, 5, n_samples)
        
        return pd.DataFrame(data)
    
    def compute_statistics(self, df: pd.DataFrame) -> Dict:
        """Compute comprehensive statistics"""
        stats = {
            'shape': df.shape,
            'missing_values': df.isnull().sum().to_dict(),
            'numeric_stats': {},
            'categorical_stats': {}
        }
        
        # Numeric columns statistics
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            stats['numeric_stats'][col] = {
                'mean': float(df[col].mean()),
                'std': float(df[col].std()),
                'min': float(df[col].min()),
                'max': float(df[col].max()),
                'median': float(df[col].median()),
                'q25': float(df[col].quantile(0.25)),
                'q75': float(df[col].quantile(0.75))
            }
        
        # Categorical columns statistics
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            stats['categorical_stats'][col] = {
                'unique_values': int(df[col].nunique()),
                'value_counts': df[col].value_counts().to_dict(),
                'mode': df[col].mode().iloc[0] if not df[col].mode().empty else None
            }
        
        return stats
    
    def correlation_analysis(self, df: pd.DataFrame) -> Dict:
        """Perform correlation analysis"""
        numeric_df = df.select_dtypes(include=[np.number])
        correlation_matrix = numeric_df.corr()
        
        # Find highly correlated pairs
        high_corr_pairs = []
        for i in range(len(correlation_matrix.columns)):
            for j in range(i+1, len(correlation_matrix.columns)):
                corr_val = correlation_matrix.iloc[i, j]
                if abs(corr_val) > 0.7:
                    high_corr_pairs.append({
                        'feature_1': correlation_matrix.columns[i],
                        'feature_2': correlation_matrix.columns[j],
                        'correlation': float(corr_val)
                    })
        
        return {
            'correlation_matrix': correlation_matrix.to_dict(),
            'high_correlations': high_corr_pairs
        }

# Initialize analyzer and generate data
print("Initializing Data Analysis Pipeline...")
analyzer = DataAnalyzer()

# Generate synthetic dataset
df = analyzer.generate_synthetic_data(n_samples=1000)
print(f"Generated dataset with shape: {df.shape}")
print(f"Columns: {list(df.columns)}")

# Compute statistics
stats = analyzer.compute_statistics(df)
print(f"\\nDataset Statistics:")
print(f"- Missing values: {stats['missing_values']}")
print(f"- Numeric features: {len(stats['numeric_stats'])}")
print(f"- Categorical features: {len(stats['categorical_stats'])}")

# Sample statistics for feature_1
if 'feature_1' in stats['numeric_stats']:
    f1_stats = stats['numeric_stats']['feature_1']
    print(f"\\nFeature 1 Statistics:")
    print(f"- Mean: {f1_stats['mean']:.2f}")
    print(f"- Std: {f1_stats['std']:.2f}")
    print(f"- Range: [{f1_stats['min']:.2f}, {f1_stats['max']:.2f}]")

# Correlation analysis
corr_analysis = analyzer.correlation_analysis(df)
print(f"\\nCorrelation Analysis:")
print(f"- High correlations found: {len(corr_analysis['high_correlations'])}")

for pair in corr_analysis['high_correlations']:
    print(f"  {pair['feature_1']} <-> {pair['feature_2']}: {pair['correlation']:.3f}")

print("\\nData analysis completed successfully!")`
    }
  ];

  useEffect(() => {
    const example = codeExamples.find(ex => ex.id === selectedExample);
    if (example) {
      setCode(example.code);
    }
  }, [selectedExample]);

  const simulateExecution = async (code: string): Promise<ExecutionResult> => {
    // Simulate execution time
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    const executionTime = Date.now() - startTime;

    // Simulate different outputs based on code content
    let output: string[] = [];
    let error: string | undefined;

    if (code.includes('import torch')) {
      output = [
        "PyTorch environment initialized",
        "Model architecture: NeuralNet(",
        "  (fc1): Linear(in_features=784, out_features=128, bias=True)",
        "  (relu): ReLU()",
        "  (fc2): Linear(in_features=128, out_features=10, bias=True)",
        ")",
        "Total parameters: 101,770",
        "Output shape: torch.Size([32, 10])",
        "Neural network initialized successfully!"
      ];
    } else if (code.includes('MultiHeadAttention')) {
      output = [
        "Transformer attention module loaded",
        "Input shape: torch.Size([2, 10, 512])",
        "Output shape: torch.Size([2, 10, 512])",
        "Attention weights shape: torch.Size([2, 8, 10, 10])",
        "Multi-head attention computed successfully!"
      ];
    } else if (code.includes('cv2') || code.includes('opencv')) {
      output = [
        "Computer Vision Pipeline initialized",
        "Processing image of shape: (480, 640, 3)",
        "Detected 127 SIFT keypoints",
        "Applied Gaussian blur: (480, 640, 3)",
        "Edge detection result: (480, 640)",
        "Computer vision pipeline executed successfully!"
      ];
    } else if (code.includes('pandas') || code.includes('numpy')) {
      output = [
        "Data Analysis Pipeline initialized",
        "Generated dataset with shape: (1000, 6)",
        "Columns: ['feature_1', 'feature_2', 'feature_3', 'category', 'target', 'feature_4']",
        "",
        "Dataset Statistics:",
        "- Missing values: {'feature_1': 0, 'feature_2': 0, 'feature_3': 0, 'category': 0, 'target': 0, 'feature_4': 0}",
        "- Numeric features: 5",
        "- Categorical features: 1",
        "",
        "Feature 1 Statistics:",
        "- Mean: 49.97",
        "- Std: 14.73",
        "- Range: [10.12, 89.45]",
        "",
        "Correlation Analysis:",
        "- High correlations found: 1",
        "  feature_1 <-> feature_4: 0.847",
        "",
        "Data analysis completed successfully!"
      ];
    } else {
      output = [
        "Code executed successfully!",
        "Output generated from neural processing unit",
        `Execution completed in ${executionTime}ms`
      ];
    }

    // Simulate occasional errors
    if (Math.random() < 0.1) {
      error = "ModuleNotFoundError: No module named 'some_module'";
      output = ["Error occurred during execution"];
    }

    return {
      output,
      error,
      executionTime,
      memoryUsage: Math.floor(Math.random() * 512) + 128 // MB
    };
  };

  const executeCode = async () => {
    if (!code.trim()) return;

    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const result = await simulateExecution(code);
      setExecutionResult(result);
    } catch (error) {
      setExecutionResult({
        output: ["Execution failed"],
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime: 0
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const resetCode = () => {
    const example = codeExamples.find(ex => ex.id === selectedExample);
    if (example) {
      setCode(example.code);
      setExecutionResult(null);
    }
  };

  const downloadCode = () => {
    const example = codeExamples.find(ex => ex.id === selectedExample);
    const filename = `${example?.title.replace(/\s+/g, '_').toLowerCase() || 'code'}.py`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoryColors = {
    ml: 'hsl(var(--neural-green))',
    cv: 'hsl(var(--neural-blue))',
    nlp: 'hsl(var(--neural-pink))',
    data: 'hsl(var(--muted))'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/playground $ python neural_playground.py --interactive
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
        {/* Code Examples Sidebar */}
        <div className="lg:col-span-1">
          <div className="code-panel h-full">
            <div className="code-header">
              <span className="text-xs cosmic-text">examples.json</span>
            </div>
            <div className="p-3 space-y-2 overflow-y-auto h-full">
              {codeExamples.map((example) => (
                <motion.button
                  key={example.id}
                  onClick={() => setSelectedExample(example.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedExample === example.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: categoryColors[example.category] }}
                    />
                    <span className="text-xs font-semibold">{example.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{example.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Code className="w-3 h-3" />
                    <span className="text-xs">{example.language}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="lg:col-span-2">
          <div className="code-panel h-full flex flex-col">
            <div className="code-header flex justify-between items-center">
              <span className="text-xs cosmic-text">neural_playground.py</span>
              <div className="flex items-center gap-2">
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
                  onClick={resetCode}
                  className="px-2"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadCode}
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
                  className="border-b border-border p-3 bg-muted/50"
                >
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span>Font Size:</span>
                      <input
                        type="range"
                        min="10"
                        max="20"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-16"
                      />
                      <span>{fontSize}px</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Code Editor */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-4 bg-terminal text-terminal-text font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{ fontSize: `${fontSize}px` }}
                placeholder="Write your neural code here..."
                spellCheck={false}
              />
              
              {/* Line numbers */}
              <div className="absolute left-0 top-0 p-4 pointer-events-none text-muted-foreground font-mono text-xs leading-relaxed">
                {code.split('\n').map((_, index) => (
                  <div key={index} className="text-right w-8">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Control Bar */}
            <div className="border-t border-border p-3 bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={executeCode}
                    disabled={isExecuting || !code.trim()}
                    className="flex items-center gap-2"
                    size="sm"
                  >
                    {isExecuting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Cpu className="w-4 h-4" />
                        </motion.div>
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Code
                      </>
                    )}
                  </Button>
                  
                  {isExecuting && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsExecuting(false)}
                    >
                      <Square className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Terminal className="w-3 h-3" />
                    Python 3.9
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Neural GPU
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-1">
          <div className="terminal-panel h-full flex flex-col">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">output.log</span>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto">
              {!executionResult && !isExecuting && (
                <div className="text-muted-foreground text-xs">
                  Ready to execute neural code...
                  <br />
                  <br />
                  Select an example from the sidebar or write your own code.
                </div>
              )}

              {isExecuting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="text-primary text-xs cosmic-text">
                    Initializing neural processing unit...
                  </div>
                  <div className="text-terminal-text text-xs">
                    Loading dependencies...
                  </div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-accent text-xs"
                  >
                    Executing code...
                  </motion.div>
                </motion.div>
              )}

              {executionResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {executionResult.error ? (
                    <div className="text-red-400 text-xs">
                      <div className="font-semibold mb-1">Error:</div>
                      <div className="bg-red-900/20 p-2 rounded border border-red-500/30">
                        {executionResult.error}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {executionResult.output.map((line, index) => (
                        <div key={index} className="text-terminal-text text-xs font-mono">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-terminal-border pt-2 mt-3">
                    <div className="text-muted-foreground text-xs space-y-1">
                      <div>Execution time: {executionResult.executionTime}ms</div>
                      {executionResult.memoryUsage && (
                        <div>Memory usage: {executionResult.memoryUsage}MB</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InteractiveCodePlayground;