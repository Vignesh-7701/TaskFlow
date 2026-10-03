import { filterTasks, getCategories, sortTasks } from '@/features/tasks/filterTasks';
import { PRIORITY, STATUS } from '@/models/task';

const TASKS = [
  {
    id: 'T1',
    title: 'Design login',
    description: 'Create login UI',
    category: 'Work',
    priority: PRIORITY.HIGH,
    startDate: '2026-10-01',
    dueDate: '2026-10-03',
    status: STATUS.PENDING,
    createdAt: '2026-09-28T10:00:00.000Z',
  },
  {
    id: 'T2',
    title: 'Buy groceries',
    description: 'Milk and eggs',
    category: 'Personal',
    priority: PRIORITY.LOW,
    startDate: '2026-09-30',
    dueDate: '2026-10-01',
    status: STATUS.COMPLETED,
    createdAt: '2026-09-30T10:00:00.000Z',
  },
  {
    id: 'T3',
    title: 'apple pie',
    description: 'Bake for the weekend',
    category: 'Home',
    priority: PRIORITY.MEDIUM,
    startDate: '2026-10-04',
    dueDate: '2026-10-10',
    status: STATUS.PENDING,
    createdAt: '2026-09-29T10:00:00.000Z',
  },
];

// Turns a list of tasks into a list of their ids, so results are short to compare.
const ids = (tasks) => tasks.map((task) => task.id);

describe('filterTasks', () => {
  it('keeps every task when no filter is set', () => {
    expect(ids(filterTasks(TASKS))).toEqual(['T1', 'T2', 'T3']);
  });

  it('filters by status', () => {
    expect(ids(filterTasks(TASKS, { status: STATUS.PENDING }))).toEqual(['T1', 'T3']);
    expect(ids(filterTasks(TASKS, { status: STATUS.COMPLETED }))).toEqual(['T2']);
  });

  it('searches in the title, ignoring capitals', () => {
    expect(ids(filterTasks(TASKS, { query: 'LOGIN' }))).toEqual(['T1']);
  });

  it('searches in the description', () => {
    expect(ids(filterTasks(TASKS, { query: 'milk' }))).toEqual(['T2']);
  });

  it('searches in the category', () => {
    expect(ids(filterTasks(TASKS, { query: 'home' }))).toEqual(['T3']);
  });

  it('ignores spaces around the search text', () => {
    expect(ids(filterTasks(TASKS, { query: '  login  ' }))).toEqual(['T1']);
  });

  it('filters by category', () => {
    expect(ids(filterTasks(TASKS, { category: 'Work' }))).toEqual(['T1']);
  });

  it('filters by priority', () => {
    expect(ids(filterTasks(TASKS, { priority: PRIORITY.LOW }))).toEqual(['T2']);
  });

  it('keeps only pending tasks past their due date for "overdue"', () => {
    // On 5 Oct: T1 (pending, due 3 Oct) is overdue; T2 is completed; T3 is due 10 Oct.
    const today = new Date(2026, 9, 5);
    expect(ids(filterTasks(TASKS, { status: 'overdue', today }))).toEqual(['T1']);
  });

  it('finds nothing overdue before any due date has passed', () => {
    const today = new Date(2026, 9, 1);
    expect(filterTasks(TASKS, { status: 'overdue', today })).toEqual([]);
  });

  it('applies several filters together', () => {
    expect(ids(filterTasks(TASKS, { status: STATUS.PENDING, query: 'bake' }))).toEqual(['T3']);
  });

  it('gives an empty list when nothing matches', () => {
    expect(filterTasks(TASKS, { status: STATUS.PENDING, query: 'milk' })).toEqual([]);
  });
});

describe('getCategories', () => {
  it('lists each category once, A to Z', () => {
    const tasks = [...TASKS, { ...TASKS[0], id: 'T4' }];
    expect(getCategories(tasks)).toEqual(['Home', 'Personal', 'Work']);
  });

  it('skips empty categories', () => {
    expect(getCategories([{ ...TASKS[0], category: '' }])).toEqual([]);
  });

  it('gives an empty list when there are no tasks', () => {
    expect(getCategories([])).toEqual([]);
  });
});

describe('sortTasks', () => {
  it('sorts by due date, earliest first, by default', () => {
    expect(ids(sortTasks(TASKS))).toEqual(['T2', 'T1', 'T3']);
  });

  it('sorts by due date, latest first, when descending', () => {
    expect(ids(sortTasks(TASKS, 'dueDate', 'desc'))).toEqual(['T3', 'T1', 'T2']);
  });

  it('sorts by start date', () => {
    expect(ids(sortTasks(TASKS, 'startDate', 'asc'))).toEqual(['T2', 'T1', 'T3']);
  });

  it('sorts by priority using the weights, not the alphabet', () => {
    expect(ids(sortTasks(TASKS, 'priority', 'asc'))).toEqual(['T2', 'T3', 'T1']);
    expect(ids(sortTasks(TASKS, 'priority', 'desc'))).toEqual(['T1', 'T3', 'T2']);
  });

  it('sorts by title, ignoring capitals', () => {
    expect(ids(sortTasks(TASKS, 'title', 'asc'))).toEqual(['T3', 'T2', 'T1']);
  });

  it('sorts by created time, newest first, when descending', () => {
    expect(ids(sortTasks(TASKS, 'createdAt', 'desc'))).toEqual(['T2', 'T3', 'T1']);
  });

  it('does not change the list it was given', () => {
    sortTasks(TASKS, 'title', 'asc');
    expect(ids(TASKS)).toEqual(['T1', 'T2', 'T3']);
  });
});
