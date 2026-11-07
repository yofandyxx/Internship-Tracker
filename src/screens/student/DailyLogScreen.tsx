import React, { useCallback, useMemo, useState } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import LoadingView from '../../components/LoadingView';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { listLogsByStudent } from '../../services/dailyLogService';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { StudentStackParamList } from '../../navigation/types';
import { DailyLog, ReviewStatus, ActivityType } from '../../types';

type Nav = NativeStackNavigationProp<StudentStackParamList>;
type ReviewFilter = 'all' | ReviewStatus;
type ActivityFilter = 'all' | ActivityType;

const ACTIVITY_TYPES: ActivityType[] = [
  'Pengembangan Aplikasi',
  'Analisis Sistem',
  'Instalasi dan Konfigurasi',
  'Administrasi',
  'Pengujian Sistem',
  'Kegiatan Lainnya',
];

const DailyLogScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser } = useAuth();

  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('all');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const l = await listLogsByStudent(appUser.uid);
      setLogs(l);
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

  const filtered = useMemo(
    () =>
      logs.filter((l) => {
        if (reviewFilter !== 'all' && l.reviewStatus !== reviewFilter) return false;
        if (activityFilter !== 'all' && l.activityType !== activityFilter) return false;
        return true;
      }),
    [logs, reviewFilter, activityFilter]
  );

  const Chip = ({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader
        title="Jurnal Harian"
        rightIcon="add-circle-outline"
        onRightPress={() => navigation.navigate('DailyLogForm')}
      />
      {loading ? (
        <LoadingView />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.filterLabel}>Status Review</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.sm }}>
            <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
              <Chip active={reviewFilter === 'all'} label="Semua" onPress={() => setReviewFilter('all')} />
              <Chip active={reviewFilter === 'pending_review'} label="Menunggu" onPress={() => setReviewFilter('pending_review')} />
              <Chip active={reviewFilter === 'approved'} label="Disetujui" onPress={() => setReviewFilter('approved')} />
              <Chip active={reviewFilter === 'needs_revision'} label="Perlu Revisi" onPress={() => setReviewFilter('needs_revision')} />
            </View>
          </ScrollView>

          <Text style={styles.filterLabel}>Jenis Kegiatan</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.md }}>
            <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
              <Chip active={activityFilter === 'all'} label="Semua" onPress={() => setActivityFilter('all')} />
              {ACTIVITY_TYPES.map((a) => (
                <Chip
                  key={a}
                  active={activityFilter === a}
                  label={a}
                  onPress={() => setActivityFilter(a)}
                />
              ))}
            </View>
          </ScrollView>

          {filtered.length === 0 ? (
            <EmptyState
              icon="document-outline"
              title="Belum ada jurnal"
              message="Tekan tombol + untuk menambah jurnal."
            />
          ) : (
            filtered.map((log) => (
              <TouchableOpacity
                key={log.id}
                style={styles.card}
                onPress={() => navigation.navigate('DailyLogDetail', { logId: log.id })}
              >
                <View style={styles.row}>
                  <Text style={styles.date}>{toDateString(log.date)}</Text>
                  <StatusBadge status={log.reviewStatus} />
                </View>
                <Text style={styles.type}>{log.activityType}</Text>
                <Text style={styles.desc} numberOfLines={2}>{log.description}</Text>
                {log.supervisorComment ? (
                  <View style={styles.comment}>
                    <Ionicons name="chatbubble-outline" size={12} color={COLORS.primary} />
                    <Text style={styles.commentText} numberOfLines={2}>{log.supervisorComment}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
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
  filterLabel: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.xs },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '600' },
  chipTextActive: { color: COLORS.surface },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  date: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
  type: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginTop: 4 },
  desc: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 4 },
  comment: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingTop: SPACING.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  commentText: { flex: 1, fontSize: FONT_SIZE.xs, color: COLORS.primary, fontStyle: 'italic' },
});

export default DailyLogScreen;