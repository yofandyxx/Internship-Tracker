import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import EvaluationCard from '../../components/EvaluationCard';
import { useAuth } from '../../hooks/useAuth';
import { listInternshipsBySupervisor } from '../../services/internshipService';
import { fetchAppUser } from '../../services/userService';
import { listLogsByInternship } from '../../services/dailyLogService';
import {
  listEvaluationsBySupervisor,
  EvaluationWithStudent,
} from '../../services/evaluationService';
import { calculateProgress } from '../../utils/progressUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AppUser, Internship, DailyLog } from '../../types';

interface StudentRow {
  internship: Internship;
  student: AppUser | null;
  logs: DailyLog[];
  approved: number;
  pending: number;
  revision: number;
  progress: number | null;
}

const SupervisorReportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { appUser } = useAuth();
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const [ints, evals] = await Promise.all([
        listInternshipsBySupervisor(appUser.uid),
        listEvaluationsBySupervisor(appUser.uid),
      ]);
      setEvaluations(evals);

      const result: StudentRow[] = [];
      for (const i of ints) {
        const [student, logs] = await Promise.all([
          fetchAppUser(i.studentId),
          listLogsByInternship(i.id),
        ]);
        result.push({
          internship: i,
          student,
          logs,
          approved: logs.filter((l) => l.reviewStatus === 'approved').length,
          pending: logs.filter((l) => l.reviewStatus === 'pending_review').length,
          revision: logs.filter((l) => l.reviewStatus === 'needs_revision').length,
          progress: calculateProgress(logs, i.targetDays),
        });
      }
      setRows(result);
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

  const finalEvals = useMemo(
    () => evaluations.filter((e) => e.isFinal),
    [evaluations]
  );

  const averageScore = useMemo(() => {
    if (finalEvals.length === 0) return null;
    const sum = finalEvals.reduce((acc, e) => acc + e.finalScore, 0);
    return Math.round((sum / finalEvals.length) * 100) / 100;
  }, [finalEvals]);

  const totalPending = rows.reduce((a, r) => a + r.pending, 0);
  const totalRevision = rows.reduce((a, r) => a + r.revision, 0);
  const totalApproved = rows.reduce((a, r) => a + r.approved, 0);

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Laporan Bimbingan" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Laporan Bimbingan" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.sectionLabel}>Ringkasan</Text>
        <View style={styles.rowWrap}>
          <StatCard
            label="Mahasiswa"
            value={rows.length}
            icon="people"
            color={COLORS.primary}
          />
          <StatCard
            label="Nilai Rata-rata"
            value={averageScore === null ? '—' : averageScore.toFixed(1)}
            icon="ribbon"
            color={COLORS.green}
          />
        </View>
        <View style={styles.rowWrap}>
          <StatCard
            label="Jurnal Menunggu"
            value={totalPending}
            icon="hourglass"
            color={COLORS.orange}
          />
          <StatCard
            label="Perlu Revisi"
            value={totalRevision}
            icon="refresh"
            color={COLORS.red}
          />
        </View>
        <View style={styles.rowWrap}>
          <StatCard
            label="Jurnal Disetujui"
            value={totalApproved}
            icon="checkmark-done"
            color={COLORS.green}
          />
          <StatCard
            label="Penilaian Final"
            value={finalEvals.length}
            icon="trophy"
            color={COLORS.purple}
          />
        </View>

        <Text style={styles.sectionLabel}>Progress per Mahasiswa</Text>
        {rows.length === 0 ? (
          <EmptyState icon="people-outline" title="Belum ada mahasiswa bimbingan" />
        ) : (
          rows.map((r) => (
            <TouchableOpacity
              key={r.internship.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('InternshipDetail', {
                  internshipId: r.internship.id,
                })
              }
            >
              <View style={styles.row}>
                <Text style={styles.name} numberOfLines={1}>
                  {r.student?.name ?? 'Mahasiswa'}
                </Text>
                <Text style={styles.pct}>
                  {r.progress === null ? '—' : `${r.progress.toFixed(0)}%`}
                </Text>
              </View>
              <Text style={styles.meta}>
                {r.student?.nim ?? '-'} • {r.student?.studyProgram ?? '-'}
              </Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${Math.min(100, r.progress ?? 0)}%`,
                      backgroundColor:
                        (r.progress ?? 0) >= 100 ? COLORS.green
                          : (r.progress ?? 0) >= 50 ? COLORS.accent
                          : COLORS.orange,
                    },
                  ]}
                />
              </View>
              <View style={styles.chipRow}>
                <Chip label={`${r.approved} disetujui`} color={COLORS.green} />
                <Chip label={`${r.pending} menunggu`} color={COLORS.orange} />
                <Chip label={`${r.revision} revisi`} color={COLORS.red} />
              </View>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionLabel}>
          Penilaian Final ({finalEvals.length})
        </Text>
        {finalEvals.length === 0 ? (
          <EmptyState
            icon="ribbon-outline"
            title="Belum ada penilaian final"
            message="Penilaian yang difinalisasi akan tampil di sini."
          />
        ) : (
          finalEvals.map((e) => (
            <EvaluationCard
              key={e.id}
              evaluation={e}
              studentName={e.studentName}
              compact
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const Chip: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <View style={[styles.chip, { backgroundColor: `${color}15` }]}>
    <Text style={[styles.chipText, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  sectionLabel: {
    fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700',
    textTransform: 'uppercase', marginTop: SPACING.md, marginBottom: SPACING.sm,
  },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  card: {
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: SPACING.sm,
  },
  name: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  pct: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  barBg: {
    height: 6, backgroundColor: COLORS.border, borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm, overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: BORDER_RADIUS.full },
  chipRow: {
    flexDirection: 'row', gap: SPACING.xs, marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  chip: { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: BORDER_RADIUS.full },
  chipText: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
});

export default SupervisorReportScreen;