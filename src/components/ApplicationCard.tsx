import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StatusBadge from './StatusBadge';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { InternshipApplication } from '../types';
import { toDateString } from '../utils/dateUtils';

interface Props {
  application: InternshipApplication;
  studentName?: string;
  companyName?: string;
  onPress?: () => void;
}

const ApplicationCard: React.FC<Props> = ({
  application,
  studentName,
  companyName,
  onPress,
}) => {
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.topic} numberOfLines={1}>{application.topic}</Text>
        <StatusBadge status={application.status} />
      </View>
      {studentName ? <Text style={styles.meta}>{studentName}</Text> : null}
      {companyName ? <Text style={styles.meta}>{companyName}</Text> : null}
      <View style={styles.periodRow}>
        <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
        <Text style={styles.meta}>
          {toDateString(application.startDate)} — {toDateString(application.endDate)}
        </Text>
      </View>
      {application.decisionNotes ? (
        <View style={styles.notesBox}>
          <Ionicons name="chatbubble-outline" size={12} color={COLORS.primary} />
          <Text style={styles.notesText} numberOfLines={2}>{application.decisionNotes}</Text>
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
  topic: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  periodRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  notesBox: {
    flexDirection: 'row', gap: 4, alignItems: 'center',
    marginTop: SPACING.sm, paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: COLORS.border,
  },
  notesText: { flex: 1, fontSize: FONT_SIZE.xs, color: COLORS.primary, fontStyle: 'italic' },
});

export default ApplicationCard;