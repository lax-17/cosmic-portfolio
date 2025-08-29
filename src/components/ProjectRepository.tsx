import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder } from "lucide-react";

const ProjectRepository = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>("clinical-assistant");

  const projects = [
    {
      id: "clinical-assistant",
      name: "clinical_narrative_assistant/",
      type: "folder",
      description: "Fine-tuned LLM for medical narrative processing",
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
      tech: ["Llama 3", "QLoRA", "Hugging Face", "PyTorch"]
    },
    {
      id: "drone-tracking",
      name: "object_tracking_drone/",
      type: "folder", 
      description: "Real-time drone navigation with computer vision",
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
      tech: ["OpenCV", "Python", "PID Control", "GPS Fusion"]
    },
    {
      id: "fmri-reconstruction", 
      name: "fmri_image_reconstruction/",
      type: "folder",
      description: "GAN-based brain imaging reconstruction",
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
      tech: ["StyleGAN2", "U-Net", "PyTorch", "Medical Imaging"]
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

  return (
    <section id="projects" className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="text-data-header mb-8">
            ~/projects $ ls -la
          </div>

          <div className="asymmetric-layout">
            {/* File Tree Navigation */}
            <div className="code-panel">
              <div className="code-header">
                <span className="text-xs">Project Repository</span>
                <span className="text-xs text-muted-foreground">{projects.length} folders</span>
              </div>
              
              <div className="file-tree">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    {/* Project Folder */}
                    <div
                      className={`file-item ${selectedFile === project.id ? 'active' : ''}`}
                      onClick={() => {
                        toggleProject(project.id);
                        setSelectedFile(project.id);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {expandedProjects.includes(project.id) ? 
                          <ChevronDown size={14} /> : <ChevronRight size={14} />
                        }
                        <Folder size={14} className="text-accent" />
                        <span>{project.name}</span>
                      </div>
                    </div>

                    {/* Project Files */}
                    {expandedProjects.includes(project.id) && (
                      <div className="ml-6">
                        {project.files.map((file, fileIndex) => (
                          <div key={fileIndex} className="file-item pl-4">
                            <File size={12} className="text-muted-foreground" />
                            <span className="text-sm">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div className="px-4 pb-2">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.tech.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="text-xs px-2 py-1 bg-muted/20 text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 px-0">
                        {project.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Code Editor */}
            <div className="code-panel">
              <div className="code-header">
                <span className="text-xs">
                  {selectedProject?.name}{selectedFileContent?.name}
                </span>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>Python</span>
                  <span>UTF-8</span>
                </div>
              </div>
              
              <div className="p-4 font-mono text-sm overflow-auto max-h-[600px]">
                {selectedFileContent && (
                  <motion.pre
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="whitespace-pre-wrap text-foreground"
                  >
                    <code dangerouslySetInnerHTML={{
                      __html: selectedFileContent.content
                        .replace(/# (.*)/g, '<span class="syntax-comment"># $1</span>')
                        .replace(/(import|from|class|def|return|if|else|for|while)/g, '<span class="syntax-keyword">$1</span>')
                        .replace(/"([^"]*)"/g, '<span class="syntax-string">"$1"</span>')
                        .replace(/\'([^\']*)\'/g, '<span class="syntax-string">\'$1\'</span>')
                        .replace(/(\d+)/g, '<span class="syntax-number">$1</span>')
                    }} />
                  </motion.pre>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectRepository;