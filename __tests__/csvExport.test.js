import { parseCsv } from '@/features/import/csvParser';
import { validateRows } from '@/features/import/csvValidator';
import { PRIORITY, STATUS } from '@/models/task';
import { exportFileName, tasksToCsv } from '@/utils/csvExport';

const TASKS = [
  {
    id: '1',
    title: 'Prepare project proposal',
    description: 'Prepare the initial project proposal document',
    category: 'Work',
    priority: PRIORITY.HIGH,
    startDate: '2026-09-28',
    dueDate: '2026-10-01',
    status: STATUS.PENDING,
    createdAt: '2026-10-03T09:00:00.000Z',
    updatedAt: '2026-10-03T09:00:00.000Z',
  },
  {
    id: 'a1b2-c3d4',
    title: 'Shopping, then cooking',
    description: 'Buy "fresh" milk, eggs and bread',
    category: 'Home',
    priority: PRIORITY.LOW,
    startDate: '2026-10-03',
    dueDate: '2026-10-03',
    status: STATUS.COMPLETED,
    createdAt: '2026-10-03T10:00:00.000Z',
    updatedAt: '2026-10-03T11:00:00.000Z',
  },
];

// The fields the CSV carries; createdAt and updatedAt are not part of the file.
const CSV_FIELDS = [
  'id',
  'title',
  'description',
  'category',
  'priority',
  'startDate',
  'dueDate',
  'status',
];
const pick = (task) => Object.fromEntries(CSV_FIELDS.map((field) => [field, task[field]]));

describe('tasksToCsv', () => {
  it('writes a header line, then one line per task, dates day first', () => {
    const lines = tasksToCsv([TASKS[0]]).split('\r\n');

    expect(lines[0]).toBe('id,title,description,category,priority,start_date,due_date,status');
    expect(lines[1]).toBe(
      '1,Prepare project proposal,Prepare the initial project proposal document,Work,high,28-09-2026,01-10-2026,pending',
    );
  });

  it('quotes values that contain commas or quotes', () => {
    const text = tasksToCsv([TASKS[1]]);

    expect(text).toContain('"Shopping, then cooking"');
    expect(text).toContain('"Buy ""fresh"" milk, eggs and bread"');
  });

  it('writes only the header for no tasks', () => {
    const lines = tasksToCsv([])
      .split('\r\n')
      .filter((line) => line !== '');

    expect(lines).toEqual(['id,title,description,category,priority,start_date,due_date,status']);
  });

  it('round-trips: the exported file imports back with every task valid and unchanged', () => {
    const parsed = parseCsv(tasksToCsv(TASKS));
    const result = validateRows(parsed.rows, new Set());

    expect(parsed.hasHeader).toBe(true);
    expect(result.invalid).toEqual([]);
    expect(result.duplicates).toEqual([]);
    expect(result.valid).toEqual(TASKS.map(pick));
  });
});

describe('exportFileName', () => {
  it('names the file with the date as YYYYMMDD', () => {
    expect(exportFileName(new Date(2026, 9, 3))).toBe('taskflow_export_20261003.csv');
  });
});
