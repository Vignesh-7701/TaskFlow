import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Alert } from 'react-native';

import { Screen } from '@/components/ui';
import { TaskForm } from '@/features/tasks/TaskForm';
import { getNewTaskDefaults } from '@/features/tasks/taskDefaults';
import { useTaskStore } from '@/store/taskStore';

export default function NewTaskScreen() {
  const router = useRouter();
  const addTask = useTaskStore((state) => state.addTask);

  // Worked out once, when the screen opens.
  const defaultValues = useMemo(() => getNewTaskDefaults(), []);

  // Only called when every rule in the schema passes; `values` are already cleaned.
  const handleSave = (values) => {
    addTask(values);
    router.back();
    Alert.alert('Task created', `"${values.title}" was added.`);
  };

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <TaskForm defaultValues={defaultValues} onSubmit={handleSave} submitLabel="Save Task" />
    </Screen>
  );
}
