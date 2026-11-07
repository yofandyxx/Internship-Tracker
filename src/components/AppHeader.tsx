// Header reusable dengan tombol back opsional
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
}

const AppHeader: React.FC<Props> = ({ title, subtitle, onBack, rightIcon, onRightPress }) => {
  return (
    <View style={styles.container}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={COLORS.surface} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        ) : null}
      </View>
      {rightIcon && onRightPress ? (
        <TouchableOpacity onPress={onRightPress} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name={rightIcon} size={22} color={COLORS.surface} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  title: { color: COLORS.surface, fontSize: FONT_SIZE.lg, fontWeight: '700' },
  subtitle: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs, marginTop: 2 },
});

export default AppHeader;