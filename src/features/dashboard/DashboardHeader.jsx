import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { StatCard } from '@/components/task/StatCard';
import { AppText } from '@/components/ui';
import { STATUS } from '@/models/task';
import { useTheme } from '@/theme/useTheme';
import { formatLongDate } from '@/utils/date';

/**
 * The top of the Dashboard: greeting, today's date, the four counts and the overdue pill.
 * @param {object} props
 * @param {{ total: number, completed: number, pending: number, today: number, overdue: number }} props.stats
 * @param {(status: 'all'|'pending'|'completed'|'overdue') => void} props.onOpenTasks  opens the Task List with a filter
 */
export function DashboardHeader({ stats, onOpenTasks }) {
  const { colors, spacing, radius } = useTheme();

  const row = [styles.row, { gap: spacing.md }];

  return (
    <View style={{ gap: spacing.md }}>
      <View>
        <AppText variant="title">Hello</AppText>
        <AppText variant="muted">{formatLongDate(new Date())}</AppText>
      </View>

      <View style={row}>
        <StatCard label="Total" value={stats.total} onPress={() => onOpenTasks('all')} />
        <StatCard
          label="Completed"
          value={stats.completed}
          onPress={() => onOpenTasks(STATUS.COMPLETED)}
        />
      </View>
      <View style={row}>
        <StatCard
          label="Pending"
          value={stats.pending}
          onPress={() => onOpenTasks(STATUS.PENDING)}
        />
        <StatCard label="Today" value={stats.today} />
      </View>

      {stats.overdue > 0 ? (
        <Pressable
          onPress={() => onOpenTasks('overdue')}
          hitSlop={spacing.md}
          accessibilityRole="button"
          accessibilityLabel={`${stats.overdue} overdue. Show overdue tasks`}
          style={({ pressed }) => [
            styles.pill,
            {
              borderColor: colors.danger,
              borderRadius: radius.pill,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              gap: spacing.xs,
            },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <AppText variant="caption" style={[styles.pillText, { color: colors.danger }]}>
            {stats.overdue} overdue
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', borderWidth: 1 },
  pillText: { fontWeight: '600' },
  pressed: { opacity: 0.7 },
});
