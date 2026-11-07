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
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';
import {
  getEvaluationByInternship,
  createEvaluation,
  updateEvaluation,
  finalizeEvaluation,
} from '../../services/evaluationService';
import { calculateFinalScore } from '../../utils/scoreUtils';
import { isValidScore } from '../../utils/validation';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { SupervisorStackParamList } from '../../navigation/types';
import { Evaluation } from '../../types';

type Props = NativeStackScreenProps<SupervisorStackParamList, 'EvaluationForm'>;

const FIELDS: { key: keyof Omit<Evaluation, 'id' | 'internshipId' | 'studentId' | 'supervisorId' | 'finalScore' | 'notes' | 'isFinal' | 'publishedAt' | 'createdAt'>; label: string; weight: string }[] = [
  { key: 'discipline', label: 'Kedisiplinan', weight: '20%' },
  { key: 'responsibility', label: 'Tanggung Jawab', weight: '20%' },
  { key: 'communication', label: 'Komunikasi', weight: '15%' },
  { key: 'teamwork', label: 'Kerja Sama', weight: '15%' },
  { key: 'technicalSkill', label: 'Kompetensi Teknis', weight: '30%' },
];

const EvaluationFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { internshipId, studentId } = route.params;
  const { appUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existing, setExisting] = useState<Evaluation | null>(null);
  const [scores, setScores] = useState<Record<string, string>>({
    discipline: '',
    responsibility: '',
    communication: '',
    teamwork: '',
    technicalSkill: '',
  });
  const [notes, setNotes] = useState('');
  const [confirmFinal, setConfirmFinal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const ev = appUser
          ? await getEvaluationByInternship(internshipId, 'supervisorId', appUser.uid)
          : null;
        if (ev) {
          setExisting(ev);
          setScores({
            discipline: String(ev.discipline),
            responsibility: String(ev.responsibility),
            communication: String(ev.communication),
            teamwork: String(ev.teamwork),
            technicalSkill: String(ev.technicalSkill),
          });
          setNotes(ev.notes ?? '');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [internshipId, appUser]);

  const parsed = (): Record<string, number> | null => {
    const result: Record<string, number> = {};
    for (const f of FIELDS) {
      const raw = scores[f.key as string];
      const num = Number(raw);
      if (!isValidScore(num)) {
        Alert.alert('Validasi', `${f.label} harus berupa angka 0–100.`);
        return null;
      }
      result[f.key] = num;
    }
    return result;
  };

  const previewScore = (): number => {
    const nums: number[] = FIELDS.map((f) => Number(scores[f.key] ?? 0));
    if (nums.some((n) => isNaN(n))) return 0;
    return calculateFinalScore(nums[0], nums[1], nums[2], nums[3], nums[4]);
  };

  const save = async (finalize: boolean) => {
    if (!appUser) return;
    const nums = parsed();
    if (!nums) return;
    setSubmitting(true);
    try {
      if (existing) {
        await updateEvaluation(existing.id, {
          discipline: nums.discipline,
          responsibility: nums.responsibility,
          communication: nums.communication,
          teamwork: nums.teamwork,
          technicalSkill: nums.technicalSkill,
          notes: notes.trim(),
        });
        if (finalize) {
          await finalizeEvaluation(existing.id);
        }
      } else {
        const newId = await createEvaluation({
          internshipId,
          studentId,
          supervisorId: appUser.uid,
          discipline: nums.discipline,
          responsibility: nums.responsibility,
          communication: nums.communication,
          teamwork: nums.teamwork,
          technicalSkill: nums.technicalSkill,
          notes: notes.trim(),
        });
        if (finalize) {
          await finalizeEvaluation(newId);
        }
      }
      setConfirmFinal(false);
      Alert.alert('Berhasil', finalize ? 'Penilaian difinalisasi.' : 'Penilaian disimpan.', [
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
        <AppHeader title="Penilaian" onBack={() => navigation.goBack()} />
        <View style={styles.center}><ActivityIndicator color={COLORS.primary} size="large" /></View>
      </SafeAreaView>
    );
  }

  const isFinal = existing?.isFinal === true;

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title={isFinal ? 'Nilai Final' : 'Isi Penilaian'} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {isFinal ? (
            <View style={styles.infoBox}>
              <Ionicons name="lock-closed" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>Penilaian sudah final dan terkunci.</Text>
            </View>
          ) : null}

          {FIELDS.map((f) => (
            <View key={f.key as string} style={{ marginBottom: SPACING.sm }}>
              <Text style={styles.label}>{f.label} ({f.weight}) *</Text>
              <TextInput
                style={styles.input}
                placeholder="0–100"
                placeholderTextColor={COLORS.disabled}
                value={scores[f.key as string]}
                onChangeText={(t) => setScores((s) => ({ ...s, [f.key]: t }))}
                keyboardType="numeric"
                editable={!submitting && !isFinal}
              />
            </View>
          ))}

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Nilai Akhir (Otomatis)</Text>
            <Text style={styles.previewValue}>{previewScore().toFixed(2)}</Text>
          </View>

          <Text style={styles.label}>Catatan</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
            placeholder="Catatan penilaian (opsional)"
            placeholderTextColor={COLORS.disabled}
            value={notes}
            onChangeText={setNotes}
            multiline
            editable={!submitting && !isFinal}
          />

          {!isFinal && (
            <>
              <TouchableOpacity
                style={[styles.btnSecondary, submitting && { opacity: 0.6 }]}
                onPress={() => save(false)}
                disabled={submitting}
              >
                <Ionicons name="save-outline" size={18} color={COLORS.primary} />
                <Text style={styles.btnSecondaryText}>Simpan Draf</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnPrimary, submitting && { opacity: 0.6 }]}
                onPress={() => setConfirmFinal(true)}
                disabled={submitting}
              >
                <Ionicons name="ribbon" size={18} color={COLORS.surface} />
                <Text style={styles.btnPrimaryText}>Finalisasi</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={confirmFinal}
        title="Finalisasi Penilaian?"
        message="Setelah final, penilaian tidak dapat diubah lagi."
        confirmLabel="Finalisasi"
        confirmColor={COLORS.green}
        loading={submitting}
        onConfirm={() => save(true)}
        onCancel={() => setConfirmFinal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    height: 44,
  },
  previewBox: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  previewLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs },
  previewValue: { color: COLORS.surface, fontSize: 40, fontWeight: '800', marginTop: 4 },
  btnPrimary: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  btnPrimaryText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
  btnSecondary: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  btnSecondaryText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
  infoBox: {
    flexDirection: 'row',
    gap: SPACING.xs,
    backgroundColor: `${COLORS.primary}10`,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
  },
  infoText: { flex: 1, color: COLORS.primary, fontSize: FONT_SIZE.xs },
});

export default EvaluationFormScreen;
