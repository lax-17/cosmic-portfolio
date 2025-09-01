import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Target,
  Lightbulb,
  Cog,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Users,
  Calendar,
  ExternalLink,
  Github,
  ArrowRight,
  Zap,
  Brain,
  Eye,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

const CaseStudiesSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ open: boolean; images: string[]; index: number }>({
    open: false,
    images: [],
    index: 0
  });

  const openLightbox = (images: string[], index = 0) => {
    setLightbox({ open: true, images, index });
  };

  const closeLightbox = () => setLightbox({ open: false, images: [], index: 0 });

  useEffect(() => {
    if (!lightbox.open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') setLightbox(lb => ({ ...lb, index: (lb.index + 1) % lb.images.length }));
      if (e.key === 'ArrowLeft') setLightbox(lb => ({ ...lb, index: (lb.index - 1 + lb.images.length) % lb.images.length }));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox.open]);

  // Map case study IDs to their images in /public
  const imageMap: Record<string, string[]> = {
    "clinical-narrative": ["/hernia-model-art.png", "/hernia-report.png"],
    "drone-navigation": ["/drone-main.jpeg", "/drone-car.png", "/drone-carRecog.jpeg"],
    "fmri-reconstruction": ["/fmri-image.png"],
    // "multimodal-transformer": [] // no images provided
  };

  const caseStudies = [
    {
      id: "clinical-narrative",
      title: "Clinical Narrative Assistant",
      subtitle: "End-to-End Healthcare LLM System",
      category: "Healthcare AI",
      duration: "3 months",
      team: "4 researchers",

      problem: {
        title: "The Challenge",
        description: "Healthcare systems needed an AI solution to process and structure clinical narratives for Electronic Health Records (EHR) and Retrieval-Augmented Generation (RAG) workflows. The challenge was creating a system that could understand complex medical language while ensuring safety and accuracy.",
        painPoints: [
          "Unstructured clinical data difficult to process",
          "Need for schema-faithful JSON outputs",
          "Safety concerns with medical AI applications",
          "Requirement for offline deployment in clinical settings",
          "Validation by medical professionals required"
        ]
      },

      solution: {
        title: "The Solution",
        description: "Built a comprehensive LLM system using Llama 3 8B with QLoRA fine-tuning, synthetic data generation, and robust evaluation pipelines.",
        approach: [
          {
            phase: "Data Generation",
            details: "Created 600 structured clinical profiles using Gemini 1.5 Pro as teacher model, validated by medical doctors"
          },
          {
            phase: "Model Fine-tuning",
            details: "Fine-tuned Llama 3 8B Instruct with QLoRA on A100 GPUs using 8192-token context for complex medical narratives"
          },
          {
            phase: "Safety Implementation",
            details: "Integrated safety checks, hallucination reduction techniques, and schema-faithful JSON output validation"
          },
          {
            phase: "Deployment Pipeline",
            details: "Packaged with Docker and llama.cpp for offline inference in clinical environments"
          }
        ],
        technologies: ["Llama 3 8B", "QLoRA", "Gemini 1.5 Pro", "PyTorch", "Docker", "llama.cpp", "A100 GPUs"]
      },

      results: {
        title: "Results & Impact",
        metrics: [
          { label: "Clinical Profiles Generated", value: "600+", description: "Validated by medical doctors" },
          { label: "Context Length", value: "8,192", description: "Tokens for complex narratives" },
          { label: "Deployment Ready", value: "100%", description: "Docker + offline inference" },
          { label: "Safety Compliance", value: "✓", description: "Hallucination checks implemented" }
        ],
        outcomes: [
          "Successfully processed complex clinical narratives into structured JSON",
          "Achieved clinician validation for 600+ synthetic profiles",
          "Implemented robust safety measures for medical AI deployment",
          "Created reusable pipeline for healthcare LLM applications"
        ]
      },

      lessons: {
        title: "Key Learnings",
        insights: [
          "Synthetic data generation with teacher models can create high-quality training data",
          "QLoRA enables efficient fine-tuning of large models on limited hardware",
          "Safety measures are crucial for medical AI applications",
          "Offline deployment capabilities are essential for clinical environments",
          "Clinician validation is irreplaceable for healthcare AI systems"
        ]
      },

      github: "https://github.com/laxmikant-nishad/clinical-narrative",
      huggingface: "https://huggingface.co/Laxmikant17/Llama-3-8B-Hernia-Analyst-600-Patients-8k",
      demo: "https://clinical-narrative-demo.vercel.app",
      featured: true
    },

    {
      id: "multimodal-transformer",
      title: "Multi-modal Transformer for Emotion Recognition",
      subtitle: "Hybrid Conv1D + Transformer Architecture",
      category: "Computer Vision",
      duration: "3 months",
      team: "Solo research project",

      problem: {
        title: "The Challenge",
        description: "Emotion recognition from visual data required combining multiple modalities (facial features, pose, context) to achieve robust performance across diverse scenarios and populations.",
        painPoints: [
          "Single-modal approaches showed limited accuracy",
          "Existing models struggled with domain mismatch",
          "Need for robust evaluation without personalization",
          "Challenge of fusing different feature types effectively",
          "Requirement to outperform established baselines"
        ]
      },

      solution: {
        title: "The Solution",
        description: "Designed a hybrid Conv1D + Transformer architecture that fuses DINOv2 image embeddings with MediaPipe features for robust multi-modal emotion recognition.",
        approach: [
          {
            phase: "Architecture Design",
            details: "Created hybrid Conv1D + Transformer model to effectively process and fuse multi-modal features"
          },
          {
            phase: "Feature Fusion",
            details: "Combined DINOv2 image embeddings with MediaPipe facial/pose features for comprehensive representation"
          },
          {
            phase: "Training Optimization",
            details: "Implemented normalization, EMA, threshold calibration, and light TTA for robust evaluation"
          },
          {
            phase: "Baseline Comparison",
            details: "Compared against unimodal approaches (ViT-FER, DINOv2, OpenFace) and personalized models"
          }
        ],
        technologies: ["DINOv2", "MediaPipe", "Transformers", "Conv1D", "PyTorch", "ViT", "OpenFace"]
      },

      results: {
        title: "Results & Impact",
        metrics: [
          { label: "Macro-F1 Score", value: "0.350", description: "On 7-class dataset" },
          { label: "Accuracy", value: "53.4%", description: "Overall classification accuracy" },
          { label: "Baseline Improvement", value: "+40%", description: "Over ATL-BP (~0.25 F1)" },
          { label: "Dataset Size", value: "2,152", description: "Samples across 7 classes" }
        ],
        outcomes: [
          "Outperformed ATL-BP baseline (~0.25 F1) by 40%",
          "Achieved better results than personalized model (0.308 F1) without per-user adaptation",
          "Demonstrated effectiveness of multi-modal fusion over unimodal approaches",
          "Created robust architecture suitable for real-world deployment"
        ]
      },

      lessons: {
        title: "Key Learnings",
        insights: [
          "Multi-modal fusion significantly improves emotion recognition accuracy",
          "Hybrid architectures can effectively combine different feature types",
          "Proper normalization and calibration are crucial for robust performance",
          "Non-personalized models can outperform personalized ones with good architecture",
          "Feature engineering and fusion strategy are as important as model architecture"
        ]
      },

      github: "https://github.com/laxmikant-nishad/multimodal-emotion",
      demo: null,
      featured: true
    },

    {
      id: "fmri-reconstruction",
      title: "fMRI Image Reconstruction using Supervised U-Net",
      subtitle: "Experiment 5: Supervised U-Net Decoder (N=1024 PCA)",
      category: "Medical AI",
      duration: "3 months",
      team: "1 researcher",

      problem: {
        title: "The Challenge",
        description: "Brain imaging reconstruction from fMRI data faced persistent stability challenges with adversarial training approaches. Traditional GAN methods suffered from training instability, mode collapse, and difficulty in learning the complex mapping from fMRI PCA components to visual stimuli.",
        painPoints: [
          "Persistent stability challenges with adversarial training",
          "Training instability and mode collapse in GAN approaches",
          "Complex mapping from N=1024 fMRI PCA components to 64x64 images",
          "Need for reliable and consistent image reconstruction",
          "Balancing reconstruction quality with training stability"
        ]
      },

      solution: {
        title: "The Solution",
        description: "Implemented a direct supervised approach using a U-Net style decoder network trained to map N=1024 left-hemisphere fMRI PCA components directly to target 64x64 images, addressing the stability issues of adversarial methods.",
        approach: [
          {
            phase: "Supervised U-Net Implementation",
            details: "Developed U-Net style decoder network to map N=1024 fMRI PCA components to 64x64 target images"
          },
          {
            phase: "Training Optimization",
            details: "Minimized Mean Absolute Error (L1 loss) using Adam optimizer (LR=1e-4) for 2550 epochs"
          },
          {
            phase: "Stability Analysis",
            details: "Compared supervised approach against unstable GAN training methods"
          },
          {
            phase: "Quality Assessment",
            details: "Evaluated reconstruction quality focusing on structural coherence and image sharpness trade-offs"
          }
        ],
        technologies: ["U-Net", "PyTorch", "Adam Optimizer", "L1 Loss", "PCA", "fMRI"]
      },

      results: {
        title: "Results & Impact",
        metrics: [
          { label: "Training Stability", value: "Highly Stable", description: "Consistent convergence" },
          { label: "Final L1 Loss", value: "0.0647", description: "Mean Absolute Error" },
          { label: "Training Epochs", value: "2,550", description: "Complete convergence" },
          { label: "Image Quality", value: "Structural Coherence", description: "Better shape/layout preservation" }
        ],
        outcomes: [
          "Achieved highly stable training with consistent L1 loss decrease to 0.0647",
          "Generated images with better structural coherence and clearer correspondence to real stimuli shapes",
          "Demonstrated robustness of supervised approach for learning basic fMRI-to-image mapping",
          "Identified trade-off between image sharpness and structural accuracy",
          "Established reliable baseline for future adversarial training improvements"
        ]
      },

      lessons: {
        title: "Key Learnings",
        insights: [
          "Supervised approaches provide stable alternative to adversarial training for complex mappings",
          "L1 loss minimization leads to blurry images but preserves structural information",
          "U-Net architecture effectively captures spatial relationships in fMRI reconstruction",
          "Training stability is crucial for reliable medical imaging applications",
          "Structural coherence often more valuable than pixel-perfect sharpness in medical contexts"
        ]
      },

      github: "https://github.com/lax-17/Fmri-to-image",
      demo: null,
      featured: true
    },

    {
      id: "drone-navigation",
      title: "Object-Tracking Drone Navigation",
      subtitle: "Real-time Pursuit with PID Control",
      category: "Robotics",
      duration: "2 months",
      team: "Solo project",

      problem: {
        title: "The Challenge",
        description: "Autonomous drone navigation required robust object tracking capabilities with real-time performance, handling occlusions, and maintaining stable flight control.",
        painPoints: [
          "Real-time object tracking at 30 FPS requirement",
          "Handling occlusions and tracking failures",
          "Integrating vision with flight control systems",
          "Dealing with noisy sensor measurements",
          "Achieving smooth flight paths with minimal oscillation"
        ]
      },

      solution: {
        title: "The Solution",
        description: "Built a comprehensive drone navigation system with real-time object tracking, PID control, and GPS/vision fusion for robust autonomous flight.",
        approach: [
          {
            phase: "Object Tracking",
            details: "Implemented robust tracking algorithms using OpenCV with real-time performance optimization"
          },
          {
            phase: "Control System",
            details: "Designed closed-loop PID controllers for smooth flight path corrections and stable navigation"
          },
          {
            phase: "Sensor Fusion (v2)",
            details: "Integrated GPS and IMU data with vision for enhanced robustness under noisy conditions"
          },
          {
            phase: "Latency Optimization",
            details: "Implemented latency-aware command outputs for responsive real-time control"
          }
        ],
        technologies: ["OpenCV", "Python", "PID Control", "GPS", "IMU", "Sensor Fusion"]
      },

      results: {
        title: "Results & Impact",
        metrics: [
          { label: "Tracking FPS", value: "30", description: "Real-time performance" },
          { label: "Occlusion Handling", value: "✓", description: "Robust to interruptions" },
          { label: "GPS Fusion", value: "✓", description: "Enhanced navigation accuracy" },
          { label: "Control Stability", value: "✓", description: "Smooth flight paths" }
        ],
        outcomes: [
          "Achieved real-time object tracking at 30 FPS",
          "Successfully handled occlusions and tracking failures",
          "Implemented smooth PID control for stable flight",
          "Enhanced robustness with GPS/IMU + vision fusion",
          "Created latency-aware system for responsive control"
        ]
      },

      lessons: {
        title: "Key Learnings",
        insights: [
          "Real-time performance requires careful optimization of tracking algorithms",
          "Sensor fusion significantly improves robustness in challenging conditions",
          "PID control tuning is crucial for smooth autonomous navigation",
          "Latency-aware design is essential for responsive control systems",
          "Handling edge cases (occlusions, failures) is critical for reliable operation"
        ]
      },

      github: "https://github.com/lax-17/drone-mavic",
      demo: "https://drone-navigation-demo.vercel.app",
      featured: false
    }
  ];

  const getIconForPhase = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'data generation':
      case 'architecture design':
        return <Brain className="w-5 h-5" />;
      case 'model fine-tuning':
      case 'training optimization':
        return <Cog className="w-5 h-5" />;
      case 'safety implementation':
      case 'training stabilization':
        return <CheckCircle className="w-5 h-5" />;
      case 'deployment pipeline':
      case 'evaluation metrics':
        return <Zap className="w-5 h-5" />;
      default:
        return <ArrowRight className="w-5 h-5" />;
    }
  };

  return (
    <section id="case-studies" className="min-h-screen flex items-center py-20 scroll-mt-20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-section text-cosmic mb-8 text-center"
          >
            Projects & Case Studies
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive showcase of my key projects with detailed case studies, technical implementations, and measurable results.
              Each project demonstrates end-to-end problem-solving from conception to deployment.
            </p>
          </motion.div>

          {/* Projects & Case Studies Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedCase(selectedCase === study.id ? null : study.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                    {study.category}
                  </div>
                  {study.featured && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs">
                      <Eye className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Image Preview */}
                {imageMap[study.id]?.length ? (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img
                      src={imageMap[study.id][0]}
                      alt={`${study.title} preview`}
                      className="w-full h-40 object-cover cursor-zoom-in"
                      onClick={(e) => { e.stopPropagation(); openLightbox(imageMap[study.id], 0); }}
                    />
                  </div>
                ) : null}

                <h3 className="text-xl font-bold text-cosmic mb-2">{study.title}</h3>
                <p className="text-primary font-medium mb-3">{study.subtitle}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {study.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {study.team}
                  </span>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {study.problem.description.substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-primary hover:gap-3 transition-all duration-300 font-medium">
                    {selectedCase === study.id ? 'Hide Details' : 'View Case Study'}
                    <ArrowRight size={16} className={selectedCase === study.id ? 'rotate-90' : ''} />
                  </button>

                  <div className="flex gap-2">
                    {study.github && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(study.github, '_blank');
                        }}
                        className="p-2 glass-card hover:bg-primary/20 transition-colors"
                        aria-label="Open GitHub"
                      >
                        <Github size={16} />
                      </button>
                    )}
                    {(study as any).huggingface && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open((study as any).huggingface, '_blank');
                        }}
                        className="px-2 py-1 glass-card hover:bg-primary/20 transition-colors text-sm"
                        aria-label="Open Hugging Face"
                        title="Hugging Face"
                      >
                        <span className="text-lg leading-none">🤗</span>
                      </button>
                    )}
                    {study.demo && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(study.demo, '_blank');
                        }}
                        className="p-2 glass-card hover:bg-primary/20 transition-colors"
                        aria-label="Open Demo"
                      >
                        <ExternalLink size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Case Study Details */}
                {selectedCase === study.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-glass-border space-y-8"
                  >
                    {/* Visuals */}
                    {imageMap[study.id]?.length ? (
                      <div className="mb-6">
                        {imageMap[study.id].length === 1 ? (
                          <img
                            src={imageMap[study.id][0]}
                            alt={`${study.title} visual`}
                            className="w-full h-64 object-cover rounded-lg cursor-zoom-in"
                            onClick={() => openLightbox(imageMap[study.id], 0)}
                          />
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {imageMap[study.id].map((src, idx) => (
                              <img
                                key={idx}
                                src={src}
                                alt={`${study.title} visual ${idx + 1}`}
                                className="w-full h-24 object-cover rounded-md cursor-zoom-in"
                                onClick={() => openLightbox(imageMap[study.id], idx)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Problem Section */}
                    <div>
                      <h4 className="text-lg font-bold text-cosmic mb-3 flex items-center gap-2">
                        <Target className="text-red-500" size={20} />
                        {study.problem.title}
                      </h4>
                      <p className="text-muted-foreground mb-4">{study.problem.description}</p>
                      <div className="space-y-2">
                        {study.problem.painPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <AlertCircle className="text-red-500 mt-0.5" size={16} />
                            <span className="text-sm text-muted-foreground">{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Solution Section */}
                    <div>
                      <h4 className="text-lg font-bold text-cosmic mb-3 flex items-center gap-2">
                        <Lightbulb className="text-yellow-500" size={20} />
                        {study.solution.title}
                      </h4>
                      <p className="text-muted-foreground mb-4">{study.solution.description}</p>
                      
                      <div className="space-y-4 mb-4">
                        {study.solution.approach.map((phase, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="text-primary mt-1">
                              {getIconForPhase(phase.phase)}
                            </div>
                            <div>
                              <h5 className="font-semibold text-foreground mb-1">{phase.phase}</h5>
                              <p className="text-sm text-muted-foreground">{phase.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {study.solution.technologies.map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Results Section */}
                    <div>
                      <h4 className="text-lg font-bold text-cosmic mb-3 flex items-center gap-2">
                        <TrendingUp className="text-green-500" size={20} />
                        {study.results.title}
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {study.results.metrics.map((metric, idx) => (
                          <div key={idx} className="text-center p-3 bg-muted/30 rounded-lg">
                            <div className="text-2xl font-bold text-primary mb-1">{metric.value}</div>
                            <div className="text-sm font-medium text-foreground mb-1">{metric.label}</div>
                            <div className="text-xs text-muted-foreground">{metric.description}</div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        {study.results.outcomes.map((outcome, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="text-green-500 mt-0.5" size={16} />
                            <span className="text-sm text-muted-foreground">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lessons Section */}
                    <div>
                      <h4 className="text-lg font-bold text-cosmic mb-3 flex items-center gap-2">
                        <BarChart3 className="text-blue-500" size={20} />
                        {study.lessons.title}
                      </h4>
                      <div className="space-y-2">
                        {study.lessons.insights.map((insight, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Lightbulb className="text-yellow-500 mt-0.5" size={16} />
                            <span className="text-sm text-muted-foreground">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Project Portfolio Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="glass-card p-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-cosmic mb-2">Project Portfolio Summary</h3>
              <p className="text-muted-foreground">Comprehensive overview of my technical projects and research contributions</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">{caseStudies.length}</div>
                <div className="text-sm text-muted-foreground">Major Projects</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {[...new Set(caseStudies.map(s => s.category))].length}
                </div>
                <div className="text-sm text-muted-foreground">Technical Domains</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {caseStudies.filter(s => s.featured).length}
                </div>
                <div className="text-sm text-muted-foreground">Featured Projects</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {Math.round(caseStudies.reduce((acc, s) => acc + parseInt(s.duration), 0) / caseStudies.length)}
                </div>
                <div className="text-sm text-muted-foreground">Avg Duration (months)</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      {/* Lightbox for images */}
      <AnimatePresence>
        {lightbox.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              className="relative w-full h-full max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.images[lightbox.index]}
                alt={`Project visual ${lightbox.index + 1}`}
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />

              {/* Close */}
              <button
                aria-label="Close"
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                onClick={closeLightbox}
              >
                <X className="w-5 h-5" />
              </button>

              {lightbox.images.length > 1 && (
                <>
                  {/* Prev */}
                  <button
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    onClick={() =>
                      setLightbox((lb) => ({
                        ...lb,
                        index: (lb.index - 1 + lb.images.length) % lb.images.length,
                      }))
                    }
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  {/* Next */}
                  <button
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    onClick={() =>
                      setLightbox((lb) => ({
                        ...lb,
                        index: (lb.index + 1) % lb.images.length,
                      }))
                    }
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Thumbnails */}
                  <div className="absolute left-0 right-0 bottom-2 mx-auto flex gap-2 overflow-x-auto px-4 py-2">
                    {lightbox.images.map((thumb, idx) => (
                      <button
                        key={idx}
                        className={`h-14 w-20 rounded border ${idx === lightbox.index ? 'border-primary' : 'border-white/20'} overflow-hidden`}
                        onClick={() => setLightbox((lb) => ({ ...lb, index: idx }))}
                        aria-label={`Go to image ${idx + 1}`}
                      >
                        <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaseStudiesSection;