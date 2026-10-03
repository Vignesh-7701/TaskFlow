import { STATUS } from '@/models/task';
import {
  formatDisplay,
  formatLongDate,
  formatTimestamp,
  fromISODate,
  isDueToday,
  isOverdue,
  isValidISODate,
  normalizeCsvDate,
  toDayFirstDate,
  toISODate,
} from '@/utils/date';

// A fixed "today" so the tests give the same result on any day: 2 Oct 2026, 3 pm.
// Months count from 0 in JavaScript, so 9 means October.
const TODAY = new Date(2026, 9, 2, 15, 0);

const makeTask = (overrides) => ({
  status: STATUS.PENDING,
  dueDate: '2026-10-02',
  ...overrides,
});

describe('toISODate', () => {
  it('turns a Date into YYYY-MM-DD', () => {
    expect(toISODate(new Date(2026, 9, 15))).toBe('2026-10-15');
  });

  it('adds a leading zero to single-digit months and days', () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('fromISODate', () => {
  it('turns YYYY-MM-DD back into the same calendar day', () => {
    expect(toISODate(fromISODate('2026-10-15'))).toBe('2026-10-15');
  });

  it('gives null for a date that is not valid', () => {
    expect(fromISODate('2026-02-30')).toBeNull();
    expect(fromISODate('')).toBeNull();
  });
});

describe('toDayFirstDate', () => {
  it('writes a stored date day first', () => {
    expect(toDayFirstDate('2026-09-28')).toBe('28-09-2026');
  });

  it('gives an empty text for a date that is not valid', () => {
    expect(toDayFirstDate('2026-02-30')).toBe('');
    expect(toDayFirstDate(undefined)).toBe('');
  });

  it('is undone by normalizeCsvDate', () => {
    expect(normalizeCsvDate(toDayFirstDate('2026-10-01'))).toBe('2026-10-01');
  });
});

describe('normalizeCsvDate', () => {
  it('keeps a YYYY-MM-DD date as it is', () => {
    expect(normalizeCsvDate('2026-09-28')).toBe('2026-09-28');
  });

  it('turns a DD-MM-YYYY date into YYYY-MM-DD', () => {
    expect(normalizeCsvDate('28-09-2026')).toBe('2026-09-28');
    expect(normalizeCsvDate('01-10-2026')).toBe('2026-10-01');
  });

  it('reads DD-MM-YYYY as day first, never month first', () => {
    expect(normalizeCsvDate('05-06-2026')).toBe('2026-06-05');
  });

  it('ignores spaces around the date', () => {
    expect(normalizeCsvDate(' 28-09-2026 ')).toBe('2026-09-28');
  });

  it('gives null for a date that does not exist', () => {
    expect(normalizeCsvDate('31-02-2026')).toBeNull();
    expect(normalizeCsvDate('2026-02-30')).toBeNull();
  });

  it('gives null for any other format', () => {
    expect(normalizeCsvDate('01/10/2026')).toBeNull();
    expect(normalizeCsvDate('1-10-2026')).toBeNull();
    expect(normalizeCsvDate('2026/10/01')).toBeNull();
    expect(normalizeCsvDate('')).toBeNull();
    expect(normalizeCsvDate(undefined)).toBeNull();
  });
});

describe('isValidISODate', () => {
  it('accepts a real date in YYYY-MM-DD form', () => {
    expect(isValidISODate('2026-10-01')).toBe(true);
  });

  it('rejects other date formats', () => {
    expect(isValidISODate('01/10/2026')).toBe(false);
    expect(isValidISODate('2026-10-1')).toBe(false);
    expect(isValidISODate('2026-10-01T10:00:00')).toBe(false);
  });

  it('rejects dates that do not exist', () => {
    expect(isValidISODate('2026-02-30')).toBe(false);
    expect(isValidISODate('2026-13-01')).toBe(false);
  });

  it('rejects values that are not text', () => {
    expect(isValidISODate('')).toBe(false);
    expect(isValidISODate(undefined)).toBe(false);
    expect(isValidISODate(20261001)).toBe(false);
  });
});

describe('formatDisplay', () => {
  it('shows the date as day, short month, year', () => {
    expect(formatDisplay('2026-10-01')).toBe('01 Oct 2026');
  });

  it('gives an empty text for a date that is not valid', () => {
    expect(formatDisplay('01/10/2026')).toBe('');
  });
});

describe('formatTimestamp', () => {
  it('shows date and time on the local clock', () => {
    // Built from local parts, so the test gives the same result in any time zone.
    const timestamp = new Date(2026, 9, 3, 14, 30).toISOString();
    expect(formatTimestamp(timestamp)).toBe('03 Oct 2026, 14:30');
  });

  it('gives an empty text for a missing or broken timestamp', () => {
    expect(formatTimestamp(undefined)).toBe('');
    expect(formatTimestamp('not a time')).toBe('');
  });
});

describe('formatLongDate', () => {
  it('shows the weekday, day, short month and year', () => {
    expect(formatLongDate(new Date(2026, 9, 3))).toBe('Saturday, 03 Oct 2026');
  });
});

describe('isOverdue', () => {
  it('is true for a pending task due before today', () => {
    expect(isOverdue(makeTask({ dueDate: '2026-10-01' }), TODAY)).toBe(true);
  });

  it('is false for a task due today, even late in the day', () => {
    expect(isOverdue(makeTask({ dueDate: '2026-10-02' }), TODAY)).toBe(false);
  });

  it('is false for a task due in the future', () => {
    expect(isOverdue(makeTask({ dueDate: '2026-10-03' }), TODAY)).toBe(false);
  });

  it('is false for a completed task, however old', () => {
    const task = makeTask({ dueDate: '2026-09-01', status: STATUS.COMPLETED });
    expect(isOverdue(task, TODAY)).toBe(false);
  });

  it('is false when the due date is not valid', () => {
    expect(isOverdue(makeTask({ dueDate: 'not a date' }), TODAY)).toBe(false);
  });
});

describe('isDueToday', () => {
  it('is true when the due date is today', () => {
    expect(isDueToday(makeTask({ dueDate: '2026-10-02' }), TODAY)).toBe(true);
  });

  it('is false for yesterday and tomorrow', () => {
    expect(isDueToday(makeTask({ dueDate: '2026-10-01' }), TODAY)).toBe(false);
    expect(isDueToday(makeTask({ dueDate: '2026-10-03' }), TODAY)).toBe(false);
  });

  it('is still true for a completed task', () => {
    const task = makeTask({ dueDate: '2026-10-02', status: STATUS.COMPLETED });
    expect(isDueToday(task, TODAY)).toBe(true);
  });

  it('is false when the due date is not valid', () => {
    expect(isDueToday(makeTask({ dueDate: '' }), TODAY)).toBe(false);
  });
});
