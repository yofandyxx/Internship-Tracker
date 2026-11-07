// Konstanta tema: warna, spacing, tipografi, dan status
export const COLORS = {
  primary: '#1A237E',        // Biru tua
  primaryLight: '#3949AB',
  accent: '#00B0FF',         // Biru terang
  purple: '#7C4DFF',
  green: '#00C853',
  orange: '#FF6D00',
  red: '#D50000',
  background: '#F5F6FA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  disabled: '#BDBDBD',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 999,
} as const;