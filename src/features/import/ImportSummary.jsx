import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, Card, InfoRow } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

/**
 * The result after importing: how many tasks were added, skipped and failed.
 * @param {object} props
 * @param {{ imported: number, skipped: number, failed: number }} props.summary
 */
export function ImportSummary({ summary }) {
  const { colors, spacing } = useTheme();
  const { imported, skipped, failed } = summary;

  const headline =
    imported === 0
      ? 'No tasks were imported'
      : `${imported} ${imported === 1 ? 'task' : 'tasks'} imported`;

  return (
    <Card style={{ gap: spacing.md }}>
      <View style={[styles.row, { gap: spacing.sm }]}>
        <Ionicons
          name={imported > 0 ? 'checkmark-circle' : 'information-circle'}
          size={28}
          color={imported > 0 ? colors.success : colors.textMuted}
        />
        <AppText variant="heading" style={styles.headline}>
          {headline}
        </AppText>
      </View>

      <View>
        <InfoRow label="Imported" value={String(imported)} valueColor={colors.success} />
        <InfoRow label="Skipped (duplicates)" value={String(skipped)} valueColor={colors.warning} />
        <InfoRow
          label="Failed (invalid)"
          value={String(failed)}
          valueColor={colors.danger}
          isLast
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  headline: { flex: 1 },
});
