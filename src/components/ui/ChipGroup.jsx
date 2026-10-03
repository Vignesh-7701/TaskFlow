import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';
import { Chip } from './Chip';

/**
 * A label with a row of chips, of which exactly one is chosen. Like radio buttons.
 * @param {object} props
 * @param {string} [props.label]  the words above the chips
 * @param {{ value: string, label: string }[]} props.options  the choices
 * @param {string} props.value  the chosen option's value
 * @param {(value: string) => void} props.onChange  called with the tapped option's value
 * @param {string} [props.error]  an error message shown below
 */
export function ChipGroup({ label, options, value, onChange, error }) {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      {label ? (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View style={[styles.row, { gap: spacing.sm }]}>
        {options.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={value === option.value}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>

      {error ? (
        <AppText variant="caption" style={{ color: colors.danger }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '600' },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
});
