// The allowed values for a task's priority and status.
export const PRIORITY = Object.freeze({ LOW: 'low', MEDIUM: 'medium', HIGH: 'high' });
export const STATUS = Object.freeze({ PENDING: 'pending', COMPLETED: 'completed' });

/**
 * @typedef {Object} Task
 * @property {string} id           CSV id or UUID
 * @property {string} title        1-100 chars
 * @property {string} description  0-500 chars
 * @property {string} category     free text, 1-30 chars (e.g. Work, Personal)
 * @property {'low'|'medium'|'high'} priority
 * @property {string} startDate    'YYYY-MM-DD'
 * @property {string} dueDate      'YYYY-MM-DD', must be >= startDate
 * @property {'pending'|'completed'} status
 * @property {string} createdAt    ISO timestamp
 * @property {string} updatedAt    ISO timestamp
 */
