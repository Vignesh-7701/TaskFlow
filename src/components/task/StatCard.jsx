import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';

/**
 * A card showing one number and what it counts, e.g. "8 Total". Used on the Dashboard.
 * @param {object} props
 * @param {string} props.label  what is being counted
 * @param {number} props.value  the number
 * @param {() => void} [props.onPress]  what to do when it is pressed
 * @param {object} [props.style]  extra style
 */
export function StatCard({ label, value, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${label}: ${value}`}
      style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}
    >
      <Card>
        <AppText variant="title">{value}</AppText>
        <AppText variant="muted">{label}</AppText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1 },
  pressed: { opacity: 0.7 },
});
