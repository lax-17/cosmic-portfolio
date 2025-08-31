import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeExample {
  id: string;
  title: string;
  code: string;
  category: 'ml' | 'cv' | 'nlp' | 'data';
}

interface ExecutionResult {
  output: string[];
  error?: string;
  executionTime: number;
}

const SimpleCodePlayground: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<string>('pytorch-basic');
  const [code, setCode] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const codeExamples: CodeExample[] = [
    {
      id: 'pytorch-basic',
      title: 'PyTorch Neural Network',
      category: 'ml',
      code: `import torch
import torch.nn as nn

# Simple neural network
class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)
        self.relu = nn.ReLU()
        
    def forward(self, x):
        x = self.relu(self.fc1(x))
        return self.fc2(x)

# Create model
model = Net()
print(f"Model: {model}")
print("Neural network created successfully!")`
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision',
      category: 'cv',
      code: `import cv2
import numpy as np

# Image processing example
def process_image():
    # Create sample image
    img = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(img, (15, 15), 0)
    
    # Edge detection
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150)
    
    print(f"Original image shape: {img.shape}")
    print(f"Processed successfully!")
    return img, blurred, edges

# Process image
result = process_image()
print("Computer vision pipeline completed!")`
    },
    {
      id: 'transformers',
      title: 'Transformers NLP',
      category: 'nlp',
      code: `from transformers import AutoTokenizer, AutoModel
import torch

# Load pre-trained model
model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

# Example text
text = "Hello, this is a sample text for NLP processing."

# Tokenize
inputs = tokenizer(text, return_tensors="pt")
print(f"Input tokens: {inputs['input_ids'].shape}")

# Get embeddings
with torch.no_grad():
    outputs = model(**inputs)
    embeddings = outputs.last_hidden_state

print(f"Embeddings shape: {embeddings.shape}")
print("NLP processing completed!")`
    },
    {
      id: 'data-analysis',
      title: 'Data Analysis',
      category: 'data',
      code: `import pandas as pd
import numpy as np

# Create sample dataset
data = {
    'feature_1': np.random.normal(50, 15, 1000),
    'feature_2': np.random.exponential(2, 1000),
    'category': np.random.choice(['A', 'B', 'C'], 1000),
    'target': np.random.binomial(1, 0.3, 1000)
}

df = pd.DataFrame(data)

# Basic statistics
print(f"Dataset shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print(f"\\nBasic statistics:")
print(df.describe())

# Category distribution
print(f"\\nCategory distribution:")
print(df['category'].value_counts())

print("\\nData analysis completed!")`
    }
  ];

  React.useEffect(() => {
    const example = codeExamples.find(ex => ex.id === selectedExample);
    if (example) {
      setCode(example.code);
    }
  }, [selectedExample]);

  const simulateExecution = async (code: string): Promise<ExecutionResult> => {
    const startTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    const executionTime = Date.now() - startTime;

    let output: string[] = [];

    if (code.includes('torch')) {
      output = [
        "PyTorch environment initialized",
        "Model: Net(",
        "  (fc1): Linear(in_features=784, out_features=128, bias=True)",
        "  (fc2): Linear(in_features=128, out_features=10, bias=True)",
        "  (relu): ReLU()",
        ")",
        "Neural network created successfully!"
      ];
    } else if (code.includes('cv2')) {
      output = [
        "Computer vision pipeline started",
        "Original image shape: (480, 640, 3)",
        "Processed successfully!",
        "Computer vision pipeline completed!"
      ];
    } else if (code.includes('transformers')) {
      output = [
        "Loading BERT model...",
        "Input tokens: torch.Size([1, 12])",
        "Embeddings shape: torch.Size([1, 12, 768])",
        "NLP processing completed!"
      ];
    } else if (code.includes('pandas')) {
      output = [
        "Dataset shape: (1000, 4)",
        "Columns: ['feature_1', 'feature_2', 'category', 'target']",
        "",
        "Basic statistics:",
        "       feature_1    feature_2       target",
        "count  1000.000000  1000.000000  1000.000000",
        "mean     49.876543     2.012345     0.301000",
        "std      14.987654     2.123456     0.458765",
        "",
        "Category distribution:",
        "A    334",
        "B    333", 
        "C    333",
        "",
        "Data analysis completed!"
      ];
    } else {
      output = [
        "Code executed successfully!",
        `Execution completed in ${executionTime}ms`
      ];
    }

    return { output, executionTime };
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

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const categoryColors = {
    ml: '#00ff88',
    cv: '#0088ff', 
    nlp: '#ff0088',
    data: '#ffaa00'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/playground $ python neural_playground.py --simple
      </div>

      <div className="space-y-4">
        {/* Example Selection */}
        <div className="code-panel">
          <div className="code-header">
            <span className="text-xs cosmic-text">examples.py</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {codeExamples.map((example) => (
                <Button
                  key={example.id}
                  onClick={() => setSelectedExample(example.id)}
                  variant={selectedExample === example.id ? 'default' : 'outline'}
                  className="flex items-center gap-2 justify-start"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColors[example.category] }}
                  />
                  {example.title}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Code Editor and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Editor */}
          <div className="code-panel">
            <div className="code-header flex justify-between items-center">
              <span className="text-xs cosmic-text">editor.py</span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={executeCode}
                  disabled={isExecuting || !code.trim()}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Play className="w-3 h-3" />
                  {isExecuting ? 'Running...' : 'Run'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyCode}
                  className="px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCode}
                  className="px-2"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadCode}
                  className="px-2"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-4 bg-terminal text-terminal-text font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 border-0"
                placeholder="Write your code here..."
                spellCheck={false}
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">output.log</span>
            </div>
            
            <div className="p-4 h-80 overflow-y-auto bg-terminal">
              {!executionResult && !isExecuting && (
                <div className="text-muted-foreground text-sm">
                  Ready to execute code...
                  <br /><br />
                  Select an example above or write your own code, then click Run.
                </div>
              )}

              {isExecuting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="text-primary text-sm">
                    Executing code...
                  </div>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-accent text-sm"
                  >
                    Processing...
                  </motion.div>
                </motion.div>
              )}

              {executionResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  {executionResult.error ? (
                    <div className="text-red-400 text-sm">
                      <div className="font-semibold mb-2">Error:</div>
                      <div className="bg-red-900/20 p-3 rounded border border-red-500/30">
                        {executionResult.error}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {executionResult.output.map((line, index) => (
                        <div key={index} className="text-terminal-text text-sm font-mono">
                          {line}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-terminal-border pt-3 mt-4">
                    <div className="text-muted-foreground text-xs">
                      Execution time: {executionResult.executionTime}ms
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Example Info */}
        {selectedExample && (
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">info.md</span>
            </div>
            <div className="p-4">
              {(() => {
                const example = codeExamples.find(ex => ex.id === selectedExample);
                return example ? (
                  <div className="flex items-center gap-3 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColors[example.category] }}
                    />
                    <span className="font-semibold">{example.title}</span>
                    <span className="text-muted-foreground">
                      Category: {example.category.toUpperCase()}
                    </span>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SimpleCodePlayground;