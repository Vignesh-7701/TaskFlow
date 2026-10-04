import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useTheme } from '@/theme/useTheme';

// Each option has the direction that makes sense when it is first picked:
// earliest date first, highest priority first, A to Z, newest first.
export const SORT_OPTIONS = [
  { value: 'dueDate', label: 'Due date', defaultDir: 'asc' },
  { value: 'startDate', label: 'Start date', defaultDir: 'asc' },
  { value: 'priority', label: 'Priority', defaultDir: 'desc' },
  { value: 'title', label: 'Title', defaultDir: 'asc' },
  { value: 'createdAt', label: 'Newest', defaultDir: 'desc' },
];

/**
 * "Sort: Due date ▾" opens a list of sort options; the arrow next to it flips the direction.
 * @param {object} props
 * @param {'dueDate'|'startDate'|'priority'|'title'|'createdAt'} props.sortBy
 * @param {'asc'|'desc'} props.sortDir
 * @param {(sort: { sortBy: string, sortDir: 'asc'|'desc' }) => void} props.onChange
 */
export function SortMenu({ sortBy, sortDir, onChange }) {
  const { colors, spacing, radius } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const current = SORT_OPTIONS.find((option) => option.value === sortBy) ?? SORT_OPTIONS[0];
  const isAscending = sortDir === 'asc';

  const choose = (option) => {
    onChange({ sortBy: option.value, sortDir: option.defaultDir });
    setIsOpen(false);
  };

  const flipDirection = () => {
    onChange({ sortBy, sortDir: isAscending ? 'desc' : 'asc' });
  };

  return (
    <View style={[styles.row, { gap: spacing.md }]}>
      <Pressable
        onPress={() => setIsOpen(true)}
        hitSlop={spacing.sm}
        accessibilityRole="button"
        accessibilityLabel={`Sorted by ${current.label}. Change sort`}
        style={[styles.row, styles.target, { gap: spacing.xs }]}
      >
        <AppText variant="caption">Sort:</AppText>
        <AppText variant="caption" style={styles.bold}>
          {current.label}
        </AppText>
        <Ionicons name="chevron-down" size={16} color={colors.text} />
      </Pressable>

      <Pressable
        onPress={flipDirection}
        hitSlop={spacing.sm}
        accessibilityRole="button"
        accessibilityLabel={
          isAscending ? 'Ascending. Switch to descending' : 'Descending. Switch to ascending'
        }
        style={[styles.target, styles.square]}
      >
        <Ionicons name={isAscending ? 'arrow-up' : 'arrow-down'} size={20} color={colors.text} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={[styles.backdropArea, { backgroundColor: colors.overlay }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close sort options"
          />

          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: radius.md,
              borderTopRightRadius: radius.md,
              padding: spacing.lg,
              paddingBottom: spacing.xxl,
              gap: spacing.xs,
            }}
          >
            <AppText variant="heading" style={{ marginBottom: spacing.sm }}>
              Sort by
            </AppText>

            {SORT_OPTIONS.map((option) => {
              const isSelected = option.value === sortBy;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => choose(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Sort by ${option.label}`}
                  style={[styles.row, styles.option]}
                >
                  <AppText style={[styles.optionText, isSelected && { color: colors.primary }]}>
                    {option.label}
                  </AppText>
                  {isSelected ? (
                    <Ionicons name="checkmark" size={20} color={colors.primary} />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  bold: { fontWeight: '600' },
  // At least 44 tall, the smallest comfortable touch size.
  target: { minHeight: 44 },
  square: { minWidth: 44, alignItems: 'center', justifyContent: 'center' },
  backdropArea: { flex: 1, justifyContent: 'flex-end' },
  option: { minHeight: 48 },
  optionText: { flex: 1 },
});
