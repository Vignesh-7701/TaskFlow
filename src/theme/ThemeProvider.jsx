import { createContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';

import { useSettingsStore } from '@/store/settingsStore';
import { darkColors, lightColors, radius, spacing, typography } from './tokens';

export const ThemeContext = createContext(null);

/**
 * Chooses light or dark colors and makes the theme available to everything inside it.
 * @param {{ children: React.ReactNode }} props
 */
export function ThemeProvider({ children }) {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const systemScheme = useColorScheme();

  let isDark;
  if (themeMode === 'system') {
    isDark = systemScheme === 'dark';
  } else {
    isDark = themeMode === 'dark';
  }

  const theme = useMemo(
    () => ({
      colors: isDark ? darkColors : lightColors,
      spacing,
      radius,
      typography,
      isDark,
    }),
    [isDark],
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
