import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AboutSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section id="about" className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-section text-cosmic mb-12 text-center"
          >
            About Me
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-lg text-foreground leading-relaxed mb-6"
                >
                  I'm an <span className="text-cosmic font-semibold">AI/ML Engineer</span> with 
                  hands-on experience in multi-modal models, LLM fine-tuning, and computer vision. 
                  My passion lies in pushing the boundaries of artificial intelligence to solve 
                  real-world problems.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-lg text-muted-foreground leading-relaxed mb-8"
                >
                  I've achieved a <span className="text-primary font-semibold">40% accuracy improvement</span> over 
                  published baselines in my research, demonstrating my ability to innovate and optimize 
                  cutting-edge AI systems.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="flex flex-wrap gap-3"
                >
                  {["Innovation", "Research", "Problem Solving", "Team Collaboration"].map((trait, index) => (
                    <motion.span
                      key={trait}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                      className="px-4 py-2 glass-card text-sm font-medium text-primary"
                    >
                      {trait}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative"
              >
                <div className="glass-card p-6 text-center">
                  <div className="text-4xl font-bold text-cosmic mb-2">3+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="glass-card p-6 text-center mt-4"
                >
                  <div className="text-4xl font-bold text-cosmic mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">AI Projects</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1.4 }}
                  className="glass-card p-6 text-center mt-4"
                >
                  <div className="text-4xl font-bold text-cosmic mb-2">40%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Improvement</div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;