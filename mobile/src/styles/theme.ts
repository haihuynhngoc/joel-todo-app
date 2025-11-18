export const theme = {
  colors: {
    primary: '#3B82F6',
    text: '#1F2937',
    textMuted: '#6B7280',
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    background: '#FFFFFF',
    backgroundAlt: '#F9FAFB',
    border: '#E5E7EB',
    disabled: '#D1D5DB',
    todoItemBg: '#FFFFFF',
    todoItemBgCompleted: '#F3F4F6',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  fontSize: {
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },

  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  borderRadius: 8,

  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },

    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },

    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;

export type Shadow = typeof theme.shadow.small;
