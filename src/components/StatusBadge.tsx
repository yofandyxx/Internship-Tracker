// Badge status: pengajuan, review, magang
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface Props {
  status: string;
  label?: string;
}

const colorFor = (status: string): string => {
  switch (status) {
    case 'pending':
    case 'pending_review':
      return COLORS.orange;
    case 'approved':
      return COLORS.green;
    case 'rejected':
    case 'needs_revision':
      return COLORS.red;
    case 'ongoing':
      return COLORS.accent;
    case 'completed':
      return COLORS.primary;
    default:
      return COLORS.textSecondary;
  }
};

const labelFor = (status: string): string => {
  switch (status) {
    case 'pending': return 'Menunggu';
    case 'approved': return 'Disetujui';
    case 'rejected': return 'Ditolak';
    case 'pending_review': return 'Menunggu Review';
    case 'needs_revision': return 'Perlu Revisi';
    case 'ongoing': return 'Berlangsung';
    case 'completed': return 'Selesai';
    default: return status;
  }
};

const StatusBadge: React.FC<Props> = ({ status, label }) => {
  const color = colorFor(status);
  return (
    <View style={[styles.container, { backgroundColor: `${color}20`, borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label ?? labelFor(status)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
});

export default StatusBadge;