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
    <section id="experience" className="py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-section text-cosmic mb-8 md:mb-12 text-center cosmic-text"
          >
            Experience
          </motion.h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="timeline-line hidden md:block"></div>

            <div className="space-y-6 md:space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="relative md:pl-12"
                >
                  {/* Timeline Dot */}
                  <div className="timeline-dot hidden md:block"></div>

                  <motion.div
                    whileHover={{ scale: 1.01, y: -2 }}
                    className="glass-card p-4 md:p-6 cursor-pointer cosmic-border"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-bold text-cosmic mb-1 cosmic-text">
                          {exp.title}
                        </h3>
                        <h4 className="text-base text-foreground font-semibold mb-2">
                          {exp.company}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                      <div className="md:text-right md:ml-4 mt-2 md:mt-0 flex-shrink-0">
                        <div className="text-primary font-medium text-sm">{exp.period}</div>
                        <div className="text-xs text-muted-foreground">{exp.location}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {exp.highlights.map((highlight, hIndex) => (
                        <motion.span
                          key={hIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={inView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 + hIndex * 0.05 }}
                          className="px-2 py-1 text-xs font-medium glass-card text-primary cosmic-glow"
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