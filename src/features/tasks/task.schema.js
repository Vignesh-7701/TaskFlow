import { z } from 'zod';

import { PRIORITIES, STATUSES } from '@/constants';
import { isValidISODate } from '@/utils/date';

// A date written as YYYY-MM-DD that really exists.
const isoDate = (label) => z.string().refine(isValidISODate, `${label} is not a valid date`);

/**
 * The rules a task must follow before it can be saved from the form.
 * Parsing also cleans the values: spaces around title, description and category are removed.
 */
export const taskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Title is required')
      .max(100, 'Title must be 100 characters or less'),
    description: z.string().trim().max(500, 'Description must be 500 characters or less'),
    category: z
      .string()
      .trim()
      .min(1, 'Category is required')
      .max(30, 'Category must be 30 characters or less'),
    priority: z.enum(PRIORITIES),
    startDate: isoDate('Start date'),
    dueDate: isoDate('Due date'),
    status: z.enum(STATUSES),
  })
  .refine(
    // Rule across two fields. ISO dates can be compared as text: '2026-10-01' < '2026-10-02'.
    (task) => {
      const bothValid = isValidISODate(task.startDate) && isValidISODate(task.dueDate);
      return !bothValid || task.dueDate >= task.startDate;
    },
    {
      path: ['dueDate'],
      message: "Due date can't be before start date",
      // Check the dates even when another field (e.g. the title) has an error,
      // so the user sees every problem at once.
      when: () => true,
    },
  );
