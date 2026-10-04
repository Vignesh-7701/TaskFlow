# TaskFlow

An offline task manager for Android, built with React Native and Expo. Create, search, filter and track tasks, and import or export them in bulk as CSV files. Everything is stored on the device; there is no server and no account.

## Features

- **Dashboard**: counts of total, completed, pending and due-today tasks, an overdue indicator, today's tasks, and shortcuts to the task list and bulk upload.
- **Task list**: search (title, description, category), filters by status (all, pending, completed, overdue), priority and category, five sort orders, swipe right to complete and swipe left to delete.
- **Add and edit**: one form for both, with validation (required fields, length limits, due date not before start date), priority and status chips, category quick picks, and a date picker.
- **Task details**: every field, overdue highlighting, and actions to complete, edit or delete.
- **Bulk upload (CSV)**: pick a file, see a preview of valid, invalid and duplicate rows with row numbers and reasons, then import only the valid rows.
- **Export (CSV)**: export all tasks to a CSV file and share it. The exported file re-imports cleanly.
- **Settings**: system, light or dark theme (remembered across restarts), clear all tasks (double confirmation), app version.
- Light and dark themes throughout, haptic feedback on completing a task, and an error screen if anything crashes.

## Tech stack

| Area                 | Library                                                                       |
| -------------------- | ----------------------------------------------------------------------------- |
| Framework            | React Native 0.86, Expo SDK 57, JavaScript (no TypeScript)                    |
| Navigation           | Expo Router (file-based: stack, tabs, modals)                                 |
| State and storage    | Zustand with `persist`, AsyncStorage                                          |
| Forms and validation | react-hook-form, zod                                                          |
| Dates                | date-fns, @react-native-community/datetimepicker                              |
| CSV                  | papaparse, expo-document-picker, expo-file-system, expo-sharing               |
| Gestures             | react-native-gesture-handler (`ReanimatedSwipeable`), react-native-reanimated |
| Other                | expo-crypto (ids), expo-haptics, expo-constants, expo-splash-screen           |
| Quality              | ESLint, Prettier, Jest (`jest-expo`)                                          |

## Project structure

```
taskflow/
├── app/                      Screens (Expo Router: one file per route)
│   ├── _layout.jsx           Root: error boundary, theme, loading gate, stack
│   ├── (tabs)/               Home, Tasks, Upload, Settings
│   └── task/                 Details ([id].jsx), Add (new.jsx), Edit (edit/[id].jsx)
├── src/
│   ├── components/
│   │   ├── ui/               Reusable UI: Button, Input, Chip, Card, FAB, ...
│   │   └── task/             TaskCard, PriorityBadge, StatCard, FilterBar, SortMenu, ...
│   ├── features/
│   │   ├── tasks/            Form, validation schema, filtering and sorting
│   │   ├── import/           CSV parser, validator, upload flow and preview
│   │   └── dashboard/        Dashboard header and upload shortcut
│   ├── store/                Task and settings stores, stats selector
│   ├── theme/                Design tokens, ThemeProvider, useTheme
│   ├── utils/                Dates, ids, CSV export, sharing, haptics
│   ├── models/               Task shape and allowed values
│   └── constants/
├── __tests__/                Unit tests
├── docs/                     PRD, data model, CSV rules
└── assets/                   App icon and splash images
```

Screens in `app/` stay thin: they compose components and hooks; the logic lives in `src/` and is unit tested.

## Getting started

Requirements: Node.js 20 or later, and the **Expo Go** app on an Android phone on the same Wi-Fi network as the computer.

```bash
npm install
npx expo start
```

Scan the QR code shown in the terminal with Expo Go. If the phone cannot connect, use `npx expo start --tunnel`.

## Scripts

| Command          | What it does                    |
| ---------------- | ------------------------------- |
| `npm start`      | start the development server    |
| `npm test`       | run the unit tests              |
| `npm run lint`   | check the code with ESLint      |
| `npm run format` | format every file with Prettier |

The unit tests cover the date helpers, the stats selector, filtering and sorting, the task form's validation rules, the CSV parser and validator, and the CSV export (including an export → import round trip).

## Building the APK

Builds run on Expo's servers with EAS Build. A free expo.dev account is needed.

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

The `preview` profile in `eas.json` produces an `.apk` that can be installed directly. When the build finishes, open the download link on the phone, allow installing from unknown sources if asked, and install.

## CSV format

Import and export use the same 8 columns:

```
id,title,description,category,priority,start_date,due_date,status
```

- The header line is optional. Without it, the columns must be in the order above.
- `priority`: `low`, `medium` or `high`. `status`: `pending` or `completed`. Capitals are ignored.
- Dates: `YYYY-MM-DD` or `DD-MM-YYYY` (day first). Exports use `DD-MM-YYYY`.
- `id`, `title` and `category` are required, and the due date must not be before the start date.
- An id repeated in the file, or already in the app, is skipped and reported as a duplicate.

Example:

```
id,title,description,category,priority,start_date,due_date,status
T1,Design login,Create login UI,Work,High,01-10-2026,03-10-2026,pending
T2,Buy groceries,Milk and eggs,Personal,low,2026-10-01,2026-10-01,completed
```

The full rules, with every error message, are in [docs/CSV_RULES.md](docs/CSV_RULES.md).

## Documentation

- [docs/PRD.md](docs/PRD.md): what the app is for and what is in scope
- [docs/DATA_MODEL.md](docs/DATA_MODEL.md): the shape of a task
- [docs/CSV_RULES.md](docs/CSV_RULES.md): the CSV import rules
