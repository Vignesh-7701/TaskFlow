import { parseCsv } from '@/features/import/csvParser';

const HEADER = 'id,title,description,category,priority,start_date,due_date,status';

// The first two lines of the user's own file: no header, dates day first.
const USER_FILE = [
  '1,Prepare project proposal,Prepare the initial project proposal document,Work,High,28-09-2026,01-10-2026,pending',
  '2,Team standup,Attend the daily development team standup,Work,Medium,30-09-2026,30-09-2026,completed',
].join('\n');

describe('parseCsv', () => {
  describe('a file without a header', () => {
    it('reads every line as a task, columns in the standard order', () => {
      const result = parseCsv(USER_FILE);

      expect(result.error).toBeNull();
      expect(result.hasHeader).toBe(false);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({
        rowNumber: 1,
        values: {
          id: '1',
          title: 'Prepare project proposal',
          description: 'Prepare the initial project proposal document',
          category: 'Work',
          priority: 'High',
          start_date: '28-09-2026',
          due_date: '01-10-2026',
          status: 'pending',
        },
      });
      expect(result.rows[1].rowNumber).toBe(2);
    });
  });

  describe('a file with a header', () => {
    it('matches columns by name and starts the rows at 2', () => {
      const text = `${HEADER}\nT1,Design login,Create login UI,Work,High,2026-10-01,2026-10-03,pending`;
      const result = parseCsv(text);

      expect(result.error).toBeNull();
      expect(result.hasHeader).toBe(true);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].rowNumber).toBe(2);
      expect(result.rows[0].values.title).toBe('Design login');
    });

    it('accepts columns in any order and header names in any case', () => {
      const text =
        'Status,ID,Title,Description,Category,Priority,Start_Date,Due_Date\n' +
        'pending,T1,Design login,x,Work,High,2026-10-01,2026-10-03';
      const { values } = parseCsv(text).rows[0];

      expect(values.id).toBe('T1');
      expect(values.status).toBe('pending');
      expect(values.due_date).toBe('2026-10-03');
    });

    it('rejects the whole file when a column is missing', () => {
      const text =
        'id,title,description,category,priority,start_date,due_date\nT1,a,b,c,low,2026-10-01,2026-10-02';
      const result = parseCsv(text);

      expect(result.error).toBe('Missing column: status');
      expect(result.rows).toEqual([]);
    });
  });

  it('removes the BOM mark at the start of the file', () => {
    const result = parseCsv(`\uFEFF${HEADER}\nT1,a,b,c,low,2026-10-01,2026-10-02,pending`);

    expect(result.hasHeader).toBe(true);
    expect(result.error).toBeNull();
  });

  it('skips empty lines but keeps the real line numbers', () => {
    const text = `${HEADER}\n\nT1,a,b,c,low,2026-10-01,2026-10-02,pending\n\n`;
    const result = parseCsv(text);

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].rowNumber).toBe(3);
  });

  it('trims spaces around every value', () => {
    const result = parseCsv(' 1 , Buy milk , , Home , low , 2026-10-01 , 2026-10-02 , pending ');

    expect(result.rows[0].values.title).toBe('Buy milk');
    expect(result.rows[0].values.description).toBe('');
  });

  it('reads a value with a comma inside quotes as one value', () => {
    const result = parseCsv(
      '1,Shopping,"Milk, eggs and bread",Home,low,2026-10-01,2026-10-02,pending',
    );

    expect(result.rows[0].values.description).toBe('Milk, eggs and bread');
    expect(result.rows[0].values.category).toBe('Home');
  });

  it('reports an empty file', () => {
    expect(parseCsv('').error).toBe('The file is empty');
    expect(parseCsv('\n\n  \n').error).toBe('The file is empty');
  });
});
