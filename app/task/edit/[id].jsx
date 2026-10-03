import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { ErrorState, Screen } from '@/components/ui';
import { TaskForm } from '@/features/tasks/TaskForm';
import { getFormValues } from '@/features/tasks/taskDefaults';
import { useTaskStore } from '@/store/taskStore';

const EDGES = ['left', 'right', 'bottom'];

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // The task with this id, or undefined if there is none.
  const task = useTaskStore((state) => state.tasks.find((item) => item.id === id));
  const updateTask = useTaskStore((state) => state.updateTask);

  // The form starts with the task's values as they were when the screen opened.
  const [defaultValues] = useState(() => (task ? getFormValues(task) : null));

  if (!task) {
    return (
      <Screen edges={EDGES}>
        <ErrorState
          title="Task not found"
          message="It may have been deleted."
          retryLabel="Go back"
          onRetry={() => router.back()}
        />
      </Screen>
    );
  }

  const handleSave = (values) => {
    updateTask(task.id, values);
    router.back();
    Alert.alert('Task updated', `"${values.title}" was saved.`);
  };

  return (
    <Screen edges={EDGES}>
      <TaskForm defaultValues={defaultValues} onSubmit={handleSave} submitLabel="Save Changes" />
    </Screen>
  );
}
