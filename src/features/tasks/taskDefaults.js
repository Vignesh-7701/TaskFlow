import { PRIORITY, STATUS } from '@/models/task';
import { toISODate } from '@/utils/date';

/**
 * The values a new task starts with in the form: Medium, Pending, starting and due today.
 * A function, not a fixed object, so "today" is worked out each time the form opens.
 */
export function getNewTaskDefaults() {
  const today = toISODate(new Date());
  return {
    title: '',
    description: '',
    category: '',
    priority: PRIORITY.MEDIUM,
    startDate: today,
    dueDate: today,
    status: STATUS.PENDING,
  };
}

/**
 * The form values for an existing task: only the fields the form edits.
 * id, createdAt and updatedAt are left out; the user never edits them.
 * @param {import('@/models/task').Task} task
 */
export function getFormValues(task) {
  return {
    title: task.title,
    description: task.description ?? '',
    category: task.category,
    priority: task.priority,
    startDate: task.startDate,
    dueDate: task.dueDate,
    status: task.status,
  };
}
