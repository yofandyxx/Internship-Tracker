// Tampilan empty state reusable
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
}

const EmptyState: React.FC<Props> = ({ icon = 'document-outline', title, message }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={56} color={COLORS.disabled} />
    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: SPACING.xl },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.disabled,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default EmptyState;