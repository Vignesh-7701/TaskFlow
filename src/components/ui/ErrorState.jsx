import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { Button } from './Button';

/**
 * Shown when something failed: a red icon, a message and an optional retry button.
 * @param {object} props
 * @param {string} [props.title]  the main line
 * @param {string} [props.message]  what went wrong
 * @param {string} [props.retryLabel]  the words on the button
 * @param {() => void} [props.onRetry]  what the button does; no button when left out
 * @param {object} [props.style]  extra style
 */
export function ErrorState({
  title = 'Something went wrong',
  message,
  retryLabel = 'Try again',
  onRetry,
  style,
}) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.base, { padding: spacing.xl, gap: spacing.sm }, style]}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />

      <AppText variant="heading" style={styles.centered}>
        {title}
      </AppText>

      {message ? (
        <AppText variant="muted" style={styles.centered}>
          {message}
        </AppText>
      ) : null}

      {onRetry ? (
        <Button
          label={retryLabel}
          variant="secondary"
          onPress={onRetry}
          style={{ marginTop: spacing.sm }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  centered: { textAlign: 'center' },
});
