// Modern Figma-inspired Theme
export const theme = {
  colors: {
    // Primary - Deep Teal/Emerald
    primary: '#059669',
    primaryLight: '#10B981',
    primaryDark: '#047857',
    primaryContainer: '#D1FAE5',
    
    // Secondary - Rich Purple
    secondary: '#7C3AED',
    secondaryLight: '#A78BFA',
    secondaryDark: '#5B21B6',
    
    // Accent - Warm Orange
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentDark: '#D97706',
    
    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Neutral Colors
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    
    // Text Colors
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Border Colors
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',
    outlineVariant: '#E2E8F0',
    
    // Status-specific
    binEmpty: '#10B981',
    binFilling: '#F59E0B',
    binFull: '#EF4444',
    binOverflow: '#DC2626',
    binOffline: '#6B7280',
    
    // Status Colors
    status: {
      pending: '#F59E0B',
      inProgress: '#3B82F6',
      completed: '#10B981',
      cancelled: '#EF4444',
      full: '#F59E0B',
      overflow: '#EF4444',
      offline: '#9CA3AF',
      active: '#10B981',
      inactive: '#9CA3AF',
    },
    
    // Role Colors
    roles: {
      admin: '#EF4444',
      worker: '#3B82F6',
      citizen: '#10B981',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  
  typography: {
    h1: { fontSize: 32, fontWeight: '700' as const },
    h2: { fontSize: 24, fontWeight: '700' as const },
    h3: { fontSize: 20, fontWeight: '600' as const },
    h4: { fontSize: 18, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    bodyBold: { fontSize: 16, fontWeight: '600' as const },
    caption: { fontSize: 14, fontWeight: '400' as const },
    small: { fontSize: 12, fontWeight: '400' as const },
  },
};

