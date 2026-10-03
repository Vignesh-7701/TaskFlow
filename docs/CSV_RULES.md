# TaskFlow - CSV Rules

These are the rules for checking a CSV file on the Bulk Upload screen. The parser in `src/features/import/csvParser.js` and the validator in `src/features/import/csvValidator.js` follow this page.

## The 8 columns

```
id,title,description,category,priority,start_date,due_date,status
```

## Header line (optional)

| File                                | How it is read                                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First line contains any column name | It is a header. Columns are matched by name, in any order; names ignore capitals and spaces. All 8 must be present, or the whole file is rejected with `Missing column: <name>` |
| First line contains no column name  | There is no header. Every line is a task, with the 8 columns in the standard order above                                                                                        |

## Dates

`start_date` and `due_date` may be written either way:

| Format                           | Example      | Stored as    |
| -------------------------------- | ------------ | ------------ |
| `YYYY-MM-DD`                     | `2026-09-28` | `2026-09-28` |
| `DD-MM-YYYY` (day first, always) | `28-09-2026` | `2026-09-28` |

Anything else, or a day that does not exist (e.g. `31-02-2026`), is invalid.

## Rules per row

| Rule                                                 | Error message                                     |
| ---------------------------------------------------- | ------------------------------------------------- |
| `id`, `title`, `category` required                   | `<field> is required`                             |
| `priority` is low / medium / high (case-insensitive) | `Invalid priority "<v>"`                          |
| `status` is pending / completed (case-insensitive)   | `Invalid status "<v>"`                            |
| Dates in one of the two formats above                | `Invalid <field> "<v>"`                           |
| `due_date` is on or after `start_date`               | `Due date is before start date`                   |
| `id` repeated inside the file                        | `Duplicate id in file` (first kept, rest skipped) |
| `id` already exists in the app                       | `Already exists` (skipped, reported as duplicate) |
| Empty rows                                           | silently ignored                                  |

## Row numbers

Row numbers shown to the user match the line in the file, as in Excel:

- With a header: the header is row 1, the first task is row 2.
- Without a header: the first task is row 1.

Empty lines are skipped but still counted, so the numbers always match the file.
