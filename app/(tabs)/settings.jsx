import { View } from 'react-native';

import { AppText, Chip, Screen } from '@/components/ui';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from '@/theme/useTheme';

const THEME_MODES = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Stub: the real Settings screen is built in Session 13. The theme chips are kept for testing.
export default function SettingsScreen() {
  const { spacing } = useTheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);

  return (
    <Screen style={{ gap: spacing.md }}>
      <AppText variant="title">Settings</AppText>
      <AppText variant="muted">The full Settings screen comes in Session 13.</AppText>

      <AppText variant="heading">Theme</AppText>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {THEME_MODES.map((mode) => (
          <Chip
            key={mode.value}
            label={mode.label}
            selected={themeMode === mode.value}
            onPress={() => setThemeMode(mode.value)}
          />
        ))}
      </View>
    </Screen>
  );
}
