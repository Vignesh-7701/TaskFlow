import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { PriorityBadge } from '@/components/task/PriorityBadge';
import { StatCard } from '@/components/task/StatCard';
import {
  AppText,
  Button,
  Card,
  Chip,
  EmptyState,
  ErrorState,
  FAB,
  Input,
  Loader,
  Screen,
} from '@/components/ui';
import { PRIORITY } from '@/models/task';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme } from '@/theme/useTheme';

const THEME_MODES = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

// Temporary preview screen for Session 5. It is replaced by the Dashboard later.
export default function Home() {
  const { spacing } = useTheme();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
  const [title, setTitle] = useState('');

  const row = { flexDirection: 'row', gap: spacing.sm };
  const pressed = (name) => Alert.alert('Pressed', name);

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxl * 3 }}
      >
        <AppText variant="title">UI Kit</AppText>

        <AppText variant="heading">Theme</AppText>
        <View style={row}>
          {THEME_MODES.map((mode) => (
            <Chip
              key={mode.value}
              label={mode.label}
              selected={themeMode === mode.value}
              onPress={() => setThemeMode(mode.value)}
            />
          ))}
        </View>

        <AppText variant="heading">Text</AppText>
        <AppText>Body text</AppText>
        <AppText variant="caption">Caption text</AppText>
        <AppText variant="muted">Muted text</AppText>

        <AppText variant="heading">Buttons</AppText>
        <Button label="Primary" onPress={() => pressed('Primary')} />
        <Button label="Secondary" variant="secondary" onPress={() => pressed('Secondary')} />
        <Button label="Danger" variant="danger" onPress={() => pressed('Danger')} />
        <Button label="Ghost" variant="ghost" onPress={() => pressed('Ghost')} />
        <Button label="Loading" loading onPress={() => pressed('Loading')} />
        <Button label="Disabled" disabled onPress={() => pressed('Disabled')} />

        <AppText variant="heading">Inputs</AppText>
        <Input label="Title" placeholder="Type a title" value={title} onChangeText={setTitle} />
        <Input label="Description" placeholder="Optional notes..." multiline />
        <Input label="Category" placeholder="Work, Personal..." error="Category is required" />

        <AppText variant="heading">Priority badges</AppText>
        <View style={row}>
          <PriorityBadge priority={PRIORITY.LOW} />
          <PriorityBadge priority={PRIORITY.MEDIUM} />
          <PriorityBadge priority={PRIORITY.HIGH} />
        </View>

        <AppText variant="heading">Stat cards</AppText>
        <View style={row}>
          <StatCard label="Total" value={8} onPress={() => pressed('Total')} />
          <StatCard label="Completed" value={3} onPress={() => pressed('Completed')} />
        </View>

        <AppText variant="heading">Empty state</AppText>
        <Card>
          <EmptyState
            title="No tasks yet"
            message="Add your first task to get started."
            actionLabel="Add task"
            onAction={() => pressed('Add task')}
          />
        </Card>

        <AppText variant="heading">Error state</AppText>
        <Card>
          <ErrorState message="The file could not be read." onRetry={() => pressed('Try again')} />
        </Card>

        <AppText variant="heading">Loader</AppText>
        <Card style={{ height: spacing.xxl * 3 }}>
          <Loader />
        </Card>
      </ScrollView>

      <FAB accessibilityLabel="Add task" onPress={() => pressed('FAB')} />
    </Screen>
  );
}
