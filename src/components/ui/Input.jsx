import { StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

import { AppText } from './AppText';

/**
 * A text field with an optional label above and an error message below.
 * Any other TextInput prop (value, onChangeText, placeholder...) is passed through.
 * @param {object} props
 * @param {string} [props.label]  the words above the field
 * @param {string} [props.error]  an error message; also turns the border red
 * @param {boolean} [props.multiline]  true makes a taller field for several lines
 * @param {object} [props.style]  extra style for the field
 */
export function Input({ label, error, multiline = false, style, ...rest }) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      {label ? (
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <TextInput
        multiline={multiline}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={label}
        style={[
          styles.field,
          typography.body,
          {
            color: colors.text,
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radius.sm,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
          },
          multiline && styles.multiline,
          style,
        ]}
        {...rest}
      />

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
  field: { minHeight: 48, borderWidth: 1 },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
});
