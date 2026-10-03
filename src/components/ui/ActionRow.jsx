import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

/**
 * A tappable settings-style row: icon, label, an optional note under it, and an arrow.
 * @param {object} props
 * @param {string} props.icon  an Ionicons icon name
 * @param {string} props.label  e.g. "Clear all tasks"
 * @param {string} [props.note]  a smaller line under the label
 * @param {() => void} [props.onPress]
 * @param {boolean} [props.danger]  true shows the icon and label in the danger color
 * @param {boolean} [props.disabled]  true fades the row and ignores taps
 * @param {boolean} [props.isLast]  true leaves out the line below
 */
export function ActionRow({
  icon,
  label,
  note,
  onPress,
  danger = false,
  disabled = false,
  isLast = false,
}) {
  const { colors, spacing } = useTheme();
  const color = danger ? colors.danger : colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={note ? `${label}. ${note}` : label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.row,
        { gap: spacing.md, paddingVertical: spacing.md },
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Ionicons name={icon} size={22} color={color} />
      <View style={styles.text}>
        <AppText style={[styles.label, { color }]}>{label}</AppText>
        {note ? <AppText variant="muted">{note}</AppText> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 48 },
  text: { flex: 1 },
  label: { fontWeight: '600' },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
});
