import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { PriorityBadge } from '@/components/task/PriorityBadge';
import { AppText, Badge, Button, Card, ErrorState, InfoRow, Screen } from '@/components/ui';
import { confirmDeleteTask } from '@/features/tasks/confirmDeleteTask';
import { STATUS } from '@/models/task';
import { useTaskStore } from '@/store/taskStore';
import { useTheme } from '@/theme/useTheme';
import { formatDisplay, formatTimestamp, isOverdue } from '@/utils/date';

const EDGES = ['left', 'right', 'bottom'];

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const { id } = useLocalSearchParams();

  // The task with this id, or undefined if there is none.
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === id));
  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  if (!task) {
    return (
      <Screen edges={EDGES}>
        <ErrorState
          title="Task not found"
          message="It may have been deleted."
          retryLabel="Go back"
          onRetry={() => router.back()}
        />
      </Screen>
    );
  }

  const isDone = task.status === STATUS.COMPLETED;
  const overdue = isOverdue(task);

  const openEdit = () => router.push(`/task/edit/${task.id}`);

  const askToDelete = () => {
    confirmDeleteTask(task, () => {
      // Leave first, then delete, so this screen never shows "Task not found" on the way out.
      router.back();
      deleteTask(task.id);
    });
  };

  return (
    <Screen edges={EDGES} scroll style={{ gap: spacing.md }}>
      {/* Header settings for this screen only: an Edit button on the right. */}
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              onPress={openEdit}
              hitSlop={spacing.md}
              accessibilityRole="button"
              accessibilityLabel="Edit task"
            >
              <AppText style={[styles.headerButton, { color: colors.primary }]}>Edit</AppText>
            </Pressable>
          ),
        }}
      />

      <AppText variant="title">{task.title}</AppText>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        <Badge
          label={isDone ? 'Completed' : 'Pending'}
          color={isDone ? colors.success : colors.textMuted}
        />
        <PriorityBadge priority={task.priority} />
        {overdue ? <Badge label="Overdue" color={colors.danger} /> : null}
      </View>

      <Card>
        <InfoRow label="Category" value={task.category} />
        <InfoRow label="Start date" value={formatDisplay(task.startDate)} />
        <InfoRow
          label="Due date"
          value={formatDisplay(task.dueDate)}
          valueColor={overdue ? colors.danger : undefined}
          isLast
        />
      </Card>

      <AppText variant="heading">Description</AppText>
      <Card>
        {task.description ? (
          <AppText>{task.description}</AppText>
        ) : (
          <AppText variant="muted">No description</AppText>
        )}
      </Card>

      <AppText variant="muted">
        Created {formatTimestamp(task.createdAt)} · Updated {formatTimestamp(task.updatedAt)}
      </AppText>

      <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
        <Button
          label={isDone ? 'Mark as pending' : 'Mark as completed'}
          onPress={() => toggleComplete(task.id)}
        />
        <Button label="Edit" variant="secondary" onPress={openEdit} />
        <Button label="Delete" variant="danger" onPress={askToDelete} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerButton: { fontWeight: '600' },
});
