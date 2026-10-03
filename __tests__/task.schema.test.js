import { taskSchema } from '@/features/tasks/task.schema';
import { PRIORITY, STATUS } from '@/models/task';

const VALID = {
  title: 'Design login',
  description: 'Create login UI',
  category: 'Work',
  priority: PRIORITY.HIGH,
  startDate: '2026-10-01',
  dueDate: '2026-10-03',
  status: STATUS.PENDING,
};

// Parses the values and turns the problems into { field: message }, e.g. { title: 'Title is required' }.
// Gives an empty object when everything is valid.
const errorsFor = (values) => {
  const result = taskSchema.safeParse(values);
  if (result.success) {
    return {};
  }
  return Object.fromEntries(result.error.issues.map((issue) => [issue.path[0], issue.message]));
};

describe('taskSchema', () => {
  it('accepts a valid task', () => {
    expect(errorsFor(VALID)).toEqual({});
  });

  it('removes spaces around title, description and category', () => {
    const result = taskSchema.safeParse({
      ...VALID,
      title: '  Design login  ',
      description: ' Create login UI ',
      category: ' Work ',
    });

    expect(result.success).toBe(true);
    expect(result.data.title).toBe('Design login');
    expect(result.data.description).toBe('Create login UI');
    expect(result.data.category).toBe('Work');
  });

  describe('title', () => {
    it('is required', () => {
      expect(errorsFor({ ...VALID, title: '' }).title).toBe('Title is required');
    });

    it('counts only spaces as empty', () => {
      expect(errorsFor({ ...VALID, title: '   ' }).title).toBe('Title is required');
    });

    it('allows up to 100 characters', () => {
      expect(errorsFor({ ...VALID, title: 'a'.repeat(100) })).toEqual({});
      expect(errorsFor({ ...VALID, title: 'a'.repeat(101) }).title).toBe(
        'Title must be 100 characters or less',
      );
    });
  });

  describe('description', () => {
    it('may be empty', () => {
      expect(errorsFor({ ...VALID, description: '' })).toEqual({});
    });

    it('allows up to 500 characters', () => {
      expect(errorsFor({ ...VALID, description: 'a'.repeat(501) }).description).toBe(
        'Description must be 500 characters or less',
      );
    });
  });

  describe('category', () => {
    it('is required', () => {
      expect(errorsFor({ ...VALID, category: '  ' }).category).toBe('Category is required');
    });

    it('allows up to 30 characters', () => {
      expect(errorsFor({ ...VALID, category: 'a'.repeat(31) }).category).toBe(
        'Category must be 30 characters or less',
      );
    });
  });

  it('accepts only low, medium or high as priority', () => {
    expect(errorsFor({ ...VALID, priority: PRIORITY.LOW })).toEqual({});
    expect(errorsFor({ ...VALID, priority: 'urgent' }).priority).toBeDefined();
  });

  it('accepts only pending or completed as status', () => {
    expect(errorsFor({ ...VALID, status: STATUS.COMPLETED })).toEqual({});
    expect(errorsFor({ ...VALID, status: 'done' }).status).toBeDefined();
  });

  describe('dates', () => {
    it('rejects a date in another format', () => {
      expect(errorsFor({ ...VALID, startDate: '01/10/2026' }).startDate).toBe(
        'Start date is not a valid date',
      );
    });

    it('rejects a date that does not exist', () => {
      expect(errorsFor({ ...VALID, dueDate: '2026-02-30' }).dueDate).toBe(
        'Due date is not a valid date',
      );
    });

    it('rejects a due date before the start date, on the due date field', () => {
      expect(errorsFor({ ...VALID, startDate: '2026-10-05', dueDate: '2026-10-01' })).toEqual({
        dueDate: "Due date can't be before start date",
      });
    });

    it('accepts a due date on the same day as the start date', () => {
      expect(errorsFor({ ...VALID, startDate: '2026-10-05', dueDate: '2026-10-05' })).toEqual({});
    });
  });

  it('reports several problems at once', () => {
    const errors = errorsFor({ ...VALID, title: '', dueDate: '2026-09-01' });

    expect(errors.title).toBe('Title is required');
    expect(errors.dueDate).toBe("Due date can't be before start date");
  });
});
