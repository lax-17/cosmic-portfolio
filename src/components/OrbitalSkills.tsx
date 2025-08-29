import { motion } from "framer-motion";

const OrbitalSkills = () => {
  const skills = [
    { name: "PyTorch", angle: 0, radius: 200 },
    { name: "AI", angle: 60, radius: 250 },
    { name: "ML", angle: 120, radius: 180 },
    { name: "CV", angle: 180, radius: 220 },
    { name: "NLP", angle: 240, radius: 190 },
    { name: "LLM", angle: 300, radius: 230 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      {skills.map((skill, index) => {
        const x = Math.cos((skill.angle * Math.PI) / 180) * skill.radius;
        const y = Math.sin((skill.angle * Math.PI) / 180) * skill.radius;

        return (
          <motion.div
            key={skill.name}
            className="orbital-ring"
            style={{
              width: skill.radius * 2,
              height: skill.radius * 2,
              left: "50%",
              top: "50%",
              marginLeft: -skill.radius,
              marginTop: -skill.radius,
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 20 + index * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <motion.div
              className="orbital-skill"
              style={{
                left: skill.radius + x - 16,
                top: skill.radius + y - 16,
              }}
              animate={{ rotate: -360 }}
              transition={{
                duration: 20 + index * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {skill.name}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OrbitalSkills;