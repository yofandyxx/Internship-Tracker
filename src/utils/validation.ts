export const isNonEmpty = (value: string): boolean => value.trim().length > 0;

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPassword = (value: string): boolean => value.length >= 6;

export const isValidScore = (value: number): boolean =>
  Number.isFinite(value) && value >= 0 && value <= 100;
