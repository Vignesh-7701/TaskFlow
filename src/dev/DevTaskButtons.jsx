// TEMPORARY, development only. Removed in Session 10.
import { View } from 'react-native';

import { Button } from '@/components/ui';
import { useTaskStore } from '@/store/taskStore';
import { useTheme } from '@/theme/useTheme';

import { makeSampleTask } from './sampleTask';

/** Two test buttons: add a random task, and remove all tasks. Hidden in a real build. */
export function DevTaskButtons() {
  const { spacing } = useTheme();
  const addTask = useTaskStore((state) => state.addTask);
  const clearAll = useTaskStore((state) => state.clearAll);

  if (!__DEV__) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      <Button
        label="+ Sample task"
        variant="ghost"
        onPress={() => addTask(makeSampleTask())}
        style={{ flex: 1 }}
      />
      <Button label="Clear (dev)" variant="ghost" onPress={clearAll} style={{ flex: 1 }} />
    </View>
  );
}
