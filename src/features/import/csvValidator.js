import { PRIORITIES, STATUSES } from '@/constants';
import { normalizeCsvDate } from '@/utils/date';

const REQUIRED_FIELDS = ['id', 'title', 'category'];

const DUPLICATE_MESSAGES = {
  'in-file': 'Duplicate id in file',
  exists: 'Already exists',
};

/**
 * Checks every row of a file and sorts them into three lists. A pure function:
 * it reads nothing from the phone or the store, so it is easy to test.
 * @param {import('./csvParser').CsvRow[]} rows  the rows from parseCsv
 * @param {Set<string>} existingIds  the ids of the tasks already in the app
 * @returns {{
 *   valid: object[],
 *   invalid: { row: number, id: string, errors: string[] }[],
 *   duplicates: { row: number, id: string, reason: 'in-file' | 'exists', message: string }[],
 * }}
 */
export function validateRows(rows, existingIds) {
  const valid = [];
  const invalid = [];
  const duplicates = [];
  const seenIds = new Set();

  for (const { rowNumber, values } of rows) {
    const { id } = values;

    if (id) {
      // The same id earlier in this file: keep the first, skip this one.
      if (seenIds.has(id)) {
        duplicates.push(makeDuplicate(rowNumber, id, 'in-file'));
        continue;
      }
      seenIds.add(id);

      // A task with this id is already in the app: skip it.
      if (existingIds.has(id)) {
        duplicates.push(makeDuplicate(rowNumber, id, 'exists'));
        continue;
      }
    }

    const { task, errors } = validateRow(values);
    if (errors.length > 0) {
      invalid.push({ row: rowNumber, id, errors });
    } else {
      valid.push(task);
    }
  }

  return { valid, invalid, duplicates };
}

function makeDuplicate(row, id, reason) {
  return { row, id, reason, message: DUPLICATE_MESSAGES[reason] };
}

/**
 * Checks one CSV row against the per-row rules in docs/CSV_RULES.md.
 * Knows nothing about files or about other rows (duplicates are checked separately).
 * @param {Record<string, string>} values  one row's values by column name, e.g. from parseCsv
 * @returns {{ task: object, errors: string[] }}
 *   task: the row in the app's own shape (camelCase keys, lower-case priority and status,
 *   YYYY-MM-DD dates). Only use it when `errors` is empty.
 */
export function validateRow(values) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (!values[field]) {
      errors.push(`${field} is required`);
    }
  }

  // Case-insensitive: 'High', 'HIGH' and 'high' are all fine.
  const priority = values.priority.toLowerCase();
  if (!PRIORITIES.includes(priority)) {
    errors.push(`Invalid priority "${values.priority}"`);
  }

  const status = values.status.toLowerCase();
  if (!STATUSES.includes(status)) {
    errors.push(`Invalid status "${values.status}"`);
  }

  // Accepts YYYY-MM-DD or DD-MM-YYYY; gives back YYYY-MM-DD, or null if neither.
  const startDate = normalizeCsvDate(values.start_date);
  if (!startDate) {
    errors.push(`Invalid start_date "${values.start_date}"`);
  }

  const dueDate = normalizeCsvDate(values.due_date);
  if (!dueDate) {
    errors.push(`Invalid due_date "${values.due_date}"`);
  }

  // Only compare when both dates could be read.
  if (startDate && dueDate && dueDate < startDate) {
    errors.push('Due date is before start date');
  }

  const task = {
    id: values.id,
    title: values.title,
    description: values.description,
    category: values.category,
    priority,
    startDate,
    dueDate,
    status,
  };

  return { task, errors };
}
