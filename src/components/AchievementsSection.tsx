import { motion } from "framer-motion";
import { Trophy, TrendingUp, Award, Target } from "lucide-react";

const AchievementsSection = () => {
  const achievements = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "40% Accuracy Improvement",
      description: "Enhanced model performance over industry baselines through advanced optimization techniques",
      metric: "40%",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Computer Vision Expertise",
      description: "Specialized in object detection, image classification, and segmentation tasks",
      metric: "5+ Years",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "PyTorch & Transformers",
      description: "Proficient in state-of-the-art deep learning frameworks and transformer architectures",
      metric: "Expert",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Scalable ML Solutions",
      description: "Delivered production-ready machine learning systems for enterprise applications",
      metric: "10+ Projects",
      color: "from-orange-500 to-red-600"
    }
  ];

  return (
    <section id="achievements" className="py-20 px-8" aria-labelledby="achievements-heading">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 id="achievements-heading" className="text-4xl font-bold mb-4">
            Key Achievements
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Measurable impact and expertise demonstrated through successful projects and technical excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="terminal-panel p-6 h-full hover:scale-105 transition-transform duration-300">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${achievement.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {achievement.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{achievement.description}</p>
                <div className="text-2xl font-bold text-primary">{achievement.metric}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;