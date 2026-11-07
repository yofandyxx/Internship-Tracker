// Kartu progress bar untuk menampilkan persentase
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  progress: number | null;
  detail?: string;
}

const ProgressCard: React.FC<Props> = ({ title, subtitle, progress, detail }) => {
  const pct = progress ?? 0;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.pct}>
          {progress === null ? '—' : `${clamped.toFixed(1)}%`}
        </Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            {
              width: `${clamped}%`,
              backgroundColor:
                clamped >= 100 ? COLORS.green : clamped >= 50 ? COLORS.accent : COLORS.orange,
            },
          ]}
        />
      </View>
      {detail ? <Text style={styles.detail}>{detail}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  pct: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  barBg: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BORDER_RADIUS.full },
  detail: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: SPACING.xs },
});

export default ProgressCard;