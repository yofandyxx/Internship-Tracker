import React, { useCallback, useEffect, useState } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getAdminStats, AdminStats } from '../../services/dashboardService';
import { listAllApplications } from '../../services/applicationService';
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';
import { InternshipApplication } from '../../types';
import { toDateString } from '../../utils/dateUtils';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser, logout } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentApps, setRecentApps] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [s, apps] = await Promise.all([getAdminStats(), listAllApplications()]);
      setStats(s);
      setRecentApps(apps.slice(0, 5));
    } catch (e: any) {
      setError(e?.message ?? 'Gagal memuat dashboard');
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

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Dashboard Admin" subtitle={appUser?.name} rightIcon="log-out-outline" onRightPress={logout} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Dashboard Admin" subtitle={appUser?.name} rightIcon="log-out-outline" onRightPress={logout} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Halo, {appUser?.name?.split(' ')[0] ?? 'Admin'} 👋</Text>
          <Text style={styles.greetingSub}>Ringkasan monitoring magang PPNP</Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color={COLORS.red} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {stats ? (
          <>
            <View style={styles.rowWrap}>
              <StatCard label="Mahasiswa" value={stats.totalStudents} icon="people" color={COLORS.primary} />
              <StatCard label="Perusahaan" value={stats.totalCompanies} icon="business" color={COLORS.purple} />
            </View>
            <View style={styles.rowWrap}>
              <StatCard label="Pengajuan Menunggu" value={stats.pendingApplications} icon="hourglass" color={COLORS.orange} />
              <StatCard label="Disetujui" value={stats.approvedApplications} icon="checkmark-done" color={COLORS.green} />
            </View>
            <View style={styles.rowWrap}>
              <StatCard label="Magang Aktif" value={stats.ongoingInternships} icon="briefcase" color={COLORS.accent} />
              <StatCard label="Magang Selesai" value={stats.completedInternships} icon="trophy" color={COLORS.primaryLight} />
            </View>
            <View style={styles.rowWrap}>
              <StatCard label="Total Jurnal" value={stats.totalLogs} icon="document-text" color={COLORS.primary} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistik Program Studi</Text>
              <View style={styles.card}>
                {Object.keys(stats.studyProgramStats).length === 0 ? (
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
            </View>
          </>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Pengajuan Terbaru</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminTabs')}
              style={{ display: 'none' }}
            />
          </View>
          {recentApps.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.emptyText}>Belum ada pengajuan.</Text>
            </View>
          ) : (
            recentApps.map((app) => (
              <TouchableOpacity
                key={app.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ApplicationReview', { applicationId: app.id })
                }
              >
                <View style={styles.row}>
                  <Text style={styles.topic} numberOfLines={1}>
                    {app.topic}
                  </Text>
                  <StatusBadge status={app.status} />
                </View>
                <Text style={styles.meta}>
                  Periode: {toDateString(app.startDate)} — {toDateString(app.endDate)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  greeting: { marginBottom: SPACING.md },
  greetingTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text },
  greetingSub: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, marginTop: 2 },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  section: { marginTop: SPACING.md },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  topic: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomColor: COLORS.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  statValue: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  emptyText: { fontSize: FONT_SIZE.sm, color: COLORS.textSecondary, textAlign: 'center' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: `${COLORS.red}10`,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  errorText: { color: COLORS.red, fontSize: FONT_SIZE.xs, flex: 1 },
});

export default AdminDashboardScreen;