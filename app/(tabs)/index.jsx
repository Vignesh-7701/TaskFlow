import { useRouter } from 'expo-router';

import { AppText, Button, Screen } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

// Stub: the real Dashboard is built in Session 8.
// The buttons are temporary, to test the routes from Session 7.
export default function HomeScreen() {
  const router = useRouter();
  const { spacing } = useTheme();

  return (
    <Screen style={{ gap: spacing.md }}>
      <AppText variant="title">Home</AppText>
      <AppText variant="muted">The Dashboard comes in Session 8.</AppText>

      <Button label="Open Add Task" onPress={() => router.push('/task/new')} />
      <Button label="Open task T1" variant="secondary" onPress={() => router.push('/task/T1')} />
    </Screen>
  );
}
