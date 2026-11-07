import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { listCompanies } from '../../services/companyService';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { Company } from '../../types';

const CompanyListScreen: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const c = await listCompanies();
      setCompanies(c);
    } catch {
      // diamkan
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

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Daftar Perusahaan" />
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
            <EmptyState icon="business-outline" title="Belum ada perusahaan" />
          ) : (
            filtered.map((c) => (
              <View key={c.id} style={styles.card}>
                <Text style={styles.name}>{c.name}</Text>
                <Text style={styles.meta}>{c.industry} • {c.location}</Text>
                <Text style={styles.meta} numberOfLines={1}>{c.address}</Text>
                <Text style={styles.meta}>Kontak: {c.contactPerson} • {c.phone}</Text>
                {c.description ? (
                  <Text style={styles.desc} numberOfLines={2}>{c.description}</Text>
                ) : null}
              </View>
            ))
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
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  desc: { fontSize: FONT_SIZE.xs, color: COLORS.text, marginTop: SPACING.xs, fontStyle: 'italic' },
});

export default CompanyListScreen;