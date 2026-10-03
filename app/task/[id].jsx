import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

// Stub: the real Task Details screen is built in Session 11.
export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { spacing } = useTheme();

  return (
    <Screen edges={['left', 'right', 'bottom']} style={{ gap: spacing.md }}>
      <AppText variant="title">Task {id}</AppText>
      <AppText variant="muted">Task Details comes in Session 11.</AppText>

      <Button label="Edit this task" onPress={() => router.push(`/task/edit/${id}`)} />
      <Button label="Go back" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
