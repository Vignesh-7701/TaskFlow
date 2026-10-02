import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { Button } from './Button';

/**
 * Shown when there is nothing to list: an icon, a title, a message and an optional button.
 * @param {object} props
 * @param {string} props.title  the main line, e.g. "No tasks yet"
 * @param {string} [props.message]  a second, smaller line
 * @param {string} [props.icon]  an Ionicons icon name
 * @param {string} [props.actionLabel]  the words on the button
 * @param {() => void} [props.onAction]  what the button does
 * @param {object} [props.style]  extra style
 */
export function EmptyState({
  title,
  message,
  icon = 'file-tray-outline',
  actionLabel,
  onAction,
  style,
}) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.base, { padding: spacing.xl, gap: spacing.sm }, style]}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />

      <AppText variant="heading" style={styles.centered}>
        {title}
      </AppText>

      {message ? (
        <AppText variant="muted" style={styles.centered}>
          {message}
        </AppText>
      ) : null}

      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={{ marginTop: spacing.sm }} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  centered: { textAlign: 'center' },
});
