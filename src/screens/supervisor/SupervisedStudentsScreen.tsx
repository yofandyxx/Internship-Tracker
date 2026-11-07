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
import EmptyState from '../../components/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { listInternshipsBySupervisor } from '../../services/internshipService';
import { fetchAppUser } from '../../services/userService';
import { listLogsByInternship } from '../../services/dailyLogService';
import { calculateProgress } from '../../utils/progressUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { SupervisorStackParamList } from '../../navigation/types';
import { AppUser, Internship } from '../../types';

type Nav = NativeStackNavigationProp<SupervisorStackParamList>;

interface Row {
  internship: Internship;
  student: AppUser | null;
  progress: number | null;
  pendingCount: number;
  revisionCount: number;
}

const SupervisedStudentsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    if (!appUser) return;
    try {
      const ints = await listInternshipsBySupervisor(appUser.uid);
      const result: Row[] = [];
      for (const i of ints) {
        const [student, logs] = await Promise.all([
          fetchAppUser(i.studentId),
          listLogsByInternship(i.id),
        ]);
        result.push({
          internship: i,
          student,
          progress: calculateProgress(logs, i.targetDays),
          pendingCount: logs.filter((l) => l.reviewStatus === 'pending_review').length,
          revisionCount: logs.filter((l) => l.reviewStatus === 'needs_revision').length,
        });
      }
      setRows(result);
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

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Mahasiswa Bimbingan" />
      {loading ? (
        <LoadingView />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {rows.length === 0 ? (
            <EmptyState icon="people-outline" title="Belum ada mahasiswa" />
          ) : (
            rows.map((r) => (
              <TouchableOpacity
                key={r.internship.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('InternshipDetail', { internshipId: r.internship.id })
                }
              >
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{r.student?.name ?? '-'}</Text>
                    <Text style={styles.meta}>{r.student?.nim ?? '-'} • {r.student?.studyProgram ?? '-'}</Text>
                    <Text style={styles.meta}>{r.internship.topic}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{r.progress === null ? '—' : `${r.progress.toFixed(0)}%`}</Text>
                    <Text style={styles.statLabel}>Progress</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: COLORS.orange }]}>{r.pendingCount}</Text>
                    <Text style={styles.statLabel}>Menunggu</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={[styles.statValue, { color: COLORS.red }]}>{r.revisionCount}</Text>
                    <Text style={styles.statLabel}>Revisi</Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() =>
                      navigation.navigate('InternshipDetail', { internshipId: r.internship.id })
                    }
                  >
                    <Ionicons name="document-text-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.actionText}>Review Jurnal</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() =>
                      navigation.navigate('EvaluationForm', {
                        internshipId: r.internship.id,
                        studentId: r.internship.studentId,
                      })
                    }
                  >
                    <Ionicons name="ribbon-outline" size={14} color={COLORS.green} />
                    <Text style={[styles.actionText, { color: COLORS.green }]}>Beri Nilai</Text>
                  </TouchableOpacity>
                </View>
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
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  name: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.sm,
  },
  actionText: { fontSize: FONT_SIZE.xs, color: COLORS.primary, fontWeight: '600' },
});

export default SupervisedStudentsScreen;