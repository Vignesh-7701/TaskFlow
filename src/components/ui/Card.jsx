import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';

/**
 * A raised box with a border and rounded corners that groups related content.
 * @param {object} props
 * @param {React.ReactNode} props.children  what to show inside the card
 * @param {object} [props.style]  extra style
 */
export function Card({ children, style }) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.md,
          padding: spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1 },
});
