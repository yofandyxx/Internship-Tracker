import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import StatusBadge from '../../components/StatusBadge';
import ProgressCard from '../../components/ProgressCard';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getInternship } from '../../services/internshipService';
import { getCompany } from '../../services/companyService';
import { fetchAppUser } from '../../services/userService';
import { listLogsByInternship } from '../../services/dailyLogService';
import { calculateProgress } from '../../utils/progressUtils';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { Internship, DailyLog, Company, AppUser } from '../../types';

interface Props {
  route: { params: { internshipId: string } };
  navigation: any;
}

const InternshipDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { internshipId } = route.params;
  const { appUser } = useAuth();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [student, setStudent] = useState<AppUser | null>(null);
  const [supervisor, setSupervisor] = useState<AppUser | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const int = await getInternship(internshipId);
      if (!int) return;
      setInternship(int);
      const [c, s, sup, l] = await Promise.all([
        getCompany(int.companyId),
        fetchAppUser(int.studentId),
        fetchAppUser(int.supervisorId),
        listLogsByInternship(int.id),
      ]);
      setCompany(c);
      setStudent(s);
      setSupervisor(sup);
      setLogs(l);
    } catch {
      // diamkan
    }
  }, [internshipId]);

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
        <AppHeader title="Detail Magang" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!internship) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Magang" onBack={() => navigation.goBack()} />
        <EmptyState title="Data magang tidak ditemukan" />
      </SafeAreaView>
    );
  }

  const progress = calculateProgress(logs, internship.targetDays);
  const approved = logs.filter((l) => l.reviewStatus === 'approved').length;
  const pending = logs.filter((l) => l.reviewStatus === 'pending_review').length;
  const revision = logs.filter((l) => l.reviewStatus === 'needs_revision').length;
  const isSupervisor = appUser?.role === 'supervisor';

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Detail Magang" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ProgressCard
          title="Progress"
          subtitle={`Target ${internship.targetDays} hari`}
          progress={progress}
          detail={`${approved} disetujui • ${pending} menunggu • ${revision} revisi`}
        />

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{company?.name ?? '-'}</Text>
            <StatusBadge status={internship.status} />
          </View>
          <Text style={styles.meta}>{company?.industry} • {company?.location}</Text>
          <Text style={styles.meta}>{company?.address}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mahasiswa</Text>
          <Text style={styles.text}>{student?.name ?? '-'}</Text>
          <Text style={styles.meta}>{student?.nim ?? '-'} • {student?.studyProgram ?? '-'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pembimbing</Text>
          <Text style={styles.text}>{supervisor?.name ?? '-'}</Text>
          <Text style={styles.meta}>{supervisor?.email ?? '-'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Periode</Text>
          <Text style={styles.text}>
            {toDateString(internship.startDate)} — {toDateString(internship.endDate)}
          </Text>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.sm }]}>Topik</Text>
          <Text style={styles.text}>{internship.topic}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Jurnal Kegiatan</Text>
          {logs.length === 0 ? (
            <Text style={styles.meta}>Belum ada jurnal.</Text>
          ) : (
            logs.slice(0, 10).map((log) => (
              <TouchableOpacity
                key={log.id}
                style={styles.logRow}
                onPress={() =>
                  isSupervisor
                    ? navigation.navigate('LogReview', { logId: log.id })
                    : navigation.navigate('DailyLogDetail', { logId: log.id })
                }
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.logDate}>{toDateString(log.date)}</Text>
                  <Text style={styles.meta} numberOfLines={1}>{log.activityType}</Text>
                </View>
                <StatusBadge status={log.reviewStatus} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {isSupervisor && appUser ? (
          <TouchableOpacity
            style={styles.cta}
            onPress={() =>
              navigation.navigate('EvaluationForm', {
                internshipId: internship.id,
                studentId: internship.studentId,
              })
            }
          >
            <Ionicons name="ribbon" size={20} color={COLORS.surface} />
            <Text style={styles.ctaText}>Beri / Lihat Penilaian</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  title: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  text: { fontSize: FONT_SIZE.md, color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  logDate: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  cta: {
    flexDirection: 'row',
    backgroundColor: COLORS.green,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  ctaText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default InternshipDetailScreen;