import { format, isBefore, isSameDay, isValid, parseISO, startOfDay } from 'date-fns';

import { STATUS } from '@/models/task';

// Four digits, a dash, two digits, a dash, two digits: 2026-10-01
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Day, month, year: 28-09-2026. The brackets capture each part so it can be read back.
const DAY_FIRST_PATTERN = /^(\d{2})-(\d{2})-(\d{4})$/;

/**
 * Turns a Date into the text form the app stores.
 * @param {Date} date
 * @returns {string} e.g. '2026-10-01'
 */
export function toISODate(date) {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Turns a stored date back into a Date, e.g. for a date picker.
 * @param {string} isoDate  e.g. '2026-10-01'
 * @returns {Date|null} the date at 00:00, or null when the text is not a valid date
 */
export function fromISODate(isoDate) {
  return isValidISODate(isoDate) ? parseISO(isoDate) : null;
}

/**
 * Checks that a text is a real date written as YYYY-MM-DD.
 * @param {string} value
 * @returns {boolean}
 */
export function isValidISODate(value) {
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }
  return isValid(parseISO(value));
}

/**
 * Reads a date from a CSV file, which may be written as YYYY-MM-DD or DD-MM-YYYY (day first).
 * Gives back the app's stored form, YYYY-MM-DD, or null if it is neither or not a real date.
 * @param {string} value  e.g. '2026-09-28' or '28-09-2026'
 * @returns {string|null} e.g. '2026-09-28'
 */
export function normalizeCsvDate(value) {
  const text = typeof value === 'string' ? value.trim() : '';

  if (isValidISODate(text)) {
    return text;
  }

  const match = DAY_FIRST_PATTERN.exec(text);
  if (match) {
    const [, day, month, year] = match;
    const isoDate = `${year}-${month}-${day}`;
    return isValidISODate(isoDate) ? isoDate : null;
  }

  return null;
}

/**
 * Turns a stored date into the form shown to the user.
 * @param {string} isoDate  e.g. '2026-10-01'
 * @returns {string} e.g. '01 Oct 2026', or '' when the date is not valid
 */
export function formatDisplay(isoDate) {
  if (!isValidISODate(isoDate)) {
    return '';
  }
  return format(parseISO(isoDate), 'dd MMM yyyy');
}

/**
 * A full timestamp (createdAt / updatedAt) shown as date and time on the phone's clock.
 * @param {string} timestamp  e.g. '2026-10-03T09:00:00.000Z'
 * @returns {string} e.g. '03 Oct 2026, 14:30', or '' when it is not a valid timestamp
 */
export function formatTimestamp(timestamp) {
  if (typeof timestamp !== 'string') {
    return '';
  }
  const date = parseISO(timestamp);
  return isValid(date) ? format(date, 'dd MMM yyyy, HH:mm') : '';
}

/**
 * A date with the weekday, for headings.
 * @param {Date} date
 * @returns {string} e.g. 'Saturday, 03 Oct 2026'
 */
export function formatLongDate(date) {
  return format(date, 'EEEE, dd MMM yyyy');
}

/**
 * A task is overdue when it is not completed and its due date is before today.
 * @param {import('@/models/task').Task} task
 * @param {Date} [today]  only passed in tests; defaults to now
 * @returns {boolean}
 */
export function isOverdue(task, today = new Date()) {
  if (task.status === STATUS.COMPLETED || !isValidISODate(task.dueDate)) {
    return false;
  }
  return isBefore(parseISO(task.dueDate), startOfDay(today));
}

/**
 * True when the task's due date is today.
 * @param {import('@/models/task').Task} task
 * @param {Date} [today]  only passed in tests; defaults to now
 * @returns {boolean}
 */
export function isDueToday(task, today = new Date()) {
  if (!isValidISODate(task.dueDate)) {
    return false;
  }
  return isSameDay(parseISO(task.dueDate), today);
}
