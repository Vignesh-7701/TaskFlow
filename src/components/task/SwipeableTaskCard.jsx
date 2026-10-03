import { Ionicons } from '@expo/vector-icons';
import { memo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { AppText } from '@/components/ui';
import { STATUS } from '@/models/task';
import { useTheme } from '@/theme/useTheme';

import { TaskCard } from './TaskCard';

/**
 * A TaskCard that can be swiped: right to complete (or undo), left to delete.
 * Takes the same props as TaskCard; `onDelete` is required here.
 * @param {object} props
 * @param {import('@/models/task').Task} props.task
 * @param {(id: string) => void} props.onPress
 * @param {(id: string) => void} props.onToggleComplete
 * @param {(task: import('@/models/task').Task) => void} props.onDelete
 */
function SwipeableTaskCardBase({ task, onPress, onToggleComplete, onDelete }) {
  const { colors, spacing, radius } = useTheme();
  const swipeableRef = useRef(null);

  const isDone = task.status === STATUS.COMPLETED;

  // Called when a swipe has gone far enough to open one side.
  const handleOpen = (direction) => {
    if (direction === 'right') {
      onToggleComplete(task.id);
    } else {
      onDelete(task);
    }
    // Slide the card back; the action has been done (or asked about).
    swipeableRef.current?.close();
  };

  const actionStyle = [styles.action, { borderRadius: radius.md, gap: spacing.xs }];
  const labelStyle = [styles.label, { color: colors.onPrimary }];

  // Shown behind the card when it is pulled to the right.
  const renderCompleteAction = () => (
    <View
      style={[
        actionStyle,
        styles.alignStart,
        { backgroundColor: colors.success, paddingLeft: spacing.lg },
      ]}
    >
      <Ionicons name={isDone ? 'arrow-undo' : 'checkmark'} size={22} color={colors.onPrimary} />
      <AppText style={labelStyle}>{isDone ? 'Pending' : 'Complete'}</AppText>
    </View>
  );

  // Shown behind the card when it is pulled to the left.
  const renderDeleteAction = () => (
    <View
      style={[
        actionStyle,
        styles.alignEnd,
        { backgroundColor: colors.danger, paddingRight: spacing.lg },
      ]}
    >
      <AppText style={labelStyle}>Delete</AppText>
      <Ionicons name="trash" size={22} color={colors.onPrimary} />
    </View>
  );

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={80}
      rightThreshold={80}
      renderLeftActions={renderCompleteAction}
      renderRightActions={renderDeleteAction}
      onSwipeableOpen={handleOpen}
    >
      <TaskCard
        task={task}
        onPress={onPress}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
      />
    </ReanimatedSwipeable>
  );
}

export const SwipeableTaskCard = memo(SwipeableTaskCardBase);

const styles = StyleSheet.create({
  action: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  alignStart: { justifyContent: 'flex-start' },
  alignEnd: { justifyContent: 'flex-end' },
  label: { fontWeight: '600' },
});
