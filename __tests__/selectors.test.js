import { STATUS } from '@/models/task';
import { selectStats } from '@/store/selectors';

// A fixed "today" so the tests give the same result on any day: 2 Oct 2026, 3 pm.
const TODAY = new Date(2026, 9, 2, 15, 0);

const makeTask = (overrides) => ({
  status: STATUS.PENDING,
  dueDate: '2026-10-10',
  ...overrides,
});

describe('selectStats', () => {
  it('gives all zeros for an empty list', () => {
    expect(selectStats([], TODAY)).toEqual({
      total: 0,
      completed: 0,
      pending: 0,
      today: 0,
      overdue: 0,
    });
  });

  it('counts total, completed and pending', () => {
    const tasks = [
      makeTask({ status: STATUS.COMPLETED }),
      makeTask({ status: STATUS.PENDING }),
      makeTask({ status: STATUS.PENDING }),
    ];

    const stats = selectStats(tasks, TODAY);

    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
  });

  it('counts tasks due today, whatever their status', () => {
    const tasks = [
      makeTask({ dueDate: '2026-10-02' }),
      makeTask({ dueDate: '2026-10-02', status: STATUS.COMPLETED }),
      makeTask({ dueDate: '2026-10-03' }),
    ];

    expect(selectStats(tasks, TODAY).today).toBe(2);
  });

  it('counts only pending tasks with a past due date as overdue', () => {
    const tasks = [
      makeTask({ dueDate: '2026-10-01' }),
      makeTask({ dueDate: '2026-09-15' }),
      makeTask({ dueDate: '2026-10-01', status: STATUS.COMPLETED }),
      makeTask({ dueDate: '2026-10-02' }),
    ];

    expect(selectStats(tasks, TODAY).overdue).toBe(2);
  });

  it('completed plus pending always equals total', () => {
    const tasks = [
      makeTask({ status: STATUS.COMPLETED }),
      makeTask({ status: STATUS.COMPLETED }),
      makeTask({}),
    ];

    const stats = selectStats(tasks, TODAY);

    expect(stats.completed + stats.pending).toBe(stats.total);
  });
});
