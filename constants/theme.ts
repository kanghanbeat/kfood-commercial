import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#FF6B35',
    secondary: '#2EC4B6',
    accent: '#FFD700',
    error: '#EF4444',
    background: '#F9F9F9',
    surface: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#22C55E',
    warning: '#F59E0B',
    disabled: '#D1D5DB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 32,
  },
  radius: {
    card: 16,
    input: 12,
    button: 12,
  },
  typography: {
    fontFamily: Platform.select({
      web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      default: 'System',
    }),
    size: {
      title: 28,
      subtitle: 20,
      body: 16,
      caption: 13,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  layout: {
    maxContentWidth: 600,
    screenPadding: 20,
  },
};

// Compatibility exports for starter components that are still kept in the project.
export const KFoodColors = {
  kimchi: theme.colors.primary,
  leaf: theme.colors.secondary,
  rice: '#FFF8EA',
  charcoal: theme.colors.textPrimary,
  stone: theme.colors.textSecondary,
  border: theme.colors.border,
  surface: theme.colors.surface,
};

export const Colors = {
  light: {
    text: theme.colors.textPrimary,
    background: theme.colors.background,
    tint: theme.colors.primary,
    icon: theme.colors.textSecondary,
    tabIconDefault: theme.colors.textSecondary,
    tabIconSelected: theme.colors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: theme.colors.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: theme.colors.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
