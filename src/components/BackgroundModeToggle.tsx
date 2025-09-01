import { motion } from "framer-motion";
import { Sparkles, Image, User } from "lucide-react";
import { usePortfolioMode } from "@/contexts/BackgroundModeContext";
import { useNavigate } from "react-router-dom";

const BackgroundModeToggle = () => {
  const { portfolioMode, setPortfolioMode } = usePortfolioMode();
  const navigate = useNavigate();

  const handleToggle = () => {
    let nextMode: 'cosmic' | 'professional' | 'basic';
    let nextRoute: string;

    switch (portfolioMode) {
      case 'cosmic':
        nextMode = 'professional';
        nextRoute = '/professional';
        break;
      case 'professional':
        nextMode = 'basic';
        nextRoute = '/basic';
        break;
      case 'basic':
      default:
        nextMode = 'cosmic';
        nextRoute = '/cosmic';
        break;
    }

    // Update context immediately
    setPortfolioMode(nextMode);
    // Then navigate
    navigate(nextRoute);
  };

  const getIcon = () => {
    switch (portfolioMode) {
      case 'cosmic': return <Sparkles size={16} className="text-primary-foreground" />;
      case 'professional': return <Image size={16} className="text-primary-foreground" />;
      case 'basic': return <User size={16} className="text-primary-foreground" />;
    }
  };

  const getPosition = () => {
    switch (portfolioMode) {
      case 'cosmic': return 12;
      case 'professional': return 0;
      case 'basic': return -12;
    }
  };

  const getAriaLabel = () => {
    switch (portfolioMode) {
      case 'cosmic': return "Switch to professional background";
      case 'professional': return "Switch to basic portfolio";
      case 'basic': return "Switch to cosmic portfolio";
    }
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="relative flex items-center justify-center w-16 h-6 rounded-full bg-panel border border-panel-border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={getAriaLabel()}
      role="switch"
      aria-checked={portfolioMode !== 'cosmic'}
    >
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-primary"
        initial={false}
        animate={{
          x: getPosition(),
          transition: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {getIcon()}
        </motion.div>
      </motion.div>

      {/* Cosmic glow effect */}
      <div className="absolute inset-0 rounded-full pointer-events-none">
        <div className="absolute inset-0 rounded-full bg-primary opacity-20 blur-sm"></div>
      </div>
    </motion.button>
  );
};

export default BackgroundModeToggle;