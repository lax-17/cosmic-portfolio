import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import TerminalHero from "./components/TerminalHero";
import ProjectRepository from "./components/ProjectRepository";
import NeuralSkillsGraph from "./components/NeuralSkillsGraph";
import GitCommitTimeline from "./components/GitCommitTimeline";
import DataContactPanel from "./components/DataContactPanel";
import CommandLineNav from "./components/CommandLineNav";
import LiveTerminal from "./components/LiveTerminal";
import ParticleBackground from "./components/ParticleBackground";
import KeyboardShortcuts from "./components/KeyboardShortcuts";
import PageTransition from "./components/PageTransition";
import MobileNavigation from "./components/MobileNavigation";

const queryClient = new QueryClient();

const NeuralPortfolio = () => (
  <div className="relative">
    <ParticleBackground />
    <CommandLineNav />
    <TerminalHero />
    <ProjectRepository />
    <NeuralSkillsGraph />
    <GitCommitTimeline />
    <DataContactPanel />
    <LiveTerminal />
    <KeyboardShortcuts />
    <MobileNavigation />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTransition>
          <Routes>
            <Route path="/" element={<NeuralPortfolio />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
