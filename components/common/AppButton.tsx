import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/constants/theme';

type AppButtonVariant = 'primary' | 'outline' | 'danger' | 'secondary' | 'ghost';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: AppButtonProps) {
  const variantStyle = buttonStyles[variant];
  const textStyle = textStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variantStyle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    fontSize: theme.typography.size.body,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
  disabledText: {
    color: theme.colors.surface,
  },
});

const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
  },
  outline: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
  },
  danger: {
    backgroundColor: theme.colors.error,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});

const textStyles = StyleSheet.create({
  primary: {
    color: theme.colors.surface,
  },
  outline: {
    color: theme.colors.primary,
  },
  danger: {
    color: theme.colors.surface,
  },
  secondary: {
    color: theme.colors.surface,
  },
  ghost: {
    color: theme.colors.textSecondary,
  },
});
