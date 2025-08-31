import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code, Database, Brain, Atom, Sparkles,
  Terminal, ChevronRight, ArrowLeft, Zap, MessageCircle, Rocket, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SimpleCodePlayground from '@/components/SimpleCodePlayground';
import CosmicDataStreamVisualizer from '@/components/CosmicDataStreamVisualizer';
import NeuralNetworkTrainingSimulator from '@/components/NeuralNetworkTrainingSimulator';
import HolographicUICards from '@/components/HolographicUICards';
import AIChatAssistant from '@/components/AIChatAssistant';
import SpaceInvadersGame from '@/components/SpaceInvadersGame';
import ComputerVisionDemo from '@/components/ComputerVisionDemo';
import { MatrixRainBackground } from '@/components/MatrixRainEffect';

interface LabSection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  category: 'development' | 'visualization' | 'simulation' | 'interface';
}

const CosmicLab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);

  const labSections: LabSection[] = [
    {
      id: 'code-playground',
      title: 'Neural Code Playground',
      subtitle: 'Interactive Development Environment',
      description: 'Advanced code editor with real-time execution, syntax highlighting, and AI/ML code examples. Features PyTorch, Transformers, Computer Vision, and Data Analysis templates.',
      icon: <Code className="w-6 h-6" />,
      component: <SimpleCodePlayground />,
      category: 'development'
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision Demo',
      subtitle: 'Real AI Image Analysis',
      description: 'Interactive computer vision demonstration with object detection, face recognition, edge detection, and feature matching using real CV algorithms.',
      icon: <Eye className="w-6 h-6" />,
      component: <ComputerVisionDemo />,
      category: 'development'
    },
    {
      id: 'neural-training',
      title: 'Neural Network Trainer',
      subtitle: 'AI Training Simulation',
      description: 'Interactive neural network training simulator with real-time metrics, architecture visualization, and training progress tracking.',
      icon: <Brain className="w-6 h-6" />,
      component: <NeuralNetworkTrainingSimulator />,
      category: 'simulation'
    },
    {
      id: 'space-invaders',
      title: 'Space Invaders Game',
      subtitle: 'Classic Arcade Game',
      description: 'Fully functional Space Invaders game with score tracking, multiple levels, powerups, and smooth gameplay. Built with HTML5 Canvas and React.',
      icon: <Rocket className="w-6 h-6" />,
      component: <SpaceInvadersGame />,
      category: 'simulation'
    },
    {
      id: 'ai-chat',
      title: 'AI Chat Assistant',
      subtitle: 'Intelligent Conversation Interface',
      description: 'Interactive AI chat assistant with multiple models, code examples, and intelligent responses about AI/ML topics.',
      icon: <MessageCircle className="w-6 h-6" />,
      component: <AIChatAssistant />,
      category: 'interface'
    },
    {
      id: 'ai-chat',
      title: 'AI Chat Assistant',
      subtitle: 'Intelligent Conversation Interface',
      description: 'Interactive AI chat assistant with multiple models, code examples, and intelligent responses about AI/ML topics.',
      icon: <MessageCircle className="w-6 h-6" />,
      component: <AIChatAssistant />,
      category: 'interface'
    }
  ];

  const categoryColors = {
    development: 'hsl(var(--neural-green))',
    visualization: 'hsl(var(--neural-blue))',
    simulation: 'hsl(var(--neural-pink))',
    interface: 'hsl(var(--primary))'
  };

  const categoryIcons = {
    development: <Terminal className="w-4 h-4" />,
    visualization: <Database className="w-4 h-4" />,
    simulation: <Brain className="w-4 h-4" />,
    interface: <Sparkles className="w-4 h-4" />
  };

  if (activeSection) {
    const section = labSections.find(s => s.id === activeSection);
    if (!section) return null;

    return (
      <div className="min-h-screen bg-background">
        {/* Matrix Rain Effect */}
        {showMatrix && <MatrixRainBackground />}
        
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Lab
                </Button>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${categoryColors[section.category]}20` }}
                  >
                    <div style={{ color: categoryColors[section.category] }}>
                      {section.icon}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold cosmic-text">{section.title}</h1>
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMatrix(!showMatrix)}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Matrix {showMatrix ? 'Off' : 'On'}
              </Button>
            </div>
          </div>
        </div>

        {/* Component */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {section.component}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-data-header mb-6 cosmic-text">
              ~/cosmic-lab $ initialize --neural-interface --quantum-ready
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 cosmic-text">
              Cosmic Laboratory
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Advanced neural interface components for the next generation of AI-powered applications. 
              Explore interactive visualizations, quantum simulations, and holographic interfaces.
            </p>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Neural Interface Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span>Quantum Systems Online</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span>Holographic UI Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lab Sections Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {labSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative"
              >
                <div
                  className="absolute inset-0 rounded-lg opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40"
                  style={{
                    background: `linear-gradient(45deg, ${categoryColors[section.category]}, transparent)`
                  }}
                />
                
                <div
                  className="relative bg-background/80 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300 cursor-pointer group-hover:border-primary/50"
                  style={{
                    borderColor: 'hsl(var(--border))',
                    boxShadow: `0 0 20px ${categoryColors[section.category]}20`
                  }}
                  onClick={() => setActiveSection(section.id)}
                >
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div 
                      className="flex items-center gap-2 px-2 py-1 rounded-full text-xs"
                      style={{ 
                        backgroundColor: `${categoryColors[section.category]}20`,
                        color: categoryColors[section.category]
                      }}
                    >
                      {categoryIcons[section.category]}
                      <span className="capitalize">{section.category}</span>
                    </div>
                    
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 4 }}
                    >
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </motion.div>
                  </div>

                  {/* Icon */}
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${categoryColors[section.category]}20` }}
                  >
                    <div style={{ color: categoryColors[section.category] }}>
                      {section.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 cosmic-text">
                    {section.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {section.subtitle}
                  </p>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div 
                      className="absolute top-0 left-0 w-full h-0.5 opacity-60"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${categoryColors[section.category]}, transparent)`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 cosmic-text">
              Advanced Neural Interface Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each component is built with cutting-edge web technologies and designed 
              for the future of human-computer interaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Real-time Execution',
                description: 'Live code execution with instant feedback',
                icon: <Terminal className="w-5 h-5" />
              },
              {
                title: 'Quantum Simulation',
                description: 'Interactive quantum computing visualization',
                icon: <Atom className="w-5 h-5" />
              },
              {
                title: 'Neural Networks',
                description: 'AI training simulation and monitoring',
                icon: <Brain className="w-5 h-5" />
              },
              {
                title: 'Holographic UI',
                description: 'Futuristic interface components',
                icon: <Sparkles className="w-5 h-5" />
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center p-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <div className="text-primary">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CosmicLab;