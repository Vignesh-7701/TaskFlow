import { Text } from 'react-native';

import { useTheme } from '@/theme/useTheme';

/**
 * Text that follows the theme. Use this instead of React Native's Text.
 * @param {object} props
 * @param {'title'|'heading'|'body'|'caption'|'muted'} [props.variant]  which text style to use
 * @param {object} [props.style]  extra style
 * @param {React.ReactNode} props.children  the words to show
 */
export function AppText({ variant = 'body', style, children, ...rest }) {
  const { colors, typography } = useTheme();

  const isMuted = variant === 'muted';
  const textStyle = isMuted ? typography.caption : typography[variant];
  const color = isMuted ? colors.textMuted : colors.text;

  return (
    <Text style={[textStyle, { color }, style]} {...rest}>
      {children}
    </Text>
  );
}
