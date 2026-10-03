import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

// Stub: the real Edit Task form is built in Session 10.
export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { spacing } = useTheme();

  return (
    <Screen edges={['left', 'right', 'bottom']} style={{ gap: spacing.md }}>
      <AppText variant="title">Edit Task {id}</AppText>
      <AppText variant="muted">The Edit Task form comes in Session 10.</AppText>

      <Button label="Close" variant="secondary" onPress={() => router.back()} />
    </Screen>
  );
}
