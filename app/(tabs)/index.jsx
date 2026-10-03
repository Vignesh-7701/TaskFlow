import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { TaskCard } from '@/components/task/TaskCard';
import { AppText, EmptyState, FAB, Screen } from '@/components/ui';
import { DevTaskButtons } from '@/dev/DevTaskButtons';
import { DashboardHeader } from '@/features/dashboard/DashboardHeader';
import { UploadShortcut } from '@/features/dashboard/UploadShortcut';
import { selectStats } from '@/store/selectors';
import { useTaskStore } from '@/store/taskStore';
import { useTheme } from '@/theme/useTheme';
import { isDueToday } from '@/utils/date';

export default function DashboardScreen() {
  const router = useRouter();
  const { spacing } = useTheme();

  const tasks = useTaskStore((state) => state.tasks);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);

  const stats = useMemo(() => selectStats(tasks), [tasks]);
  const todayTasks = useMemo(() => tasks.filter((task) => isDueToday(task)), [tasks]);

  const openTasks = (status) => {
    router.push(status === 'all' ? '/tasks' : `/tasks?status=${status}`);
  };

  const openTask = useCallback((id) => router.push(`/task/${id}`), [router]);

  const renderTask = useCallback(
    ({ item }) => <TaskCard task={item} onPress={openTask} onToggleComplete={toggleComplete} />,
    [openTask, toggleComplete],
  );

  return (
    <Screen>
      <FlatList
        data={todayTasks}
        keyExtractor={(task) => task.id}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxl * 3 }}
        ListHeaderComponent={
          <View style={{ gap: spacing.md }}>
            <DashboardHeader stats={stats} onOpenTasks={openTasks} />
            <DevTaskButtons />
            <AppText variant="heading" style={{ marginTop: spacing.sm }}>
              Today&apos;s tasks
            </AppText>
          </View>
        }
        ListEmptyComponent={<EmptyState icon="sunny-outline" title="Nothing due today" />}
        ListFooterComponent={<UploadShortcut onPress={() => router.push('/upload')} />}
      />

      <FAB accessibilityLabel="Add task" onPress={() => router.push('/task/new')} />
    </Screen>
  );
}
