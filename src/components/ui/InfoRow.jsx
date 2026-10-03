import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

/**
 * One line of information: a label on the left, its value on the right,
 * with a thin line below unless it is the last row.
 * @param {object} props
 * @param {string} props.label  e.g. "Category"
 * @param {string} props.value  e.g. "Work"
 * @param {string} [props.valueColor]  a theme color for the value, e.g. colors.danger
 * @param {boolean} [props.isLast]  true leaves out the line below
 */
export function InfoRow({ label, value, valueColor, isLast = false }) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.row,
        { gap: spacing.md, paddingVertical: spacing.sm },
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      <AppText variant="muted">{label}</AppText>
      <AppText style={[styles.value, valueColor && { color: valueColor }]}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  value: { flex: 1, textAlign: 'right' },
});
