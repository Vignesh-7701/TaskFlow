import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PRIORITY } from '@/models/task';
import { useTheme } from '@/theme/useTheme';

/**
 * A small colored label showing a task's priority.
 * @param {object} props
 * @param {'low'|'medium'|'high'} props.priority  the task's priority
 */
export function PriorityBadge({ priority }) {
  const { colors, spacing, radius } = useTheme();

  const looks = {
    [PRIORITY.LOW]: { label: 'Low', color: colors.success },
    [PRIORITY.MEDIUM]: { label: 'Medium', color: colors.warning },
    [PRIORITY.HIGH]: { label: 'High', color: colors.danger },
  };
  const look = looks[priority];

  if (!look) {
    return null;
  }

  return (
    <View
      style={[
        styles.base,
        { borderColor: look.color, borderRadius: radius.pill, paddingHorizontal: spacing.sm },
      ]}
    >
      <AppText variant="caption" style={[styles.label, { color: look.color }]}>
        {look.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, alignSelf: 'flex-start' },
  label: { fontWeight: '600' },
});
