import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getActiveInternshipByStudent } from '../../services/internshipService';
import { getEvaluationByInternship } from '../../services/evaluationService';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { Evaluation } from '../../types';

const MyEvaluationScreen: React.FC = () => {
  const { appUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const active = await getActiveInternshipByStudent(appUser.uid);
      if (active) {
        const ev = await getEvaluationByInternship(active.id, 'studentId', appUser.uid);
        if (ev && ev.isFinal) setEvaluation(ev);
        else setEvaluation(null);
      } else {
        setEvaluation(null);
      }
    } catch {
      // diamkan
    }
  }, [appUser]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);
      load().finally(() => {
        if (mounted) setLoading(false);
      });
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Penilaian" />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!evaluation) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Penilaian" />
        <EmptyState
          icon="ribbon-outline"
          title="Belum ada penilaian final"
          message="Penilaian akan muncul setelah dipublikasikan oleh pembimbing."
        />
      </SafeAreaView>
    );
  }

  const rows = [
    { label: 'Kedisiplinan (20%)', value: evaluation.discipline },
    { label: 'Tanggung Jawab (20%)', value: evaluation.responsibility },
    { label: 'Komunikasi (15%)', value: evaluation.communication },
    { label: 'Kerja Sama (15%)', value: evaluation.teamwork },
    { label: 'Kompetensi Teknis (30%)', value: evaluation.technicalSkill },
  ];

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Penilaian" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Nilai Akhir</Text>
          <Text style={styles.scoreValue}>{evaluation.finalScore.toFixed(2)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rincian Nilai</Text>
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.value}>{r.value}</Text>
            </View>
          ))}
        </View>

        {evaluation.notes ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Catatan Pembimbing</Text>
            <Text style={styles.text}>{evaluation.notes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  scoreCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  scoreLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.sm },
  scoreValue: { color: COLORS.surface, fontSize: 56, fontWeight: '800', marginTop: 4 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.textSecondary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  label: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  value: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  text: { fontSize: FONT_SIZE.sm, color: COLORS.text, lineHeight: 20 },
});

export default MyEvaluationScreen;
