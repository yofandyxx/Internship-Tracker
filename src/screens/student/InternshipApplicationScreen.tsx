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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppHeader from '../../components/AppHeader';
import { useAuth } from '../../hooks/useAuth';
import { listCompanies } from '../../services/companyService';
import { createApplication, listApplicationsByStudent } from '../../services/applicationService';
import { getActiveInternshipByStudent } from '../../services/internshipService';
import { isNonEmpty } from '../../utils/validation';
import { toDateString } from '../../utils/dateUtils';
import { Timestamp } from 'firebase/firestore';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { StudentStackParamList } from '../../navigation/types';
import { Company, InternshipApplication } from '../../types';

type Nav = NativeStackNavigationProp<StudentStackParamList>;

const InternshipApplicationScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { appUser } = useAuth();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [existingApps, setExistingApps] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [companyId, setCompanyId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 3600 * 1000));
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [proposalUrl, setProposalUrl] = useState('');

  const [showCompanyPicker, setShowCompanyPicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!appUser) return;
      try {
        const [c, apps, active] = await Promise.all([
          listCompanies(),
          listApplicationsByStudent(appUser.uid),
          getActiveInternshipByStudent(appUser.uid),
        ]);
        if (active) {
          Alert.alert('Info', 'Anda sedang menjalani magang aktif.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }
        const pending = apps.find((a) => a.status === 'pending');
        if (pending) {
          Alert.alert('Info', 'Anda masih memiliki pengajuan yang menunggu keputusan.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
          return;
        }
        setCompanies(c);
        setExistingApps(apps);
      } finally {
        setLoading(false);
      }
    })();
  }, [appUser, navigation]);

  const validate = (): string | null => {
    if (!companyId) return 'Pilih perusahaan tujuan.';
    if (endDate < startDate) return 'Tanggal selesai tidak boleh sebelum tanggal mulai.';
    if (!isNonEmpty(topic)) return 'Judul/topik magang wajib diisi.';
    if (!isNonEmpty(description)) return 'Deskripsi rencana wajib diisi.';
    return null;
  };

  const onSubmit = async () => {
    if (!appUser) return;
    const err = validate();
    if (err) {
      Alert.alert('Validasi', err);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      await createApplication({
        studentId: appUser.uid,
        companyId: companyId!,
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        topic: topic.trim(),
        description: description.trim(),
        ...(proposalUrl.trim() ? { proposalUrl: proposalUrl.trim() } : {}),
      });
      Alert.alert('Berhasil', 'Pengajuan magang telah dikirim.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCompany = companies.find((c) => c.id === companyId);

  if (loading) {
    return (
      <SafeAreaView style={styles.flex} edges={['bottom']}>
        <AppHeader title="Ajukan Magang" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Ajukan Magang" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Perusahaan Tujuan *</Text>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowCompanyPicker(true)}
          >
            <Text style={[styles.selectorText, !selectedCompany && { color: COLORS.disabled }]}>
              {selectedCompany?.name ?? 'Pilih perusahaan'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Tanggal Mulai *</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setShowStartPicker(true)}>
            <Text style={styles.selectorText}>{toDateString(Timestamp.fromDate(startDate))}</Text>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Tanggal Selesai *</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setShowEndPicker(true)}>
            <Text style={styles.selectorText}>{toDateString(Timestamp.fromDate(endDate))}</Text>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Judul / Topik Magang *</Text>
          <TextInput
            style={styles.input}
            placeholder="Pengembangan Sistem Informasi..."
            placeholderTextColor={COLORS.disabled}
            value={topic}
            onChangeText={setTopic}
            editable={!submitting}
          />

          <Text style={styles.label}>Deskripsi Rencana Kegiatan *</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Uraikan rencana kegiatan..."
            placeholderTextColor={COLORS.disabled}
            value={description}
            onChangeText={setDescription}
            multiline
            editable={!submitting}
          />

          <Text style={styles.label}>URL Proposal (Opsional)</Text>
          <TextInput
            style={styles.input}
            placeholder="https://..."
            placeholderTextColor={COLORS.disabled}
            value={proposalUrl}
            onChangeText={setProposalUrl}
            autoCapitalize="none"
            editable={!submitting}
          />

          <TouchableOpacity
            style={[styles.submit, submitting && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <>
                <Ionicons name="send" size={18} color={COLORS.surface} />
                <Text style={styles.submitText}>Kirim Pengajuan</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showCompanyPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCompanyPicker(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Pilih Perusahaan</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {companies.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.companyRow}
                  onPress={() => {
                    setCompanyId(c.id);
                    setShowCompanyPicker(false);
                  }}
                >
                  <Text style={styles.companyName}>{c.name}</Text>
                  <Text style={styles.companyMeta}>{c.industry} • {c.location}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowCompanyPicker(false)}
            >
              <Text style={styles.modalCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowStartPicker(false);
            if (d) setStartDate(d);
          }}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(_, d) => {
            setShowEndPicker(false);
            if (d) setEndDate(d);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  label: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text, marginTop: SPACING.sm, marginBottom: SPACING.xs },
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
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 44,
  },
  selectorText: { fontSize: FONT_SIZE.md, color: COLORS.text },
  submit: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  submitText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.md },
  companyRow: {
    padding: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  companyName: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  companyMeta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
  modalClose: { alignItems: 'center', padding: SPACING.md },
  modalCloseText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default InternshipApplicationScreen;
