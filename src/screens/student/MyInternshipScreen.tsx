import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import ProgressCard from '../../components/ProgressCard';
import { useAuth } from '../../hooks/useAuth';
import { getActiveInternshipByStudent } from '../../services/internshipService';
import { listLogsByStudent } from '../../services/dailyLogService';
import { getCompany } from '../../services/companyService';
import { fetchAppUser } from '../../services/userService';
import { calculateProgress } from '../../utils/progressUtils';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { StudentStackParamList } from '../../navigation/types';
import { Internship, DailyLog, Company, AppUser } from '../../types';

type Nav = NativeStackNavigationProp<StudentStackParamList>;

const MyInternshipScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [internship, setInternship] = useState<Internship | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [supervisor, setSupervisor] = useState<AppUser | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const active = await getActiveInternshipByStudent(appUser.uid);
      setInternship(active);
      if (active) {
        const [c, s, l] = await Promise.all([
          getCompany(active.companyId),
          fetchAppUser(active.supervisorId),
          listLogsByStudent(appUser.uid),
        ]);
        setCompany(c);
        setSupervisor(s);
        setLogs(l);
      } else {
        setCompany(null);
        setSupervisor(null);
        setLogs([]);
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
        <AppHeader title="Magang Saya" />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!internship) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Magang Saya" />
        <EmptyState
          icon="briefcase-outline"
          title="Belum ada magang aktif"
          message="Ajukan magang lalu tunggu persetujuan admin."
        />
      </SafeAreaView>
    );
  }

  const progress = calculateProgress(logs, internship.targetDays);

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Magang Saya" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ProgressCard
          title="Progress"
          subtitle={`Target ${internship.targetDays} hari`}
          progress={progress}
          detail={`${logs.filter((l) => l.reviewStatus === 'approved').length} dari ${internship.targetDays} hari disetujui`}
        />

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.title}>{company?.name ?? '-'}</Text>
            <StatusBadge status={internship.status} />
          </View>
          <Text style={styles.meta}>{company?.industry} • {company?.location}</Text>
          <Text style={styles.meta}>{company?.address}</Text>
          <Text style={styles.meta}>Kontak: {company?.contactPerson} ({company?.phone})</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Periode</Text>
          <Text style={styles.text}>{toDateString(internship.startDate)} — {toDateString(internship.endDate)}</Text>
          <Text style={[styles.sectionTitle, { marginTop: SPACING.sm }]}>Topik</Text>
          <Text style={styles.text}>{internship.topic}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pembimbing Kampus</Text>
          <Text style={styles.text}>{supervisor?.name ?? '-'}</Text>
          <Text style={styles.meta}>{supervisor?.studyProgram ?? '-'} • {supervisor?.email ?? '-'}</Text>
        </View>

        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => navigation.navigate('InternshipDetail', { internshipId: internship.id })}
        >
          <Text style={styles.detailText}>Lihat Detail Lengkap</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
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
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  detailText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.sm },
});

export default MyInternshipScreen;