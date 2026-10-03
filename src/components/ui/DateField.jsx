import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/useTheme';
import { formatDisplay, fromISODate, toISODate } from '@/utils/date';

import { AppText } from './AppText';

/**
 * A field that shows a date and opens the phone's date picker when tapped.
 * Looks like Input: label above, error below.
 * @param {object} props
 * @param {string} props.label  the words above the field
 * @param {string} props.value  the date as 'YYYY-MM-DD'
 * @param {(value: string) => void} props.onChange  called with the new date as 'YYYY-MM-DD'
 * @param {string} [props.error]  an error message; also turns the border red
 */
export function DateField({ label, value, onChange, error }) {
  const { colors, spacing, radius } = useTheme();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const shownText = formatDisplay(value) || 'Pick a date';

  // Called when the user picks a day and taps OK.
  const handlePicked = (event, pickedDate) => {
    setIsPickerOpen(false);
    onChange(toISODate(pickedDate));
  };

  return (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="caption" style={styles.label}>
        {label}
      </AppText>

      <Pressable
        onPress={() => setIsPickerOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${shownText}. Change date`}
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            borderRadius: radius.sm,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        <AppText style={styles.text}>{shownText}</AppText>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
      </Pressable>

      {error ? (
        <AppText variant="caption" style={{ color: colors.danger }}>
          {error}
        </AppText>
      ) : null}

      {isPickerOpen ? (
        <DateTimePicker
          mode="date"
          value={fromISODate(value) ?? new Date()}
          onValueChange={handlePicked}
          onDismiss={() => setIsPickerOpen(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '600' },
  field: { minHeight: 48, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  text: { flex: 1 },
});
