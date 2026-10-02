import { useContext } from 'react';

import { ThemeContext } from './ThemeProvider';

/**
 * Gives a component the current theme.
 * @returns {{ colors: object, spacing: object, radius: object, typography: object, isDark: boolean }}
 */
export function useTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return theme;
}
