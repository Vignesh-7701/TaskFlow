import * as Haptics from 'expo-haptics';

/**
 * A short, light vibration to confirm a task was completed.
 * Does nothing (and never crashes) on a device without a vibration motor.
 */
export function completedFeedback() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
