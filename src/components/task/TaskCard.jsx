import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Card } from '@/components/ui';
import { STATUS } from '@/models/task';
import { useTheme } from '@/theme/useTheme';
import { formatDisplay, isOverdue } from '@/utils/date';

import { PriorityBadge } from './PriorityBadge';

const CHECKBOX_SIZE = 24;

/**
 * One task in a list: checkbox, title, priority, category, dates and an overdue label.
 * @param {object} props
 * @param {import('@/models/task').Task} props.task  the task to show
 * @param {(id: string) => void} props.onPress  called with the task's id when the card is tapped
 * @param {(id: string) => void} props.onToggleComplete  called with the task's id when the checkbox is tapped
 * @param {(task: import('@/models/task').Task) => void} [props.onDelete]  called with the whole task
 *   when the bin icon is tapped. Leave it out and no bin icon is shown.
 */
function TaskCardBase({ task, onPress, onToggleComplete, onDelete }) {
  const { colors, spacing } = useTheme();

  const isDone = task.status === STATUS.COMPLETED;
  const overdue = isOverdue(task);

  return (
    <Pressable
      onPress={() => onPress(task.id)}
      accessibilityRole="button"
      accessibilityLabel={`Open task ${task.title}`}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Card style={{ gap: spacing.xs }}>
        <View style={[styles.row, { gap: spacing.sm }]}>
          <Pressable
            onPress={() => onToggleComplete(task.id)}
            hitSlop={spacing.sm}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: isDone }}
            accessibilityLabel={isDone ? 'Mark as pending' : 'Mark as completed'}
          >
            <Ionicons
              name={isDone ? 'checkbox' : 'square-outline'}
              size={CHECKBOX_SIZE}
              color={isDone ? colors.success : colors.textMuted}
            />
          </Pressable>

          <AppText
            numberOfLines={1}
            style={[styles.title, isDone && { color: colors.textMuted }, isDone && styles.done]}
          >
            {task.title}
          </AppText>

          <PriorityBadge priority={task.priority} />
        </View>

        <View style={[styles.row, { gap: spacing.sm, paddingLeft: CHECKBOX_SIZE + spacing.sm }]}>
          <AppText variant="muted" numberOfLines={1} style={styles.meta}>
            {task.category} · {formatDisplay(task.startDate)} → {formatDisplay(task.dueDate)}
          </AppText>

          {overdue ? (
            <AppText variant="caption" style={[styles.overdue, { color: colors.danger }]}>
              Overdue
            </AppText>
          ) : null}

          {onDelete ? (
            <Pressable
              onPress={() => onDelete(task)}
              hitSlop={spacing.md}
              accessibilityRole="button"
              accessibilityLabel={`Delete task ${task.title}`}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </Card>
    </Pressable>
  );
}

// memo: redraw a card only when its own props change, not every time the list redraws.
export const TaskCard = memo(TaskCardBase);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { flex: 1, fontWeight: '600' },
  done: { textDecorationLine: 'line-through' },
  meta: { flex: 1 },
  overdue: { fontWeight: '600' },
  pressed: { opacity: 0.7 },
});
