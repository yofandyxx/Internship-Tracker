import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Internship } from '../types';
import { toDateString } from '../utils/dateUtils';

interface Props {
  internship: Internship;
  companyName?: string;
  supervisorName?: string;
  studentName?: string;
  progress?: number | null;
  onPress?: () => void;
}

const InternshipCard: React.FC<Props> = ({
  internship,
  companyName,
  supervisorName,
  studentName,
  progress,
  onPress,
}) => {
  const Container: any = onPress ? TouchableOpacity : View;
  const pct = progress === null || progress === undefined ? null : Math.min(100, Math.max(0, progress));
  return (
    <Container style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>
          {companyName ?? internship.topic}
        </Text>
        <StatusBadge status={internship.status} />
      </View>
      {studentName ? <Text style={styles.meta}>{studentName}</Text> : null}
      {supervisorName ? <Text style={styles.meta}>Pembimbing: {supervisorName}</Text> : null}
      <Text style={styles.meta}>
        {toDateString(internship.startDate)} — {toDateString(internship.endDate)}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>Topik: {internship.topic}</Text>

      <View style={styles.progressRow}>
        <View style={styles.barBg}>
          <View
            style={[
              styles.barFill,
              {
                width: `${pct ?? 0}%`,
                backgroundColor: pct === null
                  ? COLORS.disabled
                  : pct >= 100 ? COLORS.green : pct >= 50 ? COLORS.accent : COLORS.orange,
              },
            ]}
          />
        </View>
        <Text style={styles.pctText}>{pct === null ? '—' : `${pct.toFixed(0)}%`}</Text>
      </View>
      <View style={styles.footerRow}>
        <Ionicons name="flag-outline" size={12} color={COLORS.textSecondary} />
        <Text style={styles.meta}>Target {internship.targetDays} hari</Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: SPACING.sm,
  },
  title: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  progressRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.sm, marginTop: SPACING.sm,
  },
  barBg: {
    flex: 1, height: 6, backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BORDER_RADIUS.full },
  pctText: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.primary },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
});

export default InternshipCard;