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
import { getApplication, reviewApplication } from '../../services/applicationService';
import { listUsersByRole, fetchAppUser } from '../../services/userService';
import { getCompany } from '../../services/companyService';
import { useAuth } from '../../hooks/useAuth';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';
import { InternshipApplication, AppUser, Company } from '../../types';
import { toDateString } from '../../utils/dateUtils';

type Props = NativeStackScreenProps<AdminStackParamList, 'ApplicationReview'>;

const ApplicationReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { applicationId } = route.params;
  const { appUser } = useAuth();

  const [application, setApplication] = useState<InternshipApplication | null>(null);
  const [student, setStudent] = useState<AppUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [supervisors, setSupervisors] = useState<AppUser[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'rejected' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const app = await getApplication(applicationId);
        if (!app) {
          Alert.alert('Tidak ditemukan', 'Pengajuan tidak ditemukan.');
          navigation.goBack();
          return;
        }
        setApplication(app);
        if (app.supervisorId) setSelectedSupervisor(app.supervisorId);

        const [s, c, sups] = await Promise.all([
          fetchAppUser(app.studentId),
          getCompany(app.companyId),
          listUsersByRole('supervisor'),
        ]);
        setStudent(s);
        setCompany(c);
        setSupervisors(sups);
      } catch (e: any) {
        Alert.alert('Gagal memuat', e?.message ?? 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    })();
  }, [applicationId, navigation]);

  const triggerDecision = (d: 'approved' | 'rejected') => {
    if (!application || application.status !== 'pending') return;
    if (d === 'approved' && !selectedSupervisor) {
      Alert.alert('Validasi', 'Pilih pembimbing kampus terlebih dahulu.');
      return;
    }
    setDecision(d);
    setConfirming(true);
  };

  const submitDecision = async () => {
    if (!application || !decision || !appUser) return;
    setSubmitting(true);
    try {
      await reviewApplication(
        application.id,
        decision,
        appUser.uid,
        notes.trim(),
        decision === 'approved' ? selectedSupervisor ?? undefined : undefined
      );
      setConfirming(false);
      Alert.alert(
        'Berhasil',
        decision === 'approved' ? 'Pengajuan disetujui.' : 'Pengajuan ditolak.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Detail Pengajuan" onBack={() => navigation.goBack()} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (!application) return null;

  const isPending = application.status === 'pending';

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Detail Pengajuan" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>{application.topic}</Text>
              <StatusBadge status={application.status} />
            </View>
            <Text style={styles.meta}>Diajukan: {toDateString(application.createdAt)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Mahasiswa</Text>
            <Text style={styles.text}>{student?.name ?? '-'}</Text>
            <Text style={styles.meta}>NIM: {student?.nim ?? '-'} • {student?.studyProgram ?? '-'}</Text>
            <Text style={styles.meta}>Email: {student?.email ?? '-'}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Perusahaan</Text>
            <Text style={styles.text}>{company?.name ?? '-'}</Text>
            <Text style={styles.meta}>{company?.industry} • {company?.location}</Text>
            <Text style={styles.meta}>Kontak: {company?.contactPerson} ({company?.phone})</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Periode</Text>
            <Text style={styles.text}>{toDateString(application.startDate)} — {toDateString(application.endDate)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Deskripsi Rencana</Text>
            <Text style={styles.text}>{application.description}</Text>
            {application.proposalUrl ? (
              <Text style={[styles.meta, { color: COLORS.accent }]} numberOfLines={2}>
                Proposal: {application.proposalUrl}
              </Text>
            ) : null}
          </View>

          {application.status !== 'pending' && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Keputusan</Text>
              <Text style={styles.text}>
                {application.status === 'approved' ? 'Disetujui' : 'Ditolak'}
              </Text>
              {application.decisionNotes ? (
                <Text style={styles.meta}>Catatan: {application.decisionNotes}</Text>
              ) : null}
              {application.decidedAt ? (
                <Text style={styles.meta}>Tanggal: {toDateString(application.decidedAt)}</Text>
              ) : null}
            </View>
          )}

          {isPending && (
            <>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Pembimbing Kampus</Text>
                {supervisors.length === 0 ? (
                  <Text style={styles.meta}>Belum ada pembimbing terdaftar.</Text>
                ) : (
                  supervisors.map((s) => {
                    const active = selectedSupervisor === s.uid;
                    return (
                      <TouchableOpacity
                        key={s.uid}
                        style={[styles.supervisorRow, active && styles.supervisorRowActive]}
                        onPress={() => setSelectedSupervisor(s.uid)}
                      >
                        <Ionicons
                          name={active ? 'radio-button-on' : 'radio-button-off'}
                          size={18}
                          color={active ? COLORS.primary : COLORS.textSecondary}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.text}>{s.name}</Text>
                          <Text style={styles.meta}>{s.studyProgram ?? '-'} • {s.email}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Catatan Keputusan</Text>
                <TextInput
                  style={styles.textarea}
                  placeholder="Catatan untuk mahasiswa (opsional)"
                  placeholderTextColor={COLORS.disabled}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  editable={!submitting}
                />
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: COLORS.red }]}
                  onPress={() => triggerDecision('rejected')}
                  disabled={submitting}
                >
                  <Ionicons name="close-circle" size={18} color={COLORS.surface} />
                  <Text style={styles.btnText}>Tolak</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: COLORS.green }]}
                  onPress={() => triggerDecision('approved')}
                  disabled={submitting}
                >
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.surface} />
                  <Text style={styles.btnText}>Setujui</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={confirming}
        title={decision === 'approved' ? 'Setujui Pengajuan?' : 'Tolak Pengajuan?'}
        message={
          decision === 'approved'
            ? 'Pengajuan akan disetujui dan data magang aktif akan dibuat.'
            : 'Pengajuan akan ditolak dan disimpan sebagai riwayat.'
        }
        confirmLabel={decision === 'approved' ? 'Setujui' : 'Tolak'}
        confirmColor={decision === 'approved' ? COLORS.green : COLORS.red}
        loading={submitting}
        onConfirm={submitDecision}
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
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.sm },
  title: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text },
  sectionTitle: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, fontWeight: '700', marginBottom: 4, textTransform: 'uppercase' },
  text: { fontSize: FONT_SIZE.md, color: COLORS.text },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  supervisorRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  supervisorRowActive: { borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}08` },
  textarea: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    minHeight: 80,
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

export default ApplicationReviewScreen;