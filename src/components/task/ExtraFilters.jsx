import { ScrollView, View } from 'react-native';

import { Chip } from '@/components/ui';
import { PRIORITY } from '@/models/task';
import { useTheme } from '@/theme/useTheme';

const PRIORITY_FILTERS = [
  { value: PRIORITY.HIGH, label: 'High' },
  { value: PRIORITY.MEDIUM, label: 'Medium' },
  { value: PRIORITY.LOW, label: 'Low' },
];

/**
 * A sideways-scrolling row of chips: the three priorities, then every category in use.
 * Tapping a chosen chip again turns that filter off.
 * @param {object} props
 * @param {'low'|'medium'|'high'|null} props.priority  the chosen priority, or null for any
 * @param {(priority: 'low'|'medium'|'high'|null) => void} props.onPriorityChange
 * @param {string[]} props.categories  the categories to offer
 * @param {string|null} props.category  the chosen category, or null for any
 * @param {(category: string|null) => void} props.onCategoryChange
 */
export function ExtraFilters({
  priority,
  onPriorityChange,
  categories,
  category,
  onCategoryChange,
}) {
  const { colors, spacing } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ gap: spacing.sm, alignItems: 'center' }}
    >
      {PRIORITY_FILTERS.map((filter) => (
        <Chip
          key={filter.value}
          label={filter.label}
          selected={priority === filter.value}
          onPress={() => onPriorityChange(priority === filter.value ? null : filter.value)}
        />
      ))}

      {categories.length > 0 ? (
        <View style={{ width: 1, alignSelf: 'stretch', backgroundColor: colors.border }} />
      ) : null}

      {categories.map((name) => (
        <Chip
          key={name}
          label={name}
          selected={category === name}
          onPress={() => onCategoryChange(category === name ? null : name)}
        />
      ))}
    </ScrollView>
  );
}
