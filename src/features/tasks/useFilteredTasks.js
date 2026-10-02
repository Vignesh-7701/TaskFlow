import { useMemo } from 'react';

import { useTaskStore } from '@/store/taskStore';

import { filterTasks, sortTasks } from './filterTasks';

/**
 * Gives a screen the tasks from the store, filtered and sorted.
 * @param {object} [options]
 * @param {'all'|'pending'|'completed'} [options.status]
 * @param {string} [options.query]
 * @param {string|null} [options.category]
 * @param {'low'|'medium'|'high'|null} [options.priority]
 * @param {'dueDate'|'startDate'|'priority'|'title'|'createdAt'} [options.sortBy]
 * @param {'asc'|'desc'} [options.sortDir]
 * @returns {import('@/models/task').Task[]}
 */
export function useFilteredTasks({
  status = 'all',
  query = '',
  category = null,
  priority = null,
  sortBy = 'dueDate',
  sortDir = 'asc',
} = {}) {
  const tasks = useTaskStore((state) => state.tasks);

  return useMemo(() => {
    const filtered = filterTasks(tasks, { status, query, category, priority });
    return sortTasks(filtered, sortBy, sortDir);
  }, [tasks, status, query, category, priority, sortBy, sortDir]);
}
