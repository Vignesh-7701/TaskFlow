import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

/**
 * A pressable button with a text label.
 * @param {object} props
 * @param {string} props.label  the words on the button
 * @param {() => void} props.onPress  what to do when it is pressed
 * @param {'primary'|'secondary'|'danger'|'ghost'} [props.variant]  which look to use
 * @param {boolean} [props.loading]  true shows a spinner and blocks presses
 * @param {boolean} [props.disabled]  true blocks presses
 * @param {object} [props.style]  extra style
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) {
  const { colors, spacing, radius } = useTheme();

  const variants = {
    primary: { background: colors.primary, border: colors.primary, text: colors.onPrimary },
    secondary: { background: 'transparent', border: colors.primary, text: colors.primary },
    danger: { background: 'transparent', border: colors.danger, text: colors.danger },
    ghost: { background: 'transparent', border: 'transparent', text: colors.primary },
  };
  const look = variants[variant];

  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: look.background,
          borderColor: look.border,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.lg,
        },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={look.text} />
      ) : (
        <AppText style={[styles.label, { color: look.text }]}>{label}</AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  label: { fontWeight: '600' },
});
