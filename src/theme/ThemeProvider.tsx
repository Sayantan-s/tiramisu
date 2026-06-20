import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme, type ThemeName } from './theme';

const ThemeContext = createContext<Theme>(lightTheme);

export type ThemeProviderProps = {
  children: ReactNode;
  /**
   * Force a specific theme regardless of the OS color scheme. Used by Storybook's
   * theme toggle; the app itself leaves this unset to follow the device setting.
   */
  forcedScheme?: ThemeName;
};

export function ThemeProvider({ children, forcedScheme }: ThemeProviderProps) {
  const scheme = useColorScheme();
  const name: ThemeName = forcedScheme ?? (scheme === 'dark' ? 'dark' : 'light');
  const theme = useMemo(() => (name === 'dark' ? darkTheme : lightTheme), [name]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): Theme => useContext(ThemeContext);
