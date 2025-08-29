import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SkillsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const skillCategories = [
    {
      title: "ML/AI",
      skills: [
        { name: "PyTorch", level: 90 },
        { name: "Hugging Face", level: 85 },
        { name: "QLoRA", level: 80 },
        { name: "Transformers", level: 88 },
      ],
      color: "hsl(272, 91%, 60%)",
    },
    {
      title: "Computer Vision",
      skills: [
        { name: "OpenCV", level: 92 },
        { name: "DINOv2", level: 75 },
        { name: "MediaPipe", level: 82 },
        { name: "Image Processing", level: 89 },
      ],
      color: "hsl(261, 43%, 60%)",
    },
    {
      title: "NLP",
      skills: [
        { name: "Llama 3", level: 87 },
        { name: "Gemini 1.5 Pro", level: 83 },
        { name: "RAG", level: 85 },
        { name: "Fine-tuning", level: 90 },
      ],
      color: "hsl(214, 71%, 60%)",
    },
    {
      title: "Tools & Tech",
      skills: [
        { name: "Docker", level: 88 },
        { name: "CUDA", level: 82 },
        { name: "Linux", level: 91 },
        { name: "Python", level: 95 },
      ],
      color: "hsl(224, 47%, 60%)",
    },
  ];

  return (
    <section id="skills" className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-section text-cosmic mb-16 text-center"
          >
            Skills & Expertise
          </motion.h2>

          <div className="constellation-grid">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + categoryIndex * 0.2 }}
                className="glass-card p-6 relative group"
              >
                {/* Category Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 + categoryIndex * 0.1 }}
                  className="mb-6"
                >
                  <h3 className="text-xl font-bold text-cosmic mb-2">{category.title}</h3>
                  <div 
                    className="w-12 h-1 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                </motion.div>

                {/* Skills List */}
                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ 
                        duration: 0.5, 
                        delay: 1.0 + categoryIndex * 0.2 + skillIndex * 0.1 
                      }}
                      className="relative"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      
                      {/* Skill Bar Background */}
                      <div className="w-full h-2 bg-glass rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{ 
                            duration: 1.5, 
                            delay: 1.2 + categoryIndex * 0.2 + skillIndex * 0.1,
                            ease: "easeOut"
                          }}
                          className="h-full rounded-full relative"
                          style={{
                            background: `linear-gradient(90deg, ${category.color}, ${category.color}cc)`,
                          }}
                        >
                          {/* Glow Effect */}
                          <div 
                            className="absolute inset-0 rounded-full animate-pulse-glow"
                            style={{
                              boxShadow: `0 0 10px ${category.color}66`,
                            }}
                          ></div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-30"
                      style={{ 
                        backgroundColor: category.color,
                        left: `${20 + i * 30}%`,
                        top: `${30 + i * 20}%`,
                      }}
                      animate={{
                        x: [0, 20, -10, 0],
                        y: [0, -15, 10, 0],
                        scale: [1, 1.2, 0.8, 1],
                      }}
                      transition={{
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.8,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skill Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="glass-card p-8 mt-12 text-center"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              Specialized in <span className="text-cosmic font-semibold">cutting-edge AI technologies</span> with 
              a focus on practical applications. Continuously learning and adapting to the rapidly evolving 
              field of artificial intelligence and machine learning.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;