import { Alert } from 'react-native';

/**
 * Asks "Delete task?" with Cancel and Delete buttons. Runs `onConfirm` only if Delete is tapped.
 * Every way of deleting a task goes through this, so deleting always asks first.
 * @param {import('@/models/task').Task} task
 * @param {() => void} onConfirm
 */
export function confirmDeleteTask(task, onConfirm) {
  Alert.alert('Delete task?', `"${task.title}" will be deleted. This can't be undone.`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}
