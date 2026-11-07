import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Evaluation } from '../types';

interface Props {
  evaluation: Evaluation;
  studentName?: string;
  onPress?: () => void;
  compact?: boolean;
}

const EvaluationCard: React.FC<Props> = ({ evaluation, studentName, onPress, compact = false }) => {
  const Container: any = onPress ? TouchableOpacity : View;

  if (compact) {
    return (
      <Container style={styles.compactCard} onPress={onPress}>
        <View style={{ flex: 1 }}>
          <Text style={styles.studentName} numberOfLines={1}>
            {studentName ?? 'Mahasiswa'}
          </Text>
          <Text style={styles.meta}>
            {evaluation.isFinal ? 'Final' : 'Draf'}
          </Text>
        </View>
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>{evaluation.finalScore.toFixed(1)}</Text>
        </View>
      </Container>
    );
  }

  const rows = [
    { label: 'Kedisiplinan', value: evaluation.discipline },
    { label: 'Tanggung Jawab', value: evaluation.responsibility },
    { label: 'Komunikasi', value: evaluation.communication },
    { label: 'Kerja Sama', value: evaluation.teamwork },
    { label: 'Kompetensi Teknis', value: evaluation.technicalSkill },
  ];

  return (
    <Container style={styles.card} onPress={onPress}>
      {studentName ? (
        <Text style={styles.headerName} numberOfLines={1}>{studentName}</Text>
      ) : null}
      <View style={styles.scoreRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.scoreLabel}>Nilai Akhir</Text>
          <Text style={styles.scoreValue}>{evaluation.finalScore.toFixed(2)}</Text>
        </View>
        <View style={[styles.statusPill, {
          backgroundColor: evaluation.isFinal ? `${COLORS.green}15` : `${COLORS.orange}15`,
        }]}>
          <Ionicons
            name={evaluation.isFinal ? 'checkmark-circle' : 'time-outline'}
            size={12}
            color={evaluation.isFinal ? COLORS.green : COLORS.orange}
          />
          <Text style={[styles.statusPillText, {
            color: evaluation.isFinal ? COLORS.green : COLORS.orange,
          }]}>
            {evaluation.isFinal ? 'Final' : 'Draf'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsBox}>
        {rows.map((r) => (
          <View key={r.label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{r.label}</Text>
            <Text style={styles.detailValue}>{r.value}</Text>
          </View>
        ))}
      </View>

      {evaluation.notes ? (
        <View style={styles.notesBox}>
          <Ionicons name="chatbubble-outline" size={12} color={COLORS.primary} />
          <Text style={styles.notesText} numberOfLines={3}>{evaluation.notes}</Text>
        </View>
      ) : null}
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
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  headerName: {
    fontSize: FONT_SIZE.md, fontWeight: '700',
    color: COLORS.text, marginBottom: SPACING.xs,
  },
  studentName: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  scoreRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: SPACING.sm, marginBottom: SPACING.sm,
  },
  scoreLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  scoreValue: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.primary },
  scoreBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
  },
  scoreBadgeText: { color: COLORS.surface, fontWeight: '800', fontSize: FONT_SIZE.md },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.full,
  },
  statusPillText: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
  detailsBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border, paddingTop: SPACING.sm,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 3,
  },
  detailLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary },
  detailValue: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.text },
  notesBox: {
    flexDirection: 'row', gap: 4, alignItems: 'center',
    marginTop: SPACING.sm, paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border,
  },
  notesText: {
    flex: 1, fontSize: FONT_SIZE.xs,
    color: COLORS.primary, fontStyle: 'italic',
  },
});

export default EvaluationCard;