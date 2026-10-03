import { View } from 'react-native';

import { Chip } from '@/components/ui';
import { STATUS } from '@/models/task';
import { useTheme } from '@/theme/useTheme';

export const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: STATUS.PENDING, label: 'Pending' },
  { value: STATUS.COMPLETED, label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

/**
 * A row of chips to choose which tasks to show: All, Pending, Completed or Overdue.
 * @param {object} props
 * @param {'all'|'pending'|'completed'|'overdue'} props.value  the chosen filter
 * @param {(value: 'all'|'pending'|'completed'|'overdue') => void} props.onChange  called with the new choice
 */
export function FilterBar({ value, onChange }) {
  const { spacing } = useTheme();

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
      {STATUS_FILTERS.map((filter) => (
        <Chip
          key={filter.value}
          label={filter.label}
          selected={value === filter.value}
          onPress={() => onChange(filter.value)}
        />
      ))}
    </View>
  );
}
