import { zodResolver } from '@hookform/resolvers/zod';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';

import { Button, Chip, ChipGroup, DateField, Input } from '@/components/ui';
import { PRIORITY, STATUS } from '@/models/task';
import { useTaskStore } from '@/store/taskStore';
import { useTheme } from '@/theme/useTheme';

import { getCategories } from './filterTasks';
import { taskSchema } from './task.schema';

const PRIORITY_OPTIONS = [
  { value: PRIORITY.LOW, label: 'Low' },
  { value: PRIORITY.MEDIUM, label: 'Medium' },
  { value: PRIORITY.HIGH, label: 'High' },
];

const STATUS_OPTIONS = [
  { value: STATUS.PENDING, label: 'Pending' },
  { value: STATUS.COMPLETED, label: 'Completed' },
];

/**
 * The task form, shared by Add Task and Edit Task.
 * @param {object} props
 * @param {object} props.defaultValues  the values the fields start with
 * @param {(values: object) => void | Promise<void>} props.onSubmit  called with clean values, only when all rules pass
 * @param {string} props.submitLabel  the words on the save button
 */
export function TaskForm({ defaultValues, onSubmit, submitLabel }) {
  const { spacing } = useTheme();
  // The header bar above the form. The keyboard handling must allow for it.
  const headerHeight = useHeaderHeight();

  // Categories already in use, offered as quick picks under the Category field.
  const tasks = useTaskStore((state) => state.tasks);
  const categories = useMemo(() => getCategories(tasks), [tasks]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
      style={styles.fill}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xl }}
      >
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              label="Title"
              placeholder="What needs to be done?"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              label="Description"
              placeholder="Optional notes..."
              multiline
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={errors.description?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="priority"
          render={({ field }) => (
            <ChipGroup
              label="Priority"
              options={PRIORITY_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.priority?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <View style={{ gap: spacing.sm }}>
              <Input
                label="Category"
                placeholder="Work, Personal..."
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                error={errors.category?.message}
              />
              {categories.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ gap: spacing.sm }}
                >
                  {categories.map((name) => (
                    <Chip
                      key={name}
                      label={name}
                      selected={field.value === name}
                      onPress={() => field.onChange(name)}
                    />
                  ))}
                </ScrollView>
              ) : null}
            </View>
          )}
        />

        <View style={[styles.row, { gap: spacing.md }]}>
          <View style={styles.fill}>
            <Controller
              control={control}
              name="startDate"
              // When the start date changes, check the due date again too:
              // its "before start date" error may now be fixed (or newly true).
              rules={{ deps: 'dueDate' }}
              render={({ field }) => (
                <DateField
                  label="Start date"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.startDate?.message}
                />
              )}
            />
          </View>
          <View style={styles.fill}>
            <Controller
              control={control}
              name="dueDate"
              render={({ field }) => (
                <DateField
                  label="Due date"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.dueDate?.message}
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <ChipGroup
              label="Status"
              options={STATUS_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.status?.message}
            />
          )}
        />

        <Button
          label={submitLabel}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
});
