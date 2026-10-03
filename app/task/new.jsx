import { useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

// Stub: the real Add Task form is built in Session 10.
export default function NewTaskScreen() {
  const router = useRouter();
  const { spacing } = useTheme();

  return (
    <Screen edges={['left', 'right', 'bottom']} style={{ gap: spacing.md }}>
      <AppText variant="title">New Task</AppText>
      <AppText variant="muted">The Add Task form comes in Session 10.</AppText>

      <Button label="Close" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
