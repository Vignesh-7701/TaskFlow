import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

/**
 * A tappable card on the Dashboard that leads to Bulk Upload.
 * @param {object} props
 * @param {() => void} props.onPress
 */
export function UploadShortcut({ onPress }) {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Bulk upload tasks from a CSV file"
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card style={[styles.row, { gap: spacing.md }]}>
        <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
        <View style={styles.text}>
          <AppText style={styles.title}>Bulk Upload</AppText>
          <AppText variant="muted">Import many tasks from a CSV file</AppText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1 },
  title: { fontWeight: '600' },
  pressed: { opacity: 0.7 },
});
