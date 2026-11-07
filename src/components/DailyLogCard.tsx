import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { DailyLog } from '../types';
import { toDateString } from '../utils/dateUtils';

interface Props {
  log: DailyLog;
  studentName?: string;
  onPress?: () => void;
  showComment?: boolean;
}

const DailyLogCard: React.FC<Props> = ({ log, studentName, onPress, showComment = true }) => {
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.date}>{toDateString(log.date)}</Text>
        <StatusBadge status={log.reviewStatus} />
      </View>
      {studentName ? (
        <Text style={styles.studentName} numberOfLines={1}>{studentName}</Text>
      ) : null}
      <View style={styles.typeRow}>
        <Ionicons name="pricetag-outline" size={12} color={COLORS.primary} />
        <Text style={styles.type}>{log.activityType}</Text>
      </View>
      <Text style={styles.desc} numberOfLines={2}>{log.description}</Text>
      {showComment && log.supervisorComment ? (
        <View style={styles.comment}>
          <Ionicons name="chatbubble-outline" size={12} color={COLORS.primary} />
          <Text style={styles.commentText} numberOfLines={2}>
            {log.supervisorComment}
          </Text>
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
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: SPACING.sm,
  },
  date: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  studentName: {
    fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '600', marginTop: 4,
  },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  type: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.primary },
  desc: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4 },
  comment: {
    flexDirection: 'row', gap: 4, alignItems: 'center',
    marginTop: SPACING.xs, paddingTop: SPACING.xs,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border,
  },
  commentText: {
    flex: 1, fontSize: FONT_SIZE.xs,
    color: COLORS.primary, fontStyle: 'italic',
  },
});

export default DailyLogCard;