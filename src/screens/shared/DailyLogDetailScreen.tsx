import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../components/AppHeader';
import StatusBadge from '../../components/StatusBadge';
import LoadingView from '../../components/LoadingView';
import ConfirmDialog from '../../components/ConfirmDialog';
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getDailyLog, deleteDailyLog } from '../../services/dailyLogService';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { DailyLog } from '../../types';

interface Props {
  route: { params: { logId: string } };
  navigation: any;
}

const DailyLogDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { logId } = route.params;
  const { appUser } = useAuth();
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      const l = await getDailyLog(logId);
      setLog(l);
    } catch {
      // diamkan
    }
  }, [logId]);

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

  const doDelete = async () => {
    if (!log) return;
    setDeleting(true);
    try {
      await deleteDailyLog(log.id);
      setConfirmDelete(false);
      Alert.alert('Berhasil', 'Jurnal dihapus.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Tidak dapat menghapus');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Jurnal" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!log) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Jurnal" onBack={() => navigation.goBack()} />
        <EmptyState title="Jurnal tidak ditemukan" />
      </SafeAreaView>
    );
  }

  const isOwner = appUser?.uid === log.studentId;
  const canEdit = isOwner && log.reviewStatus !== 'approved';
  const canDelete = canEdit;

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Detail Jurnal" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.date}>{toDateString(log.date)}</Text>
            <StatusBadge status={log.reviewStatus} />
          </View>
          <Text style={styles.type}>{log.activityType}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.text}>{log.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hasil</Text>
          <Text style={styles.text}>{log.result}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kendala</Text>
          <Text style={styles.text}>{log.obstacles}</Text>
        </View>

        {log.photoUrl ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Foto Dokumentasi</Text>
            <Text style={[styles.text, { color: COLORS.accent }]}>{log.photoUrl}</Text>
          </View>
        ) : null}

        {log.supervisorComment ? (
          <View style={[styles.card, { backgroundColor: `${COLORS.primary}08` }]}>
            <Text style={styles.sectionTitle}>Komentar Pembimbing</Text>
            <Text style={styles.text}>{log.supervisorComment}</Text>
            {log.reviewedAt ? (
              <Text style={styles.meta}>Direview: {toDateString(log.reviewedAt)}</Text>
            ) : null}
          </View>
        ) : null}

        {canEdit && (
          <TouchableOpacity
            style={styles.cta}
            onPress={() => navigation.navigate('DailyLogForm', { logId: log.id })}
          >
            <Ionicons name="create-outline" size={18} color={COLORS.surface} />
            <Text style={styles.ctaText}>Edit Jurnal</Text>
          </TouchableOpacity>
        )}

        {canDelete && (
          <TouchableOpacity
            style={styles.ctaDanger}
            onPress={() => setConfirmDelete(true)}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.red} />
            <Text style={styles.ctaDangerText}>Hapus Jurnal</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <ConfirmDialog
        visible={confirmDelete}
        title="Hapus Jurnal?"
        message="Jurnal akan dihapus permanen."
        confirmLabel="Hapus"
        confirmColor={COLORS.red}
        loading={deleting}
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(false)}
      />
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
  date: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.primary },
  type: { fontSize: FONT_SIZE.sm, color: COLORS.text, marginTop: 4 },
  sectionTitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  text: { fontSize: FONT_SIZE.sm, color: COLORS.text, lineHeight: 20 },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4 },
  cta: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  ctaText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
  ctaDanger: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.red}10`,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  ctaDangerText: { color: COLORS.red, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default DailyLogDetailScreen;    