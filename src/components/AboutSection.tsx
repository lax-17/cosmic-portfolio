import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const AboutSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section id="about" className="min-h-screen flex items-center py-20 scroll-mt-20">
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
                  I'm an <span className="text-cosmic font-semibold">Applied AI/ML Engineer</span> specializing in LLMs, Transformers, and multi-modal systems.
                  I build end-to-end, production-ready AI applications with a strong focus on reliability, safety, and measurable impact.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="text-lg text-muted-foreground leading-relaxed mb-8"
                >
                  Recent highlights include a clinical narratives LLM platform (QLoRA fine-tuning, schema-faithful JSON outputs, safety/hallucination checks, Docker/llama.cpp for offline inference)
                  and a multi-modal Transformer achieving <span className="text-primary font-semibold">0.350 macro-F1</span> and 53.4% accuracy on a 7-class dataset without per-user personalization.
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
                  <div className="text-4xl font-bold text-cosmic mb-2">0.350</div>
                  <div className="text-sm text-muted-foreground">Macro-F1 (7-class)</div>
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