import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, File, Folder, Play, Code, Zap, Cpu, GitBranch, Star } from "lucide-react";

const ProjectRepository = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>("clinical-assistant");
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const projects = [
    {
      id: "clinical-assistant",
      name: "clinical_narrative_assistant/",
      type: "folder",
      description: "End‑to‑end healthcare LLM: QLoRA fine‑tuning (Llama 3 8B, 8192‑token context), schema‑faithful JSON outputs, safety/hallucination checks, and Docker + llama.cpp packaging for offline inference.",
      files: [
        { name: "model.py", type: "python", content: `# Clinical Narrative Assistant
# Fine-tuned Llama 3 with QLoRA for medical data

import torch
from transformers import (
    AutoTokenizer, 
    AutoModelForCausalLM,
    BitsAndBytesConfig
)
from peft import LoraConfig, get_peft_model

class ClinicalNarrativeAssistant:
    def __init__(self, model_path: str):
        self.config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16
        )
        
        self.model = AutoModelForCausalLM.from_pretrained(
            model_path,
            quantization_config=self.config,
            device_map="auto"
        )
        
        # QLoRA Configuration
        lora_config = LoraConfig(
            r=16,
            lora_alpha=32,
            target_modules=["q_proj", "v_proj"],
            lora_dropout=0.1,
            bias="none",
            task_type="CAUSAL_LM"
        )
        
        self.model = get_peft_model(self.model, lora_config)
        
    def process_narrative(self, text: str) -> dict:
        """Process clinical narrative and extract structured data"""
        # 600+ structured patient profiles processed
        return self.model.generate(text)` },
        { name: "requirements.txt", type: "text", content: `torch>=2.0.0
transformers>=4.30.0
peft>=0.4.0
datasets>=2.12.0
accelerate>=0.20.0
bitsandbytes>=0.39.0
huggingface-hub>=0.15.0` },
        { name: "README.md", type: "markdown", content: `# Clinical Narrative Assistant

## Overview
Fine-tuned Llama 3 model using QLoRA for processing medical narratives and extracting structured patient data.

## Key Achievements
- Processed 600+ structured patient profiles
- Significant improvement in clinical data extraction
- Production-ready medical NLP pipeline

## Tech Stack
- **Model**: Llama 3 with QLoRA fine-tuning
- **Framework**: Hugging Face Transformers
- **Optimization**: 4-bit quantization with BitsAndBytes
- **Training**: Parameter-Efficient Fine-Tuning (PEFT)` }
      ],
      tech: ["Llama 3 8B", "QLoRA", "Transformers", "PEFT", "bitsandbytes", "Accelerate", "PyTorch", "llama.cpp"]
    },
    {
      id: "drone-tracking",
      name: "object_tracking_drone/",
      type: "folder",
      description: "Real‑time drone pursuit with robust object tracking and closed‑loop PID control. v2 adds GPS/IMU + vision fusion for stability under noise and occlusions; tuned controllers yield smooth, latency‑aware commands.",
      files: [
        { name: "tracker.py", type: "python", content: `# Object Tracking Drone Navigation System
# Real-time pursuit with PID control and GPS fusion

import cv2
import numpy as np
from collections import deque

class DroneObjectTracker:
    def __init__(self):
        self.tracker = cv2.TrackerCSRT_create()
        self.pid_controller = PIDController(
            kp=0.5, ki=0.1, kd=0.2
        )
        
    def initialize_tracking(self, frame, bbox):
        """Initialize object tracking with bounding box"""
        return self.tracker.init(frame, bbox)
        
    def update_tracking(self, frame):
        """Update tracking and return new position"""
        success, bbox = self.tracker.update(frame)
        
        if success:
            # Calculate control signals
            center_x = bbox[0] + bbox[2] / 2
            center_y = bbox[1] + bbox[3] / 2
            
            # PID control for smooth tracking
            control_x = self.pid_controller.update_x(center_x)
            control_y = self.pid_controller.update_y(center_y)
            
            return control_x, control_y, bbox
        return None, None, None

class PIDController:
    def __init__(self, kp, ki, kd):
        self.kp, self.ki, self.kd = kp, ki, kd
        self.prev_error_x = 0
        self.prev_error_y = 0
        self.integral_x = 0
        self.integral_y = 0` }
      ],
      tech: ["OpenCV", "Python", "PID Control", "GPS/IMU Fusion"]
    },
    {
      id: "fmri-reconstruction",
      name: "fmri_image_reconstruction/",
      type: "folder",
      description: "GAN‑based brain imaging reconstruction: StyleGAN2 + U‑Net hybrid stabilized with LSGAN objective. Achieved SSIM 0.87 and PSNR 28.4 dB; analyzed domain mismatch and instability factors.",
      files: [
        { name: "models.py", type: "python", content: `# fMRI Image Reconstruction using GANs
# Benchmarked StyleGAN2 and U-Net architectures

import torch
import torch.nn as nn
from torch.nn import functional as F

class StyleGAN2Generator(nn.Module):
    """StyleGAN2 generator for high-quality fMRI reconstruction"""
    
    def __init__(self, latent_dim=512, img_size=256):
        super().__init__()
        self.latent_dim = latent_dim
        self.img_size = img_size
        
        # Mapping network
        self.mapping = nn.Sequential(
            nn.Linear(latent_dim, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, 512)
        )
        
        # Synthesis network with progressive upsampling
        self.synthesis = SynthesisNetwork(img_size)
        
    def forward(self, z, noise=None):
        w = self.mapping(z)
        return self.synthesis(w, noise)

class UNetReconstructor(nn.Module):
    """U-Net architecture for fMRI reconstruction"""
    
    def __init__(self, in_channels=1, out_channels=1):
        super().__init__()
        
        # Encoder
        self.encoder = nn.ModuleList([
            self._conv_block(in_channels, 64),
            self._conv_block(64, 128),
            self._conv_block(128, 256),
            self._conv_block(256, 512)
        ])
        
        # Decoder
        self.decoder = nn.ModuleList([
            self._upconv_block(512, 256),
            self._upconv_block(256, 128),
            self._upconv_block(128, 64),
            nn.Conv2d(64, out_channels, 1)
        ])` }
      ],
      tech: ["StyleGAN2", "U‑Net", "PyTorch", "LSGAN", "Medical Imaging"]
    }
  ];

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const selectedProject = projects.find(p => p.id === selectedFile);
  const selectedFileContent = selectedProject?.files[0]; // Default to first file

  const runCodeSimulation = async () => {
    if (!selectedProject) return;

    setIsRunningCode(true);
    setCodeOutput("");

    // Simulate code execution with realistic outputs
    const outputs = {
      "clinical-assistant": [
        ">>> Initializing Clinical Narrative Assistant...",
        "Loading Llama 3 8B with QLoRA (4‑bit, nf4) via bitsandbytes...",
        "Model loaded successfully! 🏥",
        "Context window: 8192 tokens",
        "Processing sample medical narrative...",
        "Extracted patient data:",
        "  - Age: 45",
        "  - Symptoms: chest pain, shortness of breath",
        "  - Diagnosis: Possible cardiac event",
        "  - Confidence: 94.2%",
        "JSON schema compliance: PASSED",
        "Safety/hallucination checks: PASSED",
        "Offline inference (llama.cpp): READY",
        "",
        "✅ Clinical data extraction completed!"
      ],
      "drone-tracking": [
        ">>> Initializing Drone Tracking System...",
        "Connecting to drone hardware...",
        "Calibrating PID controllers...",
        "Initializing OpenCV tracker...",
        "Target acquired! 📡",
        "Tracking object at coordinates: (245, 180)",
        "PID Output: X=0.12, Y=-0.08",
        "Drone following target smoothly...",
        "",
        "✅ Object tracking active!"
      ],
      "fmri-reconstruction": [
        ">>> Initializing fMRI Reconstruction...",
        "Loading StyleGAN2 generator...",
        "Setting up U-Net architecture...",
        "Processing brain imaging data...",
        "Generating high-resolution reconstruction...",
        "SSIM Score: 0.87",
        "PSNR: 28.4 dB",
        "Reconstruction completed! 🧠",
        "",
        "✅ Medical imaging reconstruction successful!"
      ]
    };

    const projectOutput = outputs[selectedProject.id as keyof typeof outputs] || ["Running code..."];

    for (let i = 0; i < projectOutput.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
      setCodeOutput(prev => prev + projectOutput[i] + "\n");
    }

    setIsRunningCode(false);
  };

  const getProjectIcon = (projectId: string) => {
    const icons = {
      "clinical-assistant": Cpu,
      "drone-tracking": Zap,
      "fmri-reconstruction": GitBranch
    };
    return icons[projectId as keyof typeof icons] || Folder;
  };

  const getProjectColor = (projectId: string) => {
    const colors = {
      "clinical-assistant": "text-green-400",
      "drone-tracking": "text-blue-400",
      "fmri-reconstruction": "text-pink-400"
    };
    return colors[projectId as keyof typeof colors] || "text-primary";
  };

  const highlightContent = (content: string, type: string): string => {
    if (type === 'python') {
      // Escape HTML first
      let result = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      // Apply syntax highlighting - order matters!
      result = result
        // Python keywords
        .replace(/\b(import|from|class|def|return|if|elif|else|for|while|in|as|with|try|except|raise|pass|yield|True|False|None|self)\b/g, '<span class="syntax-keyword">$1</span>')
        // Function names (word followed by opening parenthesis)
        .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="syntax-function">$1</span>')
        // String literals (escaped quotes)
        .replace(/&quot;([^&]|&(?!quot;))*&quot;/g, '<span class="syntax-string">$&</span>')
        .replace(/&#39;([^&]|&(?!#39;))*&#39;/g, '<span class="syntax-string">$&</span>')
        // Numbers
        .replace(/\b\d+(?:\.\d+)?\b/g, '<span class="syntax-number">$&</span>')
        // Comments last (to avoid conflicts with other patterns)
        .replace(/^(#.*)$/gm, '<span class="syntax-comment">$1</span>');
      
      return result;
    }

    if (type === 'markdown') {
      let result = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
        
      result = result
        .replace(/^# (.*)$/gm, '<span class="syntax-function">$1</span>')
        .replace(/^## (.*)$/gm, '<span class="syntax-keyword">$1</span>')
        .replace(/^\*\*(.+?)\*\*$/gm, '<span class="syntax-keyword">$1</span>')
        .replace(/^- (.*)$/gm, '<span class="syntax-string">$1</span>');
      return result;
    }

    // Default: just escape HTML
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  return (
    <section id="projects" className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-data-header mb-6">
            ~/projects $ ls -la
          </div>

          <div className="grid items-start gap-4 sm:gap-6 md:grid-cols-[1fr_2fr]">
            {/* Enhanced Project Cards */}
            <div className="space-y-4">
              <div className="text-data-header mb-6">
                🚀 Featured Projects
              </div>

              {projects.map((project, index) => {
                const ProjectIcon = getProjectIcon(project.id);
                const isSelected = selectedFile === project.id;
                const isHovered = hoveredProject === project.id;

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`relative overflow-hidden rounded-lg border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                        : 'border-panel-border bg-panel/50 hover:border-primary/50'
                    }`}
                    onClick={() => {
                      toggleProject(project.id);
                      setSelectedFile(project.id);
                    }}
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onTouchStart={() => setHoveredProject(project.id)}
                    onTouchEnd={() => setHoveredProject(null)}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2, ease: "easeOut" }
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { duration: 0.1, ease: "easeOut" }
                    }}
                    style={{
                      willChange: "transform"
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${project.name.replace('/', '')} project`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleProject(project.id);
                        setSelectedFile(project.id);
                      }
                    }}
                  >
                    {/* Animated background gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10"
                      initial={{ x: '-100%' }}
                      animate={isHovered ? { x: '100%' } : { x: '-100%' }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut"
                      }}
                      style={{
                        willChange: "transform"
                      }}
                    />

                    <div className="relative p-4 sm:p-6">
                      {/* Project Header */}
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <motion.div
                            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <ProjectIcon size={20} className={`sm:w-6 sm:h-6 ${getProjectColor(project.id)}`} />
                          </motion.div>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">{project.name.replace('/', '')}</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">{project.description}</p>
                          </div>
                        </div>

                        <motion.div
                          animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                          className={`p-2 rounded-full ${isSelected ? 'bg-primary/20' : 'bg-muted/20'}`}
                        >
                          {expandedProjects.includes(project.id) ?
                            <ChevronDown size={16} className="text-primary" /> :
                            <ChevronRight size={16} className="text-muted-foreground" />
                          }
                        </motion.div>
                      </div>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                        {project.tech.map((tech, techIndex) => (
                          <motion.span
                            key={techIndex}
                            className="px-2 py-1 sm:px-3 sm:py-1 text-[10px] sm:text-xs bg-muted/30 text-muted-foreground rounded-full border border-panel-border/50"
                            whileHover={{ scale: 1.05, backgroundColor: 'hsl(var(--primary) / 0.1)' }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>

                      {/* Project Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <File size={12} />
                          {project.files.length} files
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={12} />
                          Featured
                        </span>
                      </div>

                      {/* Expandable Files */}
                      <AnimatePresence>
                        {expandedProjects.includes(project.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-panel-border/50"
                          >
                            <div className="space-y-2">
                              {project.files.map((file, fileIndex) => (
                                <motion.div
                                  key={fileIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: fileIndex * 0.1 }}
                                  className="flex items-center gap-2 p-3 rounded border border-panel-border/30 hover:bg-muted/20 transition-colors"
                                  onTouchStart={() => {}}
                                  role="button"
                                  tabIndex={0}
                                  aria-label={`View ${file.name} file`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      // Add file selection logic here if needed
                                    }
                                  }}
                                >
                                  <File size={14} className="text-muted-foreground" />
                                  <span className="text-sm font-mono">{file.name}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {file.type.toUpperCase()}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Code Editor */}
            <div className="code-panel">
              <div className="code-header flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-xs">
                    {selectedProject?.name}{selectedFileContent?.name}
                  </span>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Code size={12} />
                      {selectedFileContent?.type === 'python' ? 'Python' : (selectedFileContent?.type === 'markdown' ? 'Markdown' : 'Text')}
                    </span>
                    <span>UTF-8</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={runCodeSimulation}
                    disabled={isRunningCode}
                    className="flex items-center gap-2 px-4 py-2 text-xs bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isRunningCode ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Cpu size={12} />
                        </motion.div>
                        Running...
                      </>
                    ) : (
                      <>
                        <Play size={12} />
                        Run Code
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              
              {/* Code Content */}
              <div className="relative">
                <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-relaxed overflow-auto max-h-[680px] min-h-[480px] bg-terminal/30">
                  {selectedFileContent && (
                    <motion.pre
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="whitespace-pre-wrap text-foreground"
                    >
                      <code dangerouslySetInnerHTML={{
                        __html: highlightContent(selectedFileContent.content, selectedFileContent.type)
                      }} />
                    </motion.pre>
                  )}
                </div>

                {/* Code Output Terminal */}
                <AnimatePresence>
                  {codeOutput && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-panel-border"
                    >
                      <div className="p-4 bg-terminal/50">
                        <div className="text-xs text-primary mb-2 font-mono">
                          ~/projects/{selectedProject?.name}$ python {selectedFileContent?.name}
                        </div>
                        <motion.pre
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm font-mono text-terminal-text whitespace-pre-wrap"
                        >
                          {codeOutput}
                        </motion.pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating particles effect */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-4 left-4 w-1 h-1 bg-secondary rounded-full"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectRepository;