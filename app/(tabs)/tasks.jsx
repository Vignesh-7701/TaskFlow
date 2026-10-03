import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { ExtraFilters } from '@/components/task/ExtraFilters';
import { FilterBar, STATUS_FILTERS } from '@/components/task/FilterBar';
import { SortMenu } from '@/components/task/SortMenu';
import { SwipeableTaskCard } from '@/components/task/SwipeableTaskCard';
import { AppText, EmptyState, FAB, Input, Screen } from '@/components/ui';
import { confirmDeleteTask } from '@/features/tasks/confirmDeleteTask';
import { getCategories } from '@/features/tasks/filterTasks';
import { useFilteredTasks } from '@/features/tasks/useFilteredTasks';
import { useDebounce } from '@/hooks/useDebounce';
import { useTaskStore } from '@/store/taskStore';
import { useTheme } from '@/theme/useTheme';

const STATUS_VALUES = STATUS_FILTERS.map((filter) => filter.value);

export default function TasksScreen() {
  const router = useRouter();
  const { spacing } = useTheme();

  // The status filter lives in the route (?status=pending), so the Dashboard can set it.
  const params = useLocalSearchParams();
  const status = STATUS_VALUES.includes(params.status) ? params.status : 'all';
  const setStatus = (value) => router.setParams({ status: value });

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 250);

  const [sort, setSort] = useState({ sortBy: 'dueDate', sortDir: 'asc' });
  const [priority, setPriority] = useState(null);
  const [chosenCategory, setChosenCategory] = useState(null);

  const allTasks = useTaskStore((state) => state.tasks);
  const categories = useMemo(() => getCategories(allTasks), [allTasks]);
  // If the chosen category no longer exists (its last task was deleted), stop filtering by it.
  const category = categories.includes(chosenCategory) ? chosenCategory : null;

  const toggleComplete = useTaskStore((state) => state.toggleComplete);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const tasks = useFilteredTasks({ status, query: debouncedQuery, priority, category, ...sort });

  const openTask = useCallback((id) => router.push(`/task/${id}`), [router]);

  const askToDelete = useCallback(
    (task) => confirmDeleteTask(task, () => deleteTask(task.id)),
    [deleteTask],
  );

  const renderTask = useCallback(
    ({ item }) => (
      <SwipeableTaskCard
        task={item}
        onPress={openTask}
        onToggleComplete={toggleComplete}
        onDelete={askToDelete}
      />
    ),
    [openTask, toggleComplete, askToDelete],
  );

  const countLabel = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setPriority(null);
    setChosenCategory(null);
  };

  // Two different empty cases: no tasks exist at all, or tasks exist but none match.
  const emptyState =
    allTasks.length === 0 ? (
      <EmptyState
        icon="clipboard-outline"
        title="No tasks yet"
        message="Add your first task to get started."
        actionLabel="Add task"
        onAction={() => router.push('/task/new')}
      />
    ) : (
      <EmptyState
        icon="search-outline"
        title="No tasks match your filters"
        message="Try a different search, or clear the filters."
        actionLabel="Clear filters"
        onAction={clearFilters}
      />
    );

  return (
    <Screen style={{ gap: spacing.md }}>
      <AppText variant="title">Tasks</AppText>

      <Input
        placeholder="Search tasks..."
        accessibilityLabel="Search tasks"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        autoCorrect={false}
      />

      <FilterBar value={status} onChange={setStatus} />

      <ExtraFilters
        priority={priority}
        onPriorityChange={setPriority}
        categories={categories}
        category={category}
        onCategoryChange={setChosenCategory}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <AppText variant="muted" style={{ flex: 1 }}>
          {countLabel}
        </AppText>
        <SortMenu sortBy={sort.sortBy} sortDir={sort.sortDir} onChange={setSort} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxl * 3 }}
        ListEmptyComponent={emptyState}
      />

      <FAB accessibilityLabel="Add task" onPress={() => router.push('/task/new')} />
    </Screen>
  );
}
