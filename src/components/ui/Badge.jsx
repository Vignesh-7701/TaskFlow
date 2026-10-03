import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

/**
 * A small outlined label, e.g. "Pending" or "Overdue".
 * @param {object} props
 * @param {string} props.label  the words
 * @param {string} props.color  a theme color for the border and the words
 */
export function Badge({ label, color }) {
  const { spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.base,
        { borderColor: color, borderRadius: radius.pill, paddingHorizontal: spacing.sm },
      ]}
    >
      <AppText variant="caption" style={[styles.label, { color }]}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, alignSelf: 'flex-start' },
  label: { fontWeight: '600' },
});
