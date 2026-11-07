import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { listAllApplications } from '../../services/applicationService';
import { listAllUsers } from '../../services/userService';
import { listCompanies } from '../../services/companyService';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';
import { InternshipApplication, AppUser, Company } from '../../types';
import { toDateString } from '../../utils/dateUtils';
import { useAuth } from '../../hooks/useAuth';

type Nav = NativeStackNavigationProp<AdminStackParamList>;
type Filter = 'all' | 'pending' | 'approved' | 'rejected';

const ApplicationManagementScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { logout } = useAuth();

  const [apps, setApps] = useState<InternshipApplication[]>([]);
  const [students, setStudents] = useState<Record<string, AppUser>>({});
  const [companies, setCompanies] = useState<Record<string, Company>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const [applications, users, comps] = await Promise.all([
        listAllApplications(),
        listAllUsers(),
        listCompanies(),
      ]);
      setApps(applications);
      const sMap: Record<string, AppUser> = {};
      users.forEach((u) => {
        sMap[u.uid] = u;
      });
      setStudents(sMap);
      const cMap: Record<string, Company> = {};
      comps.forEach((c) => {
        cMap[c.id] = c;
      });
      setCompanies(cMap);
    } catch (e: any) {
      Alert.alert('Gagal memuat', e?.message ?? 'Terjadi kesalahan');
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

  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (filter !== 'all' && a.status !== filter) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        const student = students[a.studentId];
        const company = companies[a.companyId];
        return (
          (student?.name ?? '').toLowerCase().includes(s) ||
          (company?.name ?? '').toLowerCase().includes(s) ||
          (a.topic ?? '').toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [apps, filter, search, students, companies]);

  const renderFilterBtn = (key: Filter, label: string) => (
    <TouchableOpacity
      onPress={() => setFilter(key)}
      style={[styles.filterBtn, filter === key && styles.filterBtnActive]}
    >
      <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Pengajuan Magang" rightIcon="log-out-outline" onRightPress={logout} />
      {loading ? (
        <LoadingView />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.searchRow}>
            <Ionicons name="search" size={18} color={COLORS.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari mahasiswa / perusahaan / topik"
              placeholderTextColor={COLORS.disabled}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
            <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
              {renderFilterBtn('all', 'Semua')}
              {renderFilterBtn('pending', 'Menunggu')}
              {renderFilterBtn('approved', 'Disetujui')}
              {renderFilterBtn('rejected', 'Ditolak')}
            </View>
          </ScrollView>

          {filtered.length === 0 ? (
            <EmptyState icon="document-text-outline" title="Tidak ada pengajuan" />
          ) : (
            filtered.map((a) => {
              const student = students[a.studentId];
              const company = companies[a.companyId];
              return (
                <TouchableOpacity
                  key={a.id}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('ApplicationReview', { applicationId: a.id })
                  }
                >
                  <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>{a.topic}</Text>
                    <StatusBadge status={a.status} />
                  </View>
                  <Text style={styles.meta}>{student?.name ?? a.studentId} ({student?.nim ?? '-'})</Text>
                  <Text style={styles.meta}>{company?.name ?? a.companyId}</Text>
                  <Text style={styles.meta}>
                    {toDateString(a.startDate)} — {toDateString(a.endDate)}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    height: 42,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.sm },
  filterBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  filterTextActive: { color: COLORS.surface },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  name: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
});

export default ApplicationManagementScreen;