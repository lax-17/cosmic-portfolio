import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type PortfolioMode = 'cosmic' | 'professional' | 'basic';

interface PortfolioModeContextType {
  portfolioMode: PortfolioMode;
  togglePortfolioMode: () => void;
  setPortfolioMode: (mode: PortfolioMode) => void;
}

const PortfolioModeContext = createContext<PortfolioModeContextType | undefined>(undefined);

interface PortfolioModeProviderProps {
  children: ReactNode;
}

export const PortfolioModeProvider: React.FC<PortfolioModeProviderProps> = ({ children }) => {
  const [portfolioMode, setPortfolioMode] = useState<PortfolioMode>('cosmic');

  // Initialize portfolio mode from localStorage (+ migrate old key values)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('portfolioMode');
      // Migrate legacy 'normal-bg' to 'professional'
      if (raw === 'normal-bg') {
        localStorage.setItem('portfolioMode', 'professional');
        setPortfolioMode('professional');
        return;
      }
      const savedMode = raw as PortfolioMode | null;
      if (savedMode && (savedMode === 'cosmic' || savedMode === 'professional' || savedMode === 'basic')) {
        setPortfolioMode(savedMode);
      }
    }
  }, []);

  // Save to localStorage when mode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolioMode', portfolioMode);
    }
  }, [portfolioMode]);

  const togglePortfolioMode = () => {
    setPortfolioMode(prevMode => {
      switch (prevMode) {
        case 'cosmic': return 'professional';
        case 'professional': return 'basic';
        case 'basic': return 'cosmic';
        default: return 'cosmic';
      }
    });
  };

  const value = {
    portfolioMode,
    togglePortfolioMode,
    setPortfolioMode
  };

  return (
    <PortfolioModeContext.Provider value={value}>
      {children}
    </PortfolioModeContext.Provider>
  );
};

export const usePortfolioMode = (): PortfolioModeContextType => {
  const context = useContext(PortfolioModeContext);
  if (context === undefined) {
    throw new Error('usePortfolioMode must be used within a PortfolioModeProvider');
  }
  return context;
};

// Legacy exports for backward compatibility
export type BackgroundMode = 'cosmic' | 'professional';
export const useBackgroundMode = usePortfolioMode;
export const BackgroundModeProvider = PortfolioModeProvider;