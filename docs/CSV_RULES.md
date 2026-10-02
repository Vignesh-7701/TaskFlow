# TaskFlow - CSV Rules

These are the rules for checking a CSV file on the Bulk Upload screen. The validator in `src/features/import/csvValidator.js` follows this table.

| Rule | Error message |
|---|---|
| Header must contain all 8 columns | `Missing column: <name>` (whole file rejected) |
| `id`, `title`, `category` required | `<field> is required` |
| `priority` is low / medium / high (case-insensitive) | `Invalid priority "<v>"` |
| `status` is pending / completed (case-insensitive) | `Invalid status "<v>"` |
| Dates are valid `YYYY-MM-DD` | `Invalid <field> "<v>"` |
| `due_date` is on or after `start_date` | `Due date is before start date` |
| `id` repeated inside the file | `Duplicate id in file` (first kept, rest skipped) |
| `id` already exists in the app | `Already exists` (skipped, reported as duplicate) |
| Empty rows | silently ignored |

## Row numbers

Row numbers shown to the user match what they see in Excel: the header is row 1, the first data row is row 2.

## The 8 columns

```
id,title,description,category,priority,start_date,due_date,status
```
