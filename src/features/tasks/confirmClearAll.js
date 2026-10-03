import { Alert } from 'react-native';

/**
 * Asks twice before deleting every task, because it cannot be undone.
 * Runs `onConfirm` only if the user agrees both times.
 * @param {number} count  how many tasks would be deleted
 * @param {() => void} onConfirm
 */
export function confirmClearAll(count, onConfirm) {
  const tasksText = `${count} ${count === 1 ? 'task' : 'tasks'}`;

  const askAgain = () => {
    Alert.alert('Are you sure?', `All ${tasksText} will be deleted permanently.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete all', style: 'destructive', onPress: onConfirm },
    ]);
  };

  Alert.alert('Clear all tasks?', `This will delete ${tasksText}. This can't be undone.`, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Continue', style: 'destructive', onPress: askAgain },
  ]);
}
