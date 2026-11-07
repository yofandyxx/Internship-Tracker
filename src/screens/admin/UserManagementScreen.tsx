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
import { useFocusEffect } from '@react-navigation/native';
import { listAllUsers, adminUpdateUser } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AppUser, UserRole } from '../../types';

type Filter = 'all' | UserRole;

const UserManagementScreen: React.FC = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const u = await listAllUsers();
      setUsers(u);
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
    return users.filter((u) => {
      if (filter !== 'all' && u.role !== filter) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        return (
          (u.name ?? '').toLowerCase().includes(s) ||
          (u.email ?? '').toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [users, filter, search]);

  const changeRole = (user: AppUser) => {
    Alert.alert(
      'Ubah Role',
      `Ubah role ${user.name} menjadi:`,
      [
        { text: 'Mahasiswa', onPress: () => applyRole(user.uid, 'student') },
        { text: 'Pembimbing', onPress: () => applyRole(user.uid, 'supervisor') },
        { text: 'Admin', onPress: () => applyRole(user.uid, 'admin') },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const applyRole = async (uid: string, role: UserRole) => {
    try {
      await adminUpdateUser(uid, { role });
      await load();
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Perubahan ditolak');
    }
  };

  const toggleStatus = async (user: AppUser) => {
    const next = user.status === 'active' ? 'inactive' : 'active';
    try {
      await adminUpdateUser(user.uid, { status: next });
      await load();
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Perubahan ditolak');
    }
  };

  const renderFilterBtn = (key: Filter, label: string) => {
    const active = filter === key;
    return (
      <TouchableOpacity
        key={key}
        onPress={() => setFilter(key)}
        style={[styles.filterBtn, active && styles.filterBtnActive]}
      >
        <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const roleLabel = (r: UserRole) =>
    r === 'admin' ? 'Admin' : r === 'student' ? 'Mahasiswa' : 'Pembimbing';

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Kelola Pengguna" rightIcon="log-out-outline" onRightPress={logout} />
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
              placeholder="Cari nama atau email"
              placeholderTextColor={COLORS.disabled}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
            <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
              {renderFilterBtn('all', 'Semua')}
              {renderFilterBtn('student', 'Mahasiswa')}
              {renderFilterBtn('supervisor', 'Pembimbing')}
              {renderFilterBtn('admin', 'Admin')}
            </View>
          </ScrollView>

          {filtered.length === 0 ? (
            <EmptyState icon="people-outline" title="Tidak ada pengguna" />
          ) : (
            filtered.map((u) => (
              <View key={u.uid} style={styles.card}>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{u.name}</Text>
                    <Text style={styles.meta}>{u.email}</Text>
                    <Text style={styles.meta}>{roleLabel(u.role)} • {u.studyProgram ?? '-'}</Text>
                  </View>
                  <StatusBadge
                    status={u.status === 'active' ? 'approved' : 'rejected'}
                    label={u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  />
                </View>
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => changeRole(u)}>
                    <Ionicons name="swap-horizontal-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.actionText}>Ubah Role</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => toggleStatus(u)}>
                    <Ionicons
                      name={u.status === 'active' ? 'close-circle-outline' : 'checkmark-circle-outline'}
                      size={14}
                      color={u.status === 'active' ? COLORS.red : COLORS.green}
                    />
                    <Text style={[styles.actionText, { color: u.status === 'active' ? COLORS.red : COLORS.green }]}>
                      {u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </Text>
                  </TouchableOpacity>
                </View>
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
  row: { flexDirection: 'row', gap: SPACING.sm, alignItems: 'flex-start' },
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
});

export default UserManagementScreen;