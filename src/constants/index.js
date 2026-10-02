import { PRIORITY, STATUS } from '@/models/task';

// The allowed values as lists, for drawing chips and for checking CSV rows.
export const PRIORITIES = Object.values(PRIORITY);
export const STATUSES = Object.values(STATUS);

// The names under which data is saved on the phone.
export const STORAGE_KEYS = Object.freeze({
  TASKS: 'taskflow.tasks.v1',
  SETTINGS: 'taskflow.settings.v1',
});

// A number for each priority, so tasks can be sorted by priority.
export const PRIORITY_WEIGHT = Object.freeze({
  [PRIORITY.HIGH]: 3,
  [PRIORITY.MEDIUM]: 2,
  [PRIORITY.LOW]: 1,
});
