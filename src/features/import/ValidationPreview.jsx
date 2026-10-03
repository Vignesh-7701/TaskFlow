import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, InfoRow } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

// How many problems to show before "Show all".
const COLLAPSED_COUNT = 5;

/**
 * The check result for a file: three counts, then every rejected row with its reason.
 * @param {object} props
 * @param {{ valid: object[], invalid: object[], duplicates: object[] }} props.validation
 */
export function ValidationPreview({ validation }) {
  const { colors, spacing } = useTheme();
  const [showAll, setShowAll] = useState(false);

  const { valid, invalid, duplicates } = validation;

  // One list of every rejected row, in file order, each with the words to show.
  const problems = [
    ...invalid.map((item) => ({
      row: item.row,
      id: item.id,
      text: item.errors.join(', '),
      color: colors.danger,
    })),
    ...duplicates.map((item) => ({
      row: item.row,
      id: item.id,
      text: item.message,
      color: colors.warning,
    })),
  ].sort((a, b) => a.row - b.row);

  const shownProblems = showAll ? problems : problems.slice(0, COLLAPSED_COUNT);

  return (
    <View style={{ gap: spacing.md }}>
      <Card>
        <InfoRow label="Valid" value={String(valid.length)} valueColor={colors.success} />
        <InfoRow label="Invalid" value={String(invalid.length)} valueColor={colors.danger} />
        <InfoRow
          label="Duplicates"
          value={String(duplicates.length)}
          valueColor={colors.warning}
          isLast
        />
      </Card>

      {problems.length > 0 ? (
        <>
          <AppText variant="heading">Problems</AppText>
          <Card>
            {shownProblems.map((problem, index) => (
              <View
                key={`${problem.row}-${problem.id}`}
                style={[
                  { paddingVertical: spacing.sm, gap: spacing.xs },
                  index < shownProblems.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <AppText variant="caption" style={styles.where}>
                  Row {problem.row}
                  {problem.id ? ` · ${problem.id}` : ''}
                </AppText>
                <AppText variant="caption" style={{ color: problem.color }}>
                  {problem.text}
                </AppText>
              </View>
            ))}
          </Card>

          {problems.length > COLLAPSED_COUNT ? (
            <Button
              label={showAll ? 'Show fewer' : `Show all ${problems.length} problems`}
              variant="ghost"
              onPress={() => setShowAll(!showAll)}
            />
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  where: { fontWeight: '600' },
});
