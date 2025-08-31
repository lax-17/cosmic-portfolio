import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Code, Heart, Coffee, BookOpen, Users, Target, Award, Zap } from "lucide-react";

const About = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const personalStory = [
    {
      year: "2021",
      title: "The Beginning",
      description: "Started my journey in AI/ML during my Master's at Ufa University of Science and Technology, fascinated by how machines could learn and understand patterns.",
      icon: BookOpen
    },
    {
      year: "2022",
      title: "First Breakthrough",
      description: "Built my first production AI system - a clinical narratives platform that could understand and generate medical reports with 95% accuracy.",
      icon: Zap
    },
    {
      year: "2023",
      title: "Research & Innovation",
      description: "Published research on multi-modal Transformers, achieving state-of-the-art results on emotion recognition tasks without user personalization.",
      icon: Award
    },
    {
      year: "2024",
      title: "Scaling Impact",
      description: "Working at Sheffield Hallam University, focusing on healthcare AI applications that make a real difference in people's lives.",
      icon: Target
    }
  ];

  const values = [
    { icon: Code, title: "Clean Code", description: "Writing maintainable, scalable solutions" },
    { icon: Users, title: "Collaboration", description: "Building great products with amazing teams" },
    { icon: Heart, title: "Impact", description: "Creating AI that serves humanity" },
    { icon: Coffee, title: "Continuous Learning", description: "Always exploring new technologies and approaches" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              My Journey in AI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From curious student to AI engineer, here's the story of how I fell in love with machine learning
              and the impact it can have on healthcare and beyond.
            </p>
          </motion.div>

          {/* Personal Story Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              The Journey
            </h2>
            <div className="space-y-8">
              {personalStory.map((story, index) => (
                <motion.div
                  key={story.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 + index * 0.2 }}
                  className="flex items-center gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <story.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                        {story.year}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {story.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {story.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              What Drives Me
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                Let's Build Something Amazing Together
              </h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                I'm always excited to work on challenging problems that push the boundaries of what's possible with AI.
                Whether it's healthcare, research, or innovative applications, let's connect and explore opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#contact"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get In Touch
                </a>
                <a
                  href="/#projects"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  View My Work
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;