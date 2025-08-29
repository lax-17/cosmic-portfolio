import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-6 rounded-full bg-panel border border-panel-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      role="switch"
      aria-checked={theme === "dark"}
    >
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-primary"
        initial={false}
        animate={{
          x: theme === "dark" ? 12 : -12,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        {theme === "dark" ? (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Moon size={16} className="text-primary-foreground" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Sun size={16} className="text-primary-foreground" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Cosmic glow effect */}
      <div className="absolute inset-0 rounded-full pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-primary opacity-20 blur-sm"></div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;