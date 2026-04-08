// LOBO Executive Protection — Brand Theme
// Premium, tactical, executive aesthetic

export const Colors = {
  // Backgrounds
  background: '#0A0A0A',       // Near black — primary background
  surface: '#141414',          // Slightly elevated surface
  surface2: '#1C1C1C',         // Cards, modals
  surface3: '#242424',         // Input fields, pressed states

  // Brand
  crimson: '#8B0000',          // Deep crimson — primary brand accent
  crimsonLight: '#B22222',     // Lighter crimson for hover/active states
  crimsonDark: '#5C0000',      // Darker crimson for borders/shadows

  // Neutrals
  steel: '#9E9E9E',            // Steel gray — secondary text
  steelLight: '#BDBDBD',       // Light steel
  gunmetal: '#2E2E2E',         // Gunmetal — dividers, borders
  border: '#2A2A2A',           // Subtle borders

  // Text
  textPrimary: '#F5F5F5',      // Crisp white
  textSecondary: '#9E9E9E',    // Steel gray
  textMuted: '#616161',        // Muted / placeholder

  // Status
  success: '#2E7D32',
  successLight: '#4CAF50',
  warning: '#E65100',
  warningLight: '#FF6D00',
  error: '#C62828',
  errorLight: '#EF5350',
  info: '#1565C0',

  // Shared
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Blackline specific
  blacklineAccent: '#C0C0C0',  // Silver — Blackline sub-brand
  blacklineDark: '#1A1A2E',    // Deep navy undertone for Blackline
} as const;

export const Typography = {
  // Font families — system fonts with premium fallback
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },

  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 28,
    '3xl': 34,
    '4xl': 40,
  },

  // Font weights
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1.0,
    widest: 2.0,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  crimson: {
    shadowColor: '#8B0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;

// Tab bar config
export const TabBar = {
  height: 72,
  backgroundColor: '#0F0F0F',
  borderTopColor: '#1E1E1E',
  activeColor: '#8B0000',
  inactiveColor: '#616161',
} as const;

// Header config
export const Header = {
  backgroundColor: '#0A0A0A',
  borderBottomColor: '#1E1E1E',
  titleColor: '#F5F5F5',
  height: 56,
} as const;

const theme = {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  TabBar,
  Header,
};

export default theme;
