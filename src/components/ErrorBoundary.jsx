import { Ionicons } from '@expo/vector-icons';
import { Component } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { darkColors, lightColors, radius, spacing, typography } from '@/theme/tokens';

/**
 * Catches a crash anywhere inside it and shows a "Something went wrong" screen
 * with a Restart button, instead of a blank or red screen.
 *
 * Error boundaries must be class components: React has no hook for catching render errors.
 * @param {{ children: React.ReactNode }} props
 */
export class ErrorBoundary extends Component {
  state = { error: null };

  // React calls this when something inside crashes while drawing.
  // What it returns is merged into `state`, so the next draw shows the fallback.
  static getDerivedStateFromError(error) {
    return { error };
  }

  // Forget the error and draw the app again from the start.
  restart = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback onRestart={this.restart} />;
    }
    return this.props.children;
  }
}

/**
 * The screen shown after a crash. It does not use ThemeProvider or our ui components,
 * because the crash may have come from them. It reads the tokens directly instead.
 * @param {{ onRestart: () => void }} props
 */
function ErrorFallback({ onRestart }) {
  const colors = useColorScheme() === 'dark' ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]}>
      <Ionicons name="alert-circle-outline" size={56} color={colors.danger} />

      <Text style={[typography.heading, styles.centered, { color: colors.text }]}>
        Something went wrong
      </Text>
      <Text style={[typography.body, styles.centered, { color: colors.textMuted }]}>
        The app hit an unexpected problem. Your tasks are safe.
      </Text>

      <Pressable
        onPress={onRestart}
        accessibilityRole="button"
        accessibilityLabel="Restart the app"
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.primary },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[typography.body, styles.buttonText, { color: colors.onPrimary }]}>
          Restart
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  centered: { textAlign: 'center' },
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonText: { fontWeight: '600' },
  pressed: { opacity: 0.7 },
});
