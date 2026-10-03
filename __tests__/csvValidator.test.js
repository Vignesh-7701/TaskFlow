import { parseCsv } from '@/features/import/csvParser';
import { validateRow, validateRows } from '@/features/import/csvValidator';

// The test file from the build plan (Session 12): every rule appears once.
const PLAN_CSV = `id,title,description,category,priority,start_date,due_date,status
T1,Design login,Create login UI,Work,High,2026-10-01,2026-10-03,pending
T2,Buy groceries,Milk and eggs,Personal,low,2026-10-01,2026-10-01,completed
T3,,Missing title,Work,Medium,2026-10-01,2026-10-02,pending
T4,Bad priority,x,Work,Urgent,2026-10-01,2026-10-02,pending
T5,Bad dates,x,Work,Low,2026-10-05,2026-10-01,pending
T6,Bad format,x,Work,Low,01/10/2026,2026-10-09,pending
T1,Duplicate in file,x,Work,Low,2026-10-01,2026-10-02,pending
T7,Bad status,x,Home,Medium,2026-10-01,2026-10-02,done`;

// Three lines in the format of the user's own file: no header, dates day first.
const USER_FORMAT_CSV = `1,Prepare project proposal,Prepare the initial project proposal document,Work,High,28-09-2026,01-10-2026,pending
2,Team standup,Attend the daily development team standup,Work,Medium,30-09-2026,30-09-2026,completed
3,Update project documentation,Update technical and functional documentation,Work,Medium,29-09-2026,03-10-2026,pending`;

// One valid row, as parseCsv gives it. Each test changes one value.
const VALID_VALUES = {
  id: 'T1',
  title: 'Design login',
  description: 'Create login UI',
  category: 'Work',
  priority: 'High',
  start_date: '2026-10-01',
  due_date: '2026-10-03',
  status: 'pending',
};

const ids = (list) => list.map((item) => item.id);

describe('validateRow', () => {
  it('accepts a valid row and gives it the app shape', () => {
    expect(validateRow(VALID_VALUES)).toEqual({
      errors: [],
      task: {
        id: 'T1',
        title: 'Design login',
        description: 'Create login UI',
        category: 'Work',
        priority: 'high',
        startDate: '2026-10-01',
        dueDate: '2026-10-03',
        status: 'pending',
      },
    });
  });

  it('turns DD-MM-YYYY dates into YYYY-MM-DD', () => {
    const { task, errors } = validateRow({
      ...VALID_VALUES,
      start_date: '28-09-2026',
      due_date: '01-10-2026',
    });

    expect(errors).toEqual([]);
    expect(task.startDate).toBe('2026-09-28');
    expect(task.dueDate).toBe('2026-10-01');
  });

  it('compares day-first dates as dates, not as text', () => {
    // As text, '01-10-2026' comes before '28-09-2026'; as dates it is after.
    const { errors } = validateRow({
      ...VALID_VALUES,
      start_date: '28-09-2026',
      due_date: '01-10-2026',
    });
    expect(errors).toEqual([]);
  });

  it('requires id, title and category', () => {
    const { errors } = validateRow({ ...VALID_VALUES, id: '', title: '', category: '' });
    expect(errors).toEqual(['id is required', 'title is required', 'category is required']);
  });

  it('accepts priority and status in any capitals', () => {
    const { task, errors } = validateRow({ ...VALID_VALUES, priority: 'LOW', status: 'Completed' });

    expect(errors).toEqual([]);
    expect(task.priority).toBe('low');
    expect(task.status).toBe('completed');
  });

  it('shows the value as written in the file', () => {
    expect(validateRow({ ...VALID_VALUES, priority: 'Urgent' }).errors).toEqual([
      'Invalid priority "Urgent"',
    ]);
    expect(validateRow({ ...VALID_VALUES, status: 'done' }).errors).toEqual([
      'Invalid status "done"',
    ]);
  });

  it('names the date column that is wrong', () => {
    expect(validateRow({ ...VALID_VALUES, due_date: '2026-02-30' }).errors).toEqual([
      'Invalid due_date "2026-02-30"',
    ]);
  });

  it('does not compare the dates when one of them is invalid', () => {
    const { errors } = validateRow({ ...VALID_VALUES, start_date: 'soon' });
    expect(errors).toEqual(['Invalid start_date "soon"']);
  });

  it('lists every problem in a row', () => {
    const { errors } = validateRow({ ...VALID_VALUES, title: '', priority: 'urgent' });
    expect(errors).toHaveLength(2);
  });
});

describe('validateRows', () => {
  describe('with the test CSV from the plan', () => {
    const rows = parseCsv(PLAN_CSV).rows;
    const result = validateRows(rows, new Set());

    it('finds T1 and T2 valid', () => {
      expect(ids(result.valid)).toEqual(['T1', 'T2']);
    });

    it('finds T3 to T7 invalid, each with its reason and row number', () => {
      expect(result.invalid).toEqual([
        { row: 4, id: 'T3', errors: ['title is required'] },
        { row: 5, id: 'T4', errors: ['Invalid priority "Urgent"'] },
        { row: 6, id: 'T5', errors: ['Due date is before start date'] },
        { row: 7, id: 'T6', errors: ['Invalid start_date "01/10/2026"'] },
        { row: 9, id: 'T7', errors: ['Invalid status "done"'] },
      ]);
    });

    it('keeps the first T1 and reports the second as a duplicate', () => {
      expect(result.duplicates).toEqual([
        { row: 8, id: 'T1', reason: 'in-file', message: 'Duplicate id in file' },
      ]);
    });

    it('puts every row in exactly one list', () => {
      const total = result.valid.length + result.invalid.length + result.duplicates.length;
      expect(total).toBe(rows.length);
    });

    it('reports T1 and T2 as already existing when imported again', () => {
      const again = validateRows(rows, new Set(['T1', 'T2']));

      expect(again.valid).toEqual([]);
      expect(again.duplicates.map((d) => [d.id, d.message])).toEqual([
        ['T1', 'Already exists'],
        ['T2', 'Already exists'],
        ['T1', 'Duplicate id in file'],
      ]);
    });
  });

  describe("with the user's file format (no header, day-first dates)", () => {
    const rows = parseCsv(USER_FORMAT_CSV).rows;

    it('finds every row valid, numbered from 1', () => {
      const result = validateRows(rows, new Set());

      expect(ids(result.valid)).toEqual(['1', '2', '3']);
      expect(result.invalid).toEqual([]);
      expect(result.duplicates).toEqual([]);
      expect(result.valid[0].startDate).toBe('2026-09-28');
    });

    it('reports existing ids with the right row numbers', () => {
      const result = validateRows(rows, new Set(['2']));
      expect(result.duplicates).toEqual([
        { row: 2, id: '2', reason: 'exists', message: 'Already exists' },
      ]);
    });
  });

  it('gives three empty lists for no rows', () => {
    expect(validateRows([], new Set())).toEqual({ valid: [], invalid: [], duplicates: [] });
  });
});
