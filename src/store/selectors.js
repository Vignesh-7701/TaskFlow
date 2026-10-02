import { STATUS } from '@/models/task';
import { isDueToday, isOverdue } from '@/utils/date';

/**
 * Counts the tasks for the Dashboard.
 * @param {import('@/models/task').Task[]} tasks
 * @param {Date} [today]  only passed in tests; defaults to now
 * @returns {{ total: number, completed: number, pending: number, today: number, overdue: number }}
 */
export function selectStats(tasks, today = new Date()) {
  const stats = { total: tasks.length, completed: 0, pending: 0, today: 0, overdue: 0 };

  for (const task of tasks) {
    if (task.status === STATUS.COMPLETED) {
      stats.completed += 1;
    } else {
      stats.pending += 1;
    }

    if (isDueToday(task, today)) {
      stats.today += 1;
    }

    if (isOverdue(task, today)) {
      stats.overdue += 1;
    }
  }

  return stats;
}
