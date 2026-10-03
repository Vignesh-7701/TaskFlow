// TEMPORARY, development only. Makes a random task for testing screens before the
// Add Task form exists. Removed in Session 10.
import { addDays } from 'date-fns';

import { PRIORITIES } from '@/constants';
import { STATUS } from '@/models/task';
import { toISODate } from '@/utils/date';

const TITLES = [
  'Write the weekly report',
  'Call the bank',
  'Buy groceries',
  'Plan the weekend trip',
  'Fix the login bug',
  'Read one chapter',
];
const CATEGORIES = ['Work', 'Personal', 'Home'];

// A random whole number from min to max, both included.
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

// A random item from a list.
const pick = (list) => list[randomInt(0, list.length - 1)];

/**
 * A random pending task, shaped like what the Add Task form will produce.
 * Start date: 0 to 5 days ago. Due date: 2 days ago to 3 days ahead, never before the start.
 */
export function makeSampleTask() {
  const today = new Date();
  const start = addDays(today, randomInt(-5, 0));
  let due = addDays(today, randomInt(-2, 3));
  if (due < start) {
    due = start;
  }

  return {
    title: pick(TITLES),
    description: 'Sample task for testing',
    category: pick(CATEGORIES),
    priority: pick(PRIORITIES),
    startDate: toISODate(start),
    dueDate: toISODate(due),
    status: STATUS.PENDING,
  };
}
