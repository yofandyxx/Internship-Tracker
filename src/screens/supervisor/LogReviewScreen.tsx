import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingView from '../../components/LoadingView';
import { getDailyLog, reviewDailyLog } from '../../services/dailyLogService';
import { useAuth } from '../../hooks/useAuth';
import { toDateString } from '../../utils/dateUtils';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { SupervisorStackParamList } from '../../navigation/types';
import { DailyLog } from '../../types';

type Props = NativeStackScreenProps<SupervisorStackParamList, 'LogReview'>;

const LogReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { logId } = route.params;
  const { appUser } = useAuth();
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirming, setConfirming] = useState<false | 'approved' | 'needs_revision'>(false);

  useEffect(() => {
    (async () => {
      try {
        const l = await getDailyLog(logId);
        if (!l) {
          Alert.alert('Tidak ditemukan', 'Jurnal tidak ditemukan');
          navigation.goBack();
          return;
        }
        setLog(l);
        setComment(l.supervisorComment ?? '');
      } finally {
        setLoading(false);
      }
    })();
  }, [logId, navigation]);

  const submit = async () => {
    if (!log || !appUser || !confirming) return;
    setSubmitting(true);
    try {
      await reviewDailyLog(log.id, confirming, appUser.uid, comment.trim());
      setConfirming(false);
      Alert.alert('Berhasil', 'Review tersimpan.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Review Jurnal" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!log) return null;

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Review Jurnal" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
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
              <Text style={[styles.text, { color: COLORS.accent }]} numberOfLines={2}>{log.photoUrl}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Komentar Pembimbing</Text>
            <TextInput
              style={styles.textarea}
              placeholder="Tulis komentar atau catatan revisi..."
              placeholderTextColor={COLORS.disabled}
              value={comment}
              onChangeText={setComment}
              multiline
              editable={!submitting}
            />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: COLORS.orange }]}
              onPress={() => setConfirming('needs_revision')}
              disabled={submitting || log.reviewStatus === 'approved'}
            >
              <Ionicons name="refresh" size={18} color={COLORS.surface} />
              <Text style={styles.btnText}>Perlu Revisi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: COLORS.green }]}
              onPress={() => setConfirming('approved')}
              disabled={submitting}
            >
              <Ionicons name="checkmark-circle" size={18} color={COLORS.surface} />
              <Text style={styles.btnText}>Setujui</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={confirming !== false}
        title={confirming === 'approved' ? 'Setujui Jurnal?' : 'Minta Revisi?'}
        message={
          confirming === 'approved'
            ? 'Jurnal akan dikunci dan dianggap final.'
            : 'Mahasiswa akan diminta memperbaiki jurnal.'
        }
        confirmLabel={confirming === 'approved' ? 'Setujui' : 'Minta Revisi'}
        confirmColor={confirming === 'approved' ? COLORS.green : COLORS.orange}
        loading={submitting}
        onConfirm={submit}
        onCancel={() => setConfirming(false)}
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
  textarea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    minHeight: 100,
    textAlignVertical: 'top',
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
  },
  actionRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  btn: {
    flex: 1,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  btnText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default LogReviewScreen;