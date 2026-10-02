import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

/**
 * A small pill that can be selected. Used for filters, priority and status.
 * @param {object} props
 * @param {string} props.label  the words on the chip
 * @param {boolean} [props.selected]  true fills the chip with the primary color
 * @param {() => void} [props.onPress]  what to do when it is pressed
 * @param {object} [props.style]  extra style
 */
export function Chip({ label, selected = false, onPress, style }) {
  const { colors, spacing, radius } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={spacing.xs}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      <AppText variant="caption" style={{ color: selected ? colors.onPrimary : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 36,
    borderWidth: 1,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressed: { opacity: 0.7 },
});
