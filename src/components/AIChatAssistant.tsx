import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, Send, Bot, User, Sparkles, 
  Copy, Download, RefreshCw, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  typing?: boolean;
}

interface ChatSettings {
  model: 'neural-gpt' | 'cosmic-ai' | 'quantum-mind';
  temperature: number;
  maxTokens: number;
}

const AIChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. I can help you with coding questions, explain AI/ML concepts, or discuss technology. What would you like to know?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    model: 'neural-gpt',
    temperature: 0.7,
    maxTokens: 500
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const aiResponses = {
    greeting: [
      "Hello! I'm here to help with your AI and development questions.",
      "Hi there! Ready to explore some AI concepts together?",
      "Greetings! What would you like to learn about today?"
    ],
    coding: [
      "Here's a Python example for neural networks:\n\n```python\nimport torch\nimport torch.nn as nn\n\nclass SimpleNet(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = nn.Linear(784, 128)\n        self.fc2 = nn.Linear(128, 10)\n        self.relu = nn.ReLU()\n    \n    def forward(self, x):\n        x = self.relu(self.fc1(x))\n        return self.fc2(x)\n```",
      "For computer vision tasks, you might want to use:\n\n```python\nimport cv2\nimport numpy as np\n\n# Load and preprocess image\nimg = cv2.imread('image.jpg')\nimg = cv2.resize(img, (224, 224))\nimg = img / 255.0  # Normalize\n```",
      "Here's how to fine-tune a transformer model:\n\n```python\nfrom transformers import AutoTokenizer, AutoModel\n\ntokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')\nmodel = AutoModel.from_pretrained('bert-base-uncased')\n\n# Fine-tuning code here\n```"
    ],
    ai_concepts: [
      "Neural networks are inspired by biological neurons. They consist of layers of interconnected nodes that process information through weighted connections.",
      "Machine learning has three main types: supervised (with labeled data), unsupervised (finding patterns), and reinforcement learning (learning through rewards).",
      "Transformers revolutionized NLP by using attention mechanisms to process sequences in parallel, making them much more efficient than RNNs."
    ],
    projects: [
      "Based on your portfolio, I see you work with PyTorch and computer vision. Have you tried implementing attention mechanisms in your CV models?",
      "Your experience with Llama 3 and QLoRA is impressive! Fine-tuning large language models is a cutting-edge skill.",
      "I notice you work with medical AI. That's a fascinating field where AI can really make a difference in people's lives."
    ],
    default: [
      "That's an interesting question! Could you provide more details so I can give you a better answer?",
      "I'd be happy to help with that. Can you be more specific about what you're looking for?",
      "Great question! Let me think about the best way to explain this..."
    ]
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
    }
    
    if (message.includes('code') || message.includes('python') || message.includes('pytorch') || message.includes('programming')) {
      return aiResponses.coding[Math.floor(Math.random() * aiResponses.coding.length)];
    }
    
    if (message.includes('ai') || message.includes('machine learning') || message.includes('neural') || message.includes('transformer')) {
      return aiResponses.ai_concepts[Math.floor(Math.random() * aiResponses.ai_concepts.length)];
    }
    
    if (message.includes('project') || message.includes('portfolio') || message.includes('work')) {
      return aiResponses.projects[Math.floor(Math.random() * aiResponses.projects.length)];
    }
    
    return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "Chat cleared! How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.sender.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-chat-export.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keypress', handleKeyPress);
      return () => inputElement.removeEventListener('keypress', handleKeyPress);
    }
  }, [inputValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto p-4"
    >
      <div className="text-data-header mb-6 cosmic-text">
        ~/ai-assistant $ python neural_chat.py --model {settings.model}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[600px]">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="code-panel h-full flex flex-col">
            <div className="code-header flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-xs cosmic-text">neural_chat_v2.1.py</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="px-2"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportChat}
                  className="px-2"
                >
                  <Download className="w-4 h-4" />
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
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block mb-1">AI Model:</label>
                      <select
                        value={settings.model}
                        onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value as any }))}
                        className="w-full px-2 py-1 bg-background border border-border rounded"
                      >
                        <option value="neural-gpt">Neural GPT</option>
                        <option value="cosmic-ai">Cosmic AI</option>
                        <option value="quantum-mind">Quantum Mind</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Temperature: {settings.temperature}</label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={(e) => setSettings(prev => ({ ...prev, temperature: Number(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Max Tokens:</label>
                      <input
                        type="number"
                        min="100"
                        max="1000"
                        value={settings.maxTokens}
                        onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: Number(e.target.value) }))}
                        className="w-full px-2 py-1 bg-background border border-border rounded"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-terminal">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap font-mono">
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{message.timestamp.toLocaleTimeString()}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyMessage(message.content)}
                          className="p-1 h-auto opacity-50 hover:opacity-100"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-4 bg-muted/50">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me about AI, coding, or technology..."
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Status */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">ai_status.json</span>
            </div>
            <div className="p-3 space-y-2">
              <div className="text-xs space-y-1">
                <div className="text-muted-foreground">// AI Configuration</div>
                <div><span className="syntax-keyword">model</span>: <span className="syntax-string">"{settings.model}"</span></div>
                <div><span className="syntax-keyword">temperature</span>: <span className="syntax-number">{settings.temperature}</span></div>
                <div><span className="syntax-keyword">max_tokens</span>: <span className="syntax-number">{settings.maxTokens}</span></div>
                <div><span className="syntax-keyword">messages</span>: <span className="syntax-number">{messages.length}</span></div>
                <div><span className="syntax-keyword">status</span>: <span className="syntax-string">"{isTyping ? 'thinking' : 'ready'}"</span></div>
              </div>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="code-panel">
            <div className="code-header">
              <span className="text-xs cosmic-text">quick_prompts.py</span>
            </div>
            <div className="p-3 space-y-2">
              {[
                "Explain neural networks",
                "Show me PyTorch code",
                "What is transformer architecture?",
                "Help with computer vision",
                "Discuss your projects"
              ].map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setInputValue(prompt)}
                  className="w-full justify-start text-xs"
                  disabled={isTyping}
                >
                  <MessageCircle className="w-3 h-3 mr-2" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="terminal-panel">
            <div className="terminal-header">
              <span className="text-xs cosmic-text">features.md</span>
            </div>
            <div className="p-3 text-xs space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary" />
                <span>AI-powered responses</span>
              </div>
              <div className="flex items-center gap-2">
                <Copy className="w-3 h-3 text-accent" />
                <span>Copy messages</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-3 h-3 text-secondary" />
                <span>Export conversations</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="w-3 h-3 text-primary" />
                <span>Multiple AI models</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChatAssistant;