import Constants from 'expo-constants';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ActionRow, AppText, Card, ChipGroup, InfoRow, Screen } from '@/components/ui';
import { confirmClearAll } from '@/features/tasks/confirmClearAll';
import { useSettingsStore } from '@/store/settingsStore';
import { useTaskStore } from '@/store/taskStore';
import { useTheme } from '@/theme/useTheme';
import { exportFileName, tasksToCsv } from '@/utils/csvExport';
import { shareCsvFile } from '@/utils/shareCsv';

const THEME_OPTIONS = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Read from app.json ("name" and "version") when the app starts.
const appName = Constants.expoConfig?.name ?? 'TaskFlow';
const appVersion = Constants.expoConfig?.version ?? 'unknown';

const THEME_HINTS = {
  system: "Follows your phone's light or dark setting.",
  light: 'Always light, whatever the phone is set to.',
  dark: 'Always dark, whatever the phone is set to.',
};

export default function SettingsScreen() {
  const { spacing } = useTheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);

  const taskCount = useTaskStore((state) => state.tasks.length);
  const clearAll = useTaskStore((state) => state.clearAll);

  let clearNote = 'No tasks to delete';
  if (taskCount === 1) {
    clearNote = 'Deletes your 1 task';
  } else if (taskCount > 1) {
    clearNote = `Deletes all ${taskCount} tasks`;
  }

  const [isExporting, setIsExporting] = useState(false);

  const exportTasks = async () => {
    setIsExporting(true);
    try {
      // Read the tasks once, now: exporting does not need to redraw on every change.
      const { tasks } = useTaskStore.getState();
      await shareCsvFile(tasksToCsv(tasks), exportFileName());
    } catch (exportError) {
      Alert.alert('Export failed', exportError?.message ?? 'The file could not be shared.');
    } finally {
      setIsExporting(false);
    }
  };

  let exportNote = 'No tasks to export';
  if (isExporting) {
    exportNote = 'Preparing the file...';
  } else if (taskCount > 0) {
    exportNote = `${taskCount} ${taskCount === 1 ? 'task' : 'tasks'} as a CSV file`;
  }

  const askToClearAll = () => {
    confirmClearAll(taskCount, () => {
      clearAll();
      Alert.alert('All tasks deleted');
    });
  };

  return (
    <Screen scroll style={{ gap: spacing.md }}>
      <AppText variant="title">Settings</AppText>

      <AppText variant="heading">Appearance</AppText>
      <Card style={{ gap: spacing.sm }}>
        <ChipGroup
          label="Theme"
          options={THEME_OPTIONS}
          value={themeMode}
          onChange={setThemeMode}
        />
        <AppText variant="muted">{THEME_HINTS[themeMode]}</AppText>
      </Card>

      <AppText variant="heading">Data</AppText>
      <Card style={{ paddingVertical: 0 }}>
        <ActionRow
          icon="share-outline"
          label="Export tasks (CSV)"
          note={exportNote}
          disabled={taskCount === 0 || isExporting}
          onPress={exportTasks}
        />
        <ActionRow
          icon="trash-outline"
          label="Clear all tasks"
          note={clearNote}
          danger
          disabled={taskCount === 0}
          onPress={askToClearAll}
          isLast
        />
      </Card>

      <AppText variant="heading">About</AppText>
      <Card>
        <InfoRow label="App" value={appName} />
        <InfoRow label="Version" value={appVersion} isLast />
      </Card>
    </Screen>
  );
}
