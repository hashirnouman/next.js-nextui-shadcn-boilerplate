// contexts/LanguageContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UseContextType = {
  direction: string;
  setDirection: (dir: string) => void;
  theme : string;
  setTheme: (theme: string) => void;
};

const UseContext = createContext<UseContextType | undefined>(undefined);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [direction, setDirection] = useState('ltr');
  const [theme, setTheme] = useState('default');


  useEffect(() => {
    document.documentElement.setAttribute('dir', direction);
    document.documentElement.setAttribute('data-theme', theme);
  }, [direction, theme]);

  return (
    <UseContext.Provider value={{ direction, setDirection, theme, setTheme }}>
      {children}
    </UseContext.Provider>
  );
};

export const Context = () => {
  const context = useContext(UseContext);
  if (!context) {
    throw new Error('Context must be used within a ContextProvider');
  }
  return context;
};
