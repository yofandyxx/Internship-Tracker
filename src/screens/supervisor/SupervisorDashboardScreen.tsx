import React, { useCallback, useState } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatCard from '../../components/StatCard';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getSupervisorStats, SupervisorStats } from '../../services/dashboardService';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { SupervisorStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<SupervisorStackParamList>;

const SupervisorDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<SupervisorStats | null>(null);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const s = await getSupervisorStats(appUser.uid);
      setStats(s);
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

  if (loading || !appUser) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Dashboard Pembimbing" subtitle={appUser?.name} rightIcon="log-out-outline" onRightPress={logout} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Dashboard Pembimbing" subtitle={appUser.name} rightIcon="log-out-outline" onRightPress={logout} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Halo, {appUser.name.split(' ')[0]} 👋</Text>
          <Text style={styles.greetingSub}>Monitoring mahasiswa bimbingan</Text>
        </View>

        <View style={styles.rowWrap}>
          <StatCard label="Mahasiswa Bimbingan" value={stats?.totalStudents ?? 0} icon="people" color={COLORS.primary} />
          <StatCard label="Menunggu Review" value={stats?.pendingReviews ?? 0} icon="hourglass" color={COLORS.orange} />
        </View>
        <View style={styles.rowWrap}>
          <StatCard label="Perlu Revisi" value={stats?.needsRevision ?? 0} icon="refresh" color={COLORS.red} />
          <StatCard label="Disetujui" value={stats?.approved ?? 0} icon="checkmark-done" color={COLORS.green} />
        </View>

        <Text style={styles.sectionTitle}>Mahasiswa Bimbingan</Text>
        {!stats || stats.students.length === 0 ? (
          <EmptyState icon="people-outline" title="Belum ada mahasiswa" message="Belum ada mahasiswa yang ditugaskan." />
        ) : (
          stats.students.map((s) => {
            const int = stats.internships.find((i) => i.studentId === s.uid);
            return (
              <TouchableOpacity
                key={s.uid}
                style={styles.card}
                onPress={() =>
                  int && navigation.navigate('InternshipDetail', { internshipId: int.id })
                }
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{s.name}</Text>
                    <Text style={styles.meta}>{s.nim ?? '-'} • {s.studyProgram ?? '-'}</Text>
                    <Text style={styles.meta}>{int?.topic ?? '-'}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
                </View>
              </TouchableOpacity>
            );
          })
        )}
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
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
});

export default SupervisorDashboardScreen;