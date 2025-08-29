import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type PortfolioMode = 'cosmic' | 'normal-bg' | 'basic';

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

  // Initialize portfolio mode from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('portfolioMode') as PortfolioMode | null;
    if (savedMode && (savedMode === 'cosmic' || savedMode === 'normal-bg' || savedMode === 'basic')) {
      setPortfolioMode(savedMode);
    }
  }, []);

  // Save to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('portfolioMode', portfolioMode);
  }, [portfolioMode]);

  const togglePortfolioMode = () => {
    setPortfolioMode(prevMode => {
      switch (prevMode) {
        case 'cosmic': return 'normal-bg';
        case 'normal-bg': return 'basic';
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
export type BackgroundMode = 'cosmic' | 'normal-bg';
export const useBackgroundMode = usePortfolioMode;
export const BackgroundModeProvider = PortfolioModeProvider;