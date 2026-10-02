# TaskFlow - Data Model

The app stores one kind of thing: a task.

## Allowed values

```js
export const PRIORITY = Object.freeze({ LOW: 'low', MEDIUM: 'medium', HIGH: 'high' });
export const STATUS = Object.freeze({ PENDING: 'pending', COMPLETED: 'completed' });
```

## Task

```js
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
```

`createdAt` and `updatedAt` are set by the app, not by the user.

## CSV columns

```
id,title,description,category,priority,start_date,due_date,status
```

The CSV uses snake_case (`start_date`, `due_date`). Inside the app the same fields are camelCase (`startDate`, `dueDate`).
