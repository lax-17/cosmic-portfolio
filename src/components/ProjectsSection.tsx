import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, Box } from "lucide-react";
import { useState } from "react";
import Project3DShowcase from "./Project3DShowcase";

const ProjectsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  
    const [viewMode, setViewMode] = useState<"cards" | "3d">("cards");
  
    const projects = [
      {
        id: "clinical-narrative",
        title: "Clinical Narrative Assistant",
        tech: ["Llama 3", "QLoRA", "Hugging Face", "Python"],
        description: "Fine-tuned LLM for medical narrative processing with 600 structured patient profiles. Achieved significant improvements in clinical data extraction and analysis.",
        highlights: ["600+ Patient Profiles", "Medical NLP", "Production Ready"],
        category: "NLP/Healthcare",
      },
      {
        id: "drone-navigation",
        title: "Object-Tracking Drone Navigation",
        tech: ["OpenCV", "Python", "PID Control", "GPS Fusion"],
        description: "Real-time drone pursuit system with PID control and GPS fusion. Implemented advanced computer vision algorithms for autonomous navigation and tracking.",
        highlights: ["Real-time Tracking", "Autonomous Navigation", "Computer Vision"],
        category: "Computer Vision",
      },
      {
        id: "fmri-reconstruction",
        title: "fMRI Image Reconstruction",
        tech: ["StyleGAN2", "U-Net", "PyTorch", "Deep Learning"],
        description: "Benchmarked GAN architectures for brain imaging reconstruction. Developed novel approaches for high-quality medical image generation and analysis.",
        highlights: ["Medical Imaging", "GAN Architecture", "Research Impact"],
        category: "Medical AI",
      },
    ];
  return (
    <section id="projects" className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex justify-between items-center mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-section text-cosmic"
            >
              Featured Projects
            </motion.h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "cards"
                    ? "bg-primary text-primary-foreground"
                    : "bg-glass text-foreground hover:bg-primary/10"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "3d"
                    ? "bg-primary text-primary-foreground"
                    : "bg-glass text-foreground hover:bg-primary/10"
                }`}
              >
                <Box className="w-4 h-4" />
                3D Models
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {viewMode === "cards" ? (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  whileHover={{
                    y: -8,
                    rotateY: 5,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="glass-card group cursor-pointer perspective-1000"
                >
                  <div className="p-6 h-full flex flex-col">
                    {/* Category Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="inline-block w-fit px-3 py-1 text-xs font-semibold text-primary glass-card mb-4"
                    >
                      {project.category}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-cosmic mb-3 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-4 flex-grow">
                      {project.description}
                    </p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.highlights.map((highlight, hIndex) => (
                        <motion.span
                          key={hIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.5, delay: 1.0 + index * 0.2 + hIndex * 0.1 }}
                          className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                        >
                          {highlight}
                        </motion.span>
                      ))}
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech, tIndex) => (
                        <motion.span
                          key={tIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.5, delay: 1.2 + index * 0.2 + tIndex * 0.1 }}
                          className="px-3 py-1 text-xs font-medium glass-card text-foreground"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.2 }}
                      className="flex gap-3 mt-auto"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 glass-card px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <ExternalLink size={16} />
                        View Details
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 flex items-center justify-center"
                      >
                        <Github size={16} />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              ))
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  className="glass-card group cursor-pointer"
                >
                  <Project3DShowcase project={project} />
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;