import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

/**
 * A spinner in the middle of the available space, shown while something is loading.
 * @param {object} props
 * @param {string} [props.label]  what a screen reader says
 */
export function Loader({ label = 'Loading' }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.fill, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} accessibilityLabel={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
