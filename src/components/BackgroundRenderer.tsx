import { usePortfolioMode } from "@/contexts/BackgroundModeContext";
import CosmicShaderBackground from "./CosmicShaderBackground";
import NormalBackground from "./NormalBackground";

const BackgroundRenderer = () => {
  const { portfolioMode } = usePortfolioMode();

  // Only render background for cosmic and normal-bg modes
  if (portfolioMode === "basic") {
    return null; // Basic portfolio will handle its own background
  }

  return portfolioMode === "cosmic" ? <CosmicShaderBackground /> : <NormalBackground />;
};

export default BackgroundRenderer;