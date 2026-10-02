import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/useTheme';

/**
 * Floating Action Button: a round button that floats at the bottom right of a screen.
 * @param {object} props
 * @param {() => void} props.onPress  what to do when it is pressed
 * @param {string} props.accessibilityLabel  what a screen reader says, e.g. "Add task"
 * @param {string} [props.icon]  an Ionicons icon name
 * @param {object} [props.style]  extra style
 */
export function FAB({ onPress, accessibilityLabel, icon = 'add', style }) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: colors.primary,
          borderRadius: radius.pill,
          right: spacing.lg,
          bottom: spacing.lg,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <Ionicons name={icon} size={28} color={colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  pressed: { opacity: 0.7 },
});
