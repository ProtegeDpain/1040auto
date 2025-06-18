import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'system' | 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Check environment variable to identify your system
const isYourSystem = import.meta.env.VITE_IS_YOUR_SYSTEM === 'true';

export default function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Initialize theme with explicit checks and logging
  const [theme, setTheme] = useState<Theme>(() => {
    // On your system, always use 'light'
    if (isYourSystem) {
      console.log('Your system detected (via env variable), forcing theme to light');
      return 'light';
    }

    // On other systems, check localStorage
    const storedTheme = localStorage.getItem(storageKey);
    console.log('Stored theme:', storedTheme);

    // If no stored theme, use defaultTheme ('light')
    const initialTheme = storedTheme ? (storedTheme as Theme) : defaultTheme;
    console.log('Initial theme set to:', initialTheme);
    return initialTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    console.log('Applying theme:', theme);

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Apply the theme
    if (isYourSystem) {
      console.log('Applying light theme on your system');
      root.classList.add('light');
      localStorage.setItem(storageKey, 'light'); // Ensure localStorage reflects the forced theme
    } else {
      console.log(`Applying theme ${theme} on other system`);
      root.classList.add(theme);
    }

    // Log the current classes on the root element for debugging
    console.log('Current root classes:', root.classList.toString());
  }, [theme, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (isYourSystem) {
        console.log('Theme change blocked on your system');
        return; // Prevent theme changes on your system
      }
      console.log('Setting new theme:', newTheme);
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    }
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used with a ThemeProvider');
  return context;
};