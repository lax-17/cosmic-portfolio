import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const ExperienceSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const experiences = [
    {
      title: "AI Researcher",
      company: "Sheffield Hallam University",
      period: "June 2025 – Present",
      location: "Sheffield, UK",
      description: "Leading research in advanced AI systems and multi-modal models. Developing novel approaches to improve model performance and efficiency.",
      highlights: ["Research Leadership", "Publication Writing", "Model Development"],
    },
    {
      title: "Junior Developer Intern",
      company: "Tan Theta Software Studio",
      period: "Oct 2023 – Dec 2023",
      location: "Remote",
      description: "Contributed to AI-powered software solutions and gained hands-on experience in production-level ML systems.",
      highlights: ["Production ML", "Software Development", "Team Collaboration"],
    },
    {
      title: "Industry Collaboration Coordinator",
      company: "Ufa University",
      period: "Jan 2022 – June 2022",
      location: "Ufa, Russia",
      description: "Coordinated industry partnerships and research collaborations, bridging academic research with practical applications.",
      highlights: ["Partnership Management", "Research Coordination", "Industry Relations"],
    },
  ];

  return (
    <section id="experience" className="min-h-screen flex items-center py-20">
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
            Experience
          </motion.h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="timeline-line hidden md:block"></div>

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                  className="relative md:pl-16"
                >
                  {/* Timeline Dot */}
                  <div className="timeline-dot hidden md:block"></div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="glass-card p-6 md:p-8 cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-cosmic mb-2">
                          {exp.title}
                        </h3>
                        <h4 className="text-lg text-foreground font-semibold">
                          {exp.company}
                        </h4>
                      </div>
                      <div className="md:text-right mt-2 md:mt-0">
                        <div className="text-primary font-medium">{exp.period}</div>
                        <div className="text-sm text-muted-foreground">{exp.location}</div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.highlights.map((highlight, hIndex) => (
                        <motion.span
                          key={hIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.5, delay: 0.8 + index * 0.2 + hIndex * 0.1 }}
                          className="px-3 py-1 text-xs font-medium glass-card text-primary"
                        >
                          {highlight}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExperienceSection;