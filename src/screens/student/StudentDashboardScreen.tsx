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
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatCard from '../../components/StatCard';
import ProgressCard from '../../components/ProgressCard';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { getActiveInternshipByStudent } from '../../services/internshipService';
import { listLogsByStudent } from '../../services/dailyLogService';
import { listApplicationsByStudent } from '../../services/applicationService';
import { getCompany } from '../../services/companyService';
import { fetchAppUser } from '../../services/userService';
import { calculateProgress } from '../../utils/progressUtils';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { StudentStackParamList } from '../../navigation/types';
import { Internship, DailyLog, InternshipApplication, Company, AppUser } from '../../types';

type Nav = NativeStackNavigationProp<StudentStackParamList>;

const StudentDashboardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [supervisor, setSupervisor] = useState<AppUser | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const [active, apps] = await Promise.all([
        getActiveInternshipByStudent(appUser.uid),
        listApplicationsByStudent(appUser.uid),
      ]);
      setApplications(apps);
      setInternship(active);
      if (active) {
        const [c, sup, l] = await Promise.all([
          getCompany(active.companyId),
          fetchAppUser(active.supervisorId),
          listLogsByStudent(appUser.uid),
        ]);
        setCompany(c);
        setSupervisor(sup);
        setLogs(l);
      } else {
        setCompany(null);
        setSupervisor(null);
        setLogs([]);
      }
    } catch {
      // diamkan, tetap tampilkan layout kosong
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
        <AppHeader title="Dashboard" subtitle={appUser?.name} rightIcon="log-out-outline" onRightPress={logout} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  const approved = logs.filter((l) => l.reviewStatus === 'approved').length;
  const pending = logs.filter((l) => l.reviewStatus === 'pending_review').length;
  const revision = logs.filter((l) => l.reviewStatus === 'needs_revision').length;
  const progress = internship ? calculateProgress(logs, internship.targetDays) : null;
  const latestApp = applications[0];

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Dashboard" subtitle={appUser.name} rightIcon="log-out-outline" onRightPress={logout} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingTitle}>Halo, {appUser.name.split(' ')[0]} 👋</Text>
          <Text style={styles.greetingSub}>NIM {appUser.nim ?? '-'} • {appUser.studyProgram ?? '-'}</Text>
        </View>

        {internship ? (
          <>
            <ProgressCard
              title="Progress Magang"
              subtitle={`Target ${internship.targetDays} hari`}
              progress={progress}
              detail={`${approved} jurnal disetujui dari ${internship.targetDays} hari target`}
            />

            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.cardTitle}>Magang Aktif</Text>
                <StatusBadge status={internship.status} />
              </View>
              <Text style={styles.text}>{company?.name ?? '-'}</Text>
              <Text style={styles.meta}>{company?.industry} • {company?.location}</Text>
              <Text style={styles.meta}>
                {toDateString(internship.startDate)} — {toDateString(internship.endDate)}
              </Text>
              <Text style={styles.meta}>Pembimbing: {supervisor?.name ?? '-'}</Text>
              <Text style={styles.meta}>Topik: {internship.topic}</Text>
              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => navigation.navigate('InternshipDetail', { internshipId: internship.id })}
              >
                <Text style={styles.detailText}>Lihat Detail Magang</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.rowWrap}>
              <StatCard label="Jurnal" value={logs.length} icon="document-text" color={COLORS.primary} />
              <StatCard label="Disetujui" value={approved} icon="checkmark-done" color={COLORS.green} />
            </View>
            <View style={styles.rowWrap}>
              <StatCard label="Menunggu" value={pending} icon="hourglass" color={COLORS.orange} />
              <StatCard label="Perlu Revisi" value={revision} icon="refresh" color={COLORS.red} />
            </View>

            <TouchableOpacity
              style={styles.cta}
              onPress={() => navigation.navigate('DailyLogForm')}
            >
              <Ionicons name="add-circle" size={22} color={COLORS.surface} />
              <Text style={styles.ctaText}>Tambah Jurnal Kegiatan</Text>
            </TouchableOpacity>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Riwayat Jurnal Terbaru</Text>
              {logs.length === 0 ? (
                <EmptyState icon="document-outline" title="Belum ada jurnal" message="Tambahkan jurnal kegiatan pertama." />
              ) : (
                logs.slice(0, 3).map((log) => (
                  <TouchableOpacity
                    key={log.id}
                    style={styles.logCard}
                    onPress={() => navigation.navigate('DailyLogDetail', { logId: log.id })}
                  >
                    <View style={styles.row}>
                      <Text style={styles.logDate}>{toDateString(log.date)}</Text>
                      <StatusBadge status={log.reviewStatus} />
                    </View>
                    <Text style={styles.logType}>{log.activityType}</Text>
                    <Text style={styles.meta} numberOfLines={2}>{log.description}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Status Pengajuan</Text>
              {latestApp ? (
                <>
                  <View style={[styles.row, { marginTop: SPACING.xs }]}>
                    <Text style={styles.text} numberOfLines={1}>{latestApp.topic}</Text>
                    <StatusBadge status={latestApp.status} />
                  </View>
                  <Text style={styles.meta}>Diajukan: {toDateString(latestApp.createdAt)}</Text>
                  {latestApp.decisionNotes ? (
                    <Text style={styles.meta}>Catatan: {latestApp.decisionNotes}</Text>
                  ) : null}
                </>
              ) : (
                <Text style={styles.meta}>Anda belum mengajukan magang.</Text>
              )}
            </View>

            {!latestApp || latestApp.status === 'rejected' ? (
              <TouchableOpacity
                style={styles.cta}
                onPress={() => navigation.navigate('InternshipApplication')}
              >
                <Ionicons name="create-outline" size={22} color={COLORS.surface} />
                <Text style={styles.ctaText}>Ajukan Magang</Text>
              </TouchableOpacity>
            ) : latestApp.status === 'pending' ? (
              <View style={styles.infoBox}>
                <Ionicons name="hourglass-outline" size={18} color={COLORS.orange} />
                <Text style={styles.infoText}>Pengajuan Anda sedang menunggu keputusan admin.</Text>
              </View>
            ) : null}
          </>
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: SPACING.sm },
  text: { fontSize: FONT_SIZE.md, color: COLORS.text, marginTop: 4 },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  rowWrap: { flexDirection: 'row', marginHorizontal: -SPACING.xs },
  cta: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  ctaText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
  section: { marginTop: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm },
  logCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  logDate: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  logType: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginTop: 4 },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  detailText: { color: COLORS.primary, fontWeight: '600', fontSize: FONT_SIZE.sm },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.orange}10`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },
  infoText: { flex: 1, color: COLORS.orange, fontSize: FONT_SIZE.sm },
});

export default StudentDashboardScreen;