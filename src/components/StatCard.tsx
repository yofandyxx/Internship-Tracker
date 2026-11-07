// Kartu statistik berwarna untuk dashboard
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface Props {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
}

const StatCard: React.FC<Props> = ({ label, value, icon, color = COLORS.primary }) => (
  <View style={[styles.container, { backgroundColor: color }]}>
    <View style={styles.iconWrap}>
      <Ionicons name={icon} size={22} color={COLORS.surface} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label} numberOfLines={2}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  value: { color: COLORS.surface, fontSize: FONT_SIZE.xxl, fontWeight: '800' },
  label: { color: 'rgba(255,255,255,0.9)', fontSize: FONT_SIZE.sm, marginTop: 2 },
});

export default StatCard;