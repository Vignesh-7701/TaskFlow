import { PRIORITY_WEIGHT } from '@/constants';

/**
 * Keeps only the tasks that match every filter that is set.
 * @param {import('@/models/task').Task[]} tasks
 * @param {object} [filters]
 * @param {'all'|'pending'|'completed'} [filters.status]
 * @param {string} [filters.query]  search text, matched in title, description and category
 * @param {string|null} [filters.category]
 * @param {'low'|'medium'|'high'|null} [filters.priority]
 * @returns {import('@/models/task').Task[]}
 */
export function filterTasks(
  tasks,
  { status = 'all', query = '', category = null, priority = null } = {},
) {
  const searchText = query.trim().toLowerCase();

  return tasks.filter((task) => {
    if (status !== 'all' && task.status !== status) {
      return false;
    }
    if (category && task.category !== category) {
      return false;
    }
    if (priority && task.priority !== priority) {
      return false;
    }
    if (searchText) {
      const taskText = `${task.title} ${task.description} ${task.category}`.toLowerCase();
      if (!taskText.includes(searchText)) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Compares two tasks by one field.
 * Gives a negative number when `a` comes first, a positive number when `b` comes first, 0 when equal.
 */
function compareTasks(a, b, sortBy) {
  if (sortBy === 'priority') {
    return (PRIORITY_WEIGHT[a.priority] ?? 0) - (PRIORITY_WEIGHT[b.priority] ?? 0);
  }
  if (sortBy === 'title') {
    return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
  }
  // dueDate, startDate and createdAt are ISO texts, so alphabetical order is date order.
  const first = a[sortBy] ?? '';
  const second = b[sortBy] ?? '';
  if (first < second) {
    return -1;
  }
  if (first > second) {
    return 1;
  }
  return 0;
}

/**
 * Gives back a new, sorted list. The list passed in is not changed.
 * @param {import('@/models/task').Task[]} tasks
 * @param {'dueDate'|'startDate'|'priority'|'title'|'createdAt'} [sortBy]
 * @param {'asc'|'desc'} [sortDir]
 * @returns {import('@/models/task').Task[]}
 */
export function sortTasks(tasks, sortBy = 'dueDate', sortDir = 'asc') {
  const direction = sortDir === 'desc' ? -1 : 1;
  return [...tasks].sort((a, b) => direction * compareTasks(a, b, sortBy));
}
