import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/useTheme';

const DEFAULT_EDGES = ['top', 'left', 'right'];

/**
 * The outer wrapper of every screen: safe area, background color and padding.
 * @param {object} props
 * @param {React.ReactNode} props.children  what to show inside the screen
 * @param {boolean} [props.scroll]  true makes the content scrollable
 * @param {object} [props.style]  extra style for the content area
 * @param {('top'|'bottom'|'left'|'right')[]} [props.edges]  which phone edges to keep clear of.
 *   The default suits tab screens: the tab bar already keeps clear of the bottom.
 */
export function Screen({ children, scroll = false, style, edges = DEFAULT_EDGES }) {
  const { colors, spacing } = useTheme();

  const safeAreaStyle = [styles.fill, { backgroundColor: colors.background }];
  const contentStyle = [{ padding: spacing.lg }, style];

  if (scroll) {
    return (
      <SafeAreaView style={safeAreaStyle} edges={edges}>
        <ScrollView contentContainerStyle={contentStyle} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={safeAreaStyle} edges={edges}>
      <View style={[styles.fill, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
