import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

/**
 * The chosen file's name, size and number of task rows.
 * @param {object} props
 * @param {string} props.name
 * @param {number} props.size  in bytes
 * @param {number} [props.rowCount]
 * @param {boolean} [props.hasHeader]
 */
export function FileInfoCard({ name, size, rowCount, hasHeader }) {
  const { colors, spacing } = useTheme();

  // 1 KB is 1024 bytes. One decimal place is enough: "4.2 KB".
  const sizeText = `${(size / 1024).toFixed(1)} KB`;

  const details = [sizeText];
  if (rowCount !== undefined) {
    details.push(`${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`);
    details.push(hasHeader ? 'with header' : 'no header');
  }

  return (
    <Card style={[styles.row, { gap: spacing.md }]}>
      <Ionicons name="document-text-outline" size={28} color={colors.primary} />
      <View style={styles.text}>
        <AppText style={styles.name} numberOfLines={1}>
          {name}
        </AppText>
        <AppText variant="muted">{details.join(' · ')}</AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1 },
  name: { fontWeight: '600' },
});
