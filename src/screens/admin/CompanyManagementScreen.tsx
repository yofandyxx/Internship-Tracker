import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { listCompanies, deleteCompany } from '../../services/companyService';
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';
import { Company } from '../../types';

type Nav = NativeStackNavigationProp<AdminStackParamList>;

const CompanyManagementScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { logout } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const c = await listCompanies();
      setCompanies(c);
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

  const industries = useMemo(() => {
    const s = new Set<string>();
    companies.forEach((c) => c.industry && s.add(c.industry));
    return Array.from(s);
  }, [companies]);

  const filtered = useMemo(
    () =>
      companies.filter((c) => {
        if (industry && c.industry !== industry) return false;
        if (search.trim()) {
          const s = search.toLowerCase();
          return (
            c.name.toLowerCase().includes(s) ||
            c.location.toLowerCase().includes(s) ||
            c.industry.toLowerCase().includes(s)
          );
        }
        return true;
      }),
    [companies, industry, search]
  );

  const doDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteCompany(confirmDelete.id);
      setConfirmDelete(null);
      await load();
    } catch (e: any) {
      Alert.alert('Gagal menghapus', e?.message ?? 'Perusahaan masih digunakan');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader
        title="Perusahaan"
        rightIcon="add-circle-outline"
        onRightPress={() => navigation.navigate('CompanyForm')}
      />
      {loading ? (
        <LoadingView />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari perusahaan"
                placeholderTextColor={COLORS.disabled}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            {industries.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
                <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
                  <TouchableOpacity
                    onPress={() => setIndustry(null)}
                    style={[styles.filterBtn, !industry && styles.filterBtnActive]}
                  >
                    <Text style={[styles.filterText, !industry && styles.filterTextActive]}>Semua</Text>
                  </TouchableOpacity>
                  {industries.map((ind) => (
                    <TouchableOpacity
                      key={ind}
                      onPress={() => setIndustry(ind)}
                      style={[styles.filterBtn, industry === ind && styles.filterBtnActive]}
                    >
                      <Text style={[styles.filterText, industry === ind && styles.filterTextActive]}>{ind}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            {filtered.length === 0 ? (
              <EmptyState icon="business-outline" title="Belum ada perusahaan" message="Tambahkan perusahaan pertama." />
            ) : (
              filtered.map((c) => (
                <View key={c.id} style={styles.card}>
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{c.name}</Text>
                      <Text style={styles.meta}>{c.industry} • {c.location}</Text>
                      <Text style={styles.meta} numberOfLines={1}>{c.email} • {c.phone}</Text>
                    </View>
                  </View>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => navigation.navigate('CompanyForm', { companyId: c.id })}
                    >
                      <Ionicons name="create-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => setConfirmDelete(c)}
                    >
                      <Ionicons name="trash-outline" size={14} color={COLORS.red} />
                      <Text style={[styles.actionText, { color: COLORS.red }]}>Hapus</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('CompanyForm')}
          >
            <Ionicons name="add" size={26} color={COLORS.surface} />
          </TouchableOpacity>
        </>
      )}

      <ConfirmDialog
        visible={!!confirmDelete}
        title="Hapus Perusahaan?"
        message={`Perusahaan "${confirmDelete?.name ?? ''}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        confirmColor={COLORS.red}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: 100 },
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
  row: { flexDirection: 'row', gap: SPACING.sm },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  actionBtn: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
  },
  actionText: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default CompanyManagementScreen;