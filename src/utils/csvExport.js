import { format } from 'date-fns';
import Papa from 'papaparse';

import { CSV_COLUMNS } from '@/features/import/csvParser';
import { toDayFirstDate } from '@/utils/date';

/**
 * Turns tasks into the text of a CSV file, in the same 8-column format the import reads:
 * a header line, then one line per task, with dates written day first (DD-MM-YYYY).
 * @param {import('@/models/task').Task[]} tasks
 * @returns {string}
 */
export function tasksToCsv(tasks) {
  const rows = tasks.map((task) => [
    task.id,
    task.title,
    task.description ?? '',
    task.category,
    task.priority,
    toDayFirstDate(task.startDate),
    toDayFirstDate(task.dueDate),
    task.status,
  ]);

  // Papa.unparse adds commas between values, quotes any value that contains a comma,
  // a quote or a line break, and puts each row on its own line.
  return Papa.unparse({ fields: CSV_COLUMNS, data: rows });
}

/**
 * The name for an export file, from the plan: taskflow_export_YYYYMMDD.csv
 * @param {Date} [date]  only passed in tests; defaults to now
 * @returns {string} e.g. 'taskflow_export_20261003.csv'
 */
export function exportFileName(date = new Date()) {
  return `taskflow_export_${format(date, 'yyyyMMdd')}.csv`;
}
