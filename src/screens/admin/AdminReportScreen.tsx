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
import { getAdminStats, AdminStats } from '../../services/dashboardService';
import { listAllApplications } from '../../services/applicationService';
import { listAllInternships } from '../../services/internshipService';
import {
  listAllEvaluations,
  EvaluationWithStudent,
} from '../../services/evaluationService';
import {
  applicationStatusLabel,
  internshipStatusLabel,
} from '../../utils/workflowUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

type PeriodFilter = 'all' | '3months' | '6months' | 'year';

const AdminReportScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [appStats, setAppStats] = useState<Record<string, number>>({});
  const [intStats, setIntStats] = useState<Record<string, number>>({});
  const [evaluations, setEvaluations] = useState<EvaluationWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState<PeriodFilter>('all');

  const load = useCallback(async () => {
    try {
      const [s, apps, ints, evals] = await Promise.all([
        getAdminStats(),
        listAllApplications(),
        listAllInternships(),
        listAllEvaluations(),
      ]);
      setStats(s);

      const appMap: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
      apps.forEach((a) => {
        appMap[a.status] = (appMap[a.status] ?? 0) + 1;
      });
      setAppStats(appMap);

      const intMap: Record<string, number> = { ongoing: 0, completed: 0 };
      ints.forEach((i) => {
        intMap[i.status] = (intMap[i.status] ?? 0) + 1;
      });
      setIntStats(intMap);

      setEvaluations(evals);
    } catch {
      // diamkan; tetap tampilkan layout kosong
    }
  }, []);

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

  // Filter periode berdasarkan publishedAt / createdAt evaluasi
  const filteredEvaluations = useMemo(() => {
    if (period === 'all') return evaluations;
    const now = new Date();
    const monthsBack =
      period === '3months' ? 3 : period === '6months' ? 6 : 12;
    const cutoff = new Date(now.getFullYear(), now.getMonth() - monthsBack, now.getDate());
    return evaluations.filter((e) => {
      const ts = e.publishedAt ?? e.createdAt;
      if (!ts) return false;
      return ts.toDate() >= cutoff;
    });
  }, [evaluations, period]);

  const finalEvaluations = useMemo(
    () => filteredEvaluations.filter((e) => e.isFinal),
    [filteredEvaluations]
  );

  const averageScore = useMemo(() => {
    if (finalEvaluations.length === 0) return null;
    const sum = finalEvaluations.reduce((acc, e) => acc + e.finalScore, 0);
    return Math.round((sum / finalEvaluations.length) * 100) / 100;
  }, [finalEvaluations]);

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Laporan & Statistik" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  const periodBtn = (key: PeriodFilter, label: string) => (
    <TouchableOpacity
      key={key}
      onPress={() => setPeriod(key)}
      style={[styles.periodBtn, period === key && styles.periodBtnActive]}
    >
      <Text style={[styles.periodText, period === key && styles.periodTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Laporan & Statistik" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Filter Periode */}
        <Text style={styles.sectionLabel}>Filter Periode Penilaian</Text>
        <View style={styles.periodRow}>
          {periodBtn('all', 'Semua')}
          {periodBtn('3months', '3 Bulan')}
          {periodBtn('6months', '6 Bulan')}
          {periodBtn('year', '1 Tahun')}
        </View>

        {/* Ringkasan Global */}
        <Text style={styles.sectionLabel}>Ringkasan</Text>
        <View style={styles.rowWrap}>
          <StatCard
            label="Total Mahasiswa"
            value={stats?.totalStudents ?? 0}
            icon="people"
            color={COLORS.primary}
          />
          <StatCard
            label="Total Perusahaan"
            value={stats?.totalCompanies ?? 0}
            icon="business"
            color={COLORS.purple}
          />
        </View>
        <View style={styles.rowWrap}>
          <StatCard
            label="Magang Aktif"
            value={stats?.ongoingInternships ?? 0}
            icon="briefcase"
            color={COLORS.accent}
          />
          <StatCard
            label="Magang Selesai"
            value={stats?.completedInternships ?? 0}
            icon="trophy"
            color={COLORS.primaryLight}
          />
        </View>
        <View style={styles.rowWrap}>
          <StatCard
            label="Total Jurnal"
            value={stats?.totalLogs ?? 0}
            icon="document-text"
            color={COLORS.green}
          />
          <StatCard
            label="Nilai Rata-rata"
            value={averageScore === null ? '—' : averageScore.toFixed(1)}
            icon="ribbon"
            color={COLORS.orange}
          />
        </View>

        {/* Statistik Program Studi */}
        <Text style={styles.sectionLabel}>Statistik Program Studi</Text>
        <View style={styles.card}>
          {!stats || Object.keys(stats.studyProgramStats).length === 0 ? (
            <Text style={styles.emptyText}>Belum ada data.</Text>
          ) : (
            Object.entries(stats.studyProgramStats).map(([prog, count]) => (
              <View key={prog} style={styles.statRow}>
                <Text style={styles.statLabel}>{prog}</Text>
                <Text style={styles.statValue}>{count}</Text>
              </View>
            ))
          )}
        </View>

        {/* Statistik Status Pengajuan */}
        <Text style={styles.sectionLabel}>Statistik Status Pengajuan</Text>
        <View style={styles.card}>
          {(['pending', 'approved', 'rejected'] as const).map((s) => (
            <View key={s} style={styles.statRow}>
              <Text style={styles.statLabel}>{applicationStatusLabel(s)}</Text>
              <Text style={styles.statValue}>{appStats[s] ?? 0}</Text>
            </View>
          ))}
        </View>

        {/* Statistik Status Magang */}
        <Text style={styles.sectionLabel}>Statistik Status Magang</Text>
        <View style={styles.card}>
          {(['ongoing', 'completed'] as const).map((s) => (
            <View key={s} style={styles.statRow}>
              <Text style={styles.statLabel}>{internshipStatusLabel(s)}</Text>
              <Text style={styles.statValue}>{intStats[s] ?? 0}</Text>
            </View>
          ))}
        </View>

        {/* Rekap Penilaian */}
        <Text style={styles.sectionLabel}>
          Rekap Penilaian Final ({finalEvaluations.length})
        </Text>
        {finalEvaluations.length === 0 ? (
          <EmptyState
            icon="ribbon-outline"
            title="Belum ada penilaian final"
            message="Penilaian yang difinalisasi akan muncul di sini."
          />
        ) : (
          finalEvaluations.map((e) => (
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

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  sectionLabel: {
    fontSize: FONT_SIZE.xs, color: COLORS.textSecondary,
    fontWeight: '700', textTransform: 'uppercase',
    marginTop: SPACING.md, marginBottom: SPACING.sm,
  },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  statLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  statValue: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  emptyText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center' },
  periodRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs,
  },
  periodBtn: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.full,
    borderWidth: 1, borderColor: COLORS.border,
  },
  periodBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  periodText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  periodTextActive: { color: COLORS.surface },
});

export default AdminReportScreen;