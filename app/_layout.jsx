import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Loader } from '@/components/ui';
import { useTaskStore } from '@/store/taskStore';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useTheme } from '@/theme/useTheme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.fill}>
      <ErrorBoundary>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

// Lives inside ThemeProvider, so it can read the theme.
function RootStack() {
  const { colors, isDark } = useTheme();
  const hasHydrated = useTaskStore((state) => state.hasHydrated);

  const statusBar = <StatusBar style={isDark ? 'light' : 'dark'} />;

  // Until the saved tasks are loaded, show a spinner instead of screens with an empty list.
  if (!hasHydrated) {
    return (
      <>
        {statusBar}
        <Loader label="Loading your tasks" />
      </>
    );
  }

  return (
    <>
      {statusBar}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="task/[id]" options={{ title: 'Task' }} />
        <Stack.Screen
          name="task/new"
          options={{ title: 'New Task', presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="task/edit/[id]"
          options={{ title: 'Edit Task', presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
