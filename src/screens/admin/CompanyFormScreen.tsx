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
import { getCompany, createCompany, updateCompany, isCompanyNameTaken } from '../../services/companyService';
import { isValidEmail, isNonEmpty } from '../../utils/validation';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { AdminStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AdminStackParamList, 'CompanyForm'>;

const CompanyFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const companyId = route.params?.companyId;
  const isEdit = !!companyId;
  const goBackToCompanies = () => {
    // CompanyForm dapat dibuka dari nested tab navigator. Saat screen ini
    // menjadi root (mis. deep link/hot reload), goBack tidak punya target.
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('AdminTabs');
    }
  };

  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!companyId) return;
    (async () => {
      try {
        const c = await getCompany(companyId);
        if (c) {
          setName(c.name);
          setIndustry(c.industry);
          setLocation(c.location);
          setAddress(c.address);
          setContactPerson(c.contactPerson);
          setPhone(c.phone);
          setEmail(c.email);
          setDescription(c.description ?? '');
        }
      } catch (e: any) {
        Alert.alert('Gagal', e?.message ?? 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const validate = (): string | null => {
    if (!isNonEmpty(name)) return 'Nama perusahaan wajib diisi.';
    if (!isNonEmpty(industry)) return 'Bidang industri wajib diisi.';
    if (!isNonEmpty(location)) return 'Lokasi wajib diisi.';
    if (!isNonEmpty(address)) return 'Alamat wajib diisi.';
    if (!isNonEmpty(contactPerson)) return 'Kontak pembimbing industri wajib diisi.';
    if (!isNonEmpty(phone)) return 'Nomor telepon wajib diisi.';
    if (!isValidEmail(email)) return 'Email perusahaan tidak valid.';
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      Alert.alert('Validasi', err);
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      const taken = await isCompanyNameTaken(name, companyId);
      if (taken) {
        Alert.alert('Duplikat', 'Nama perusahaan sudah terdaftar.');
        return;
      }
      const payload = {
        name: name.trim(),
        industry: industry.trim(),
        location: location.trim(),
        address: address.trim(),
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        description: description.trim() || undefined,
      };
      if (isEdit && companyId) {
        await updateCompany(companyId, payload);
      } else {
        await createCompany(payload);
      }
      goBackToCompanies();
    } catch (e: any) {
      Alert.alert('Gagal menyimpan', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (
    label: string,
    value: string,
    onChange: (t: string) => void,
    opts: { placeholder?: string; keyboardType?: any; multiline?: boolean } = {}
  ) => (
    <View style={{ marginBottom: SPACING.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, opts.multiline && { height: 90, textAlignVertical: 'top' }]}
        value={value}
        onChangeText={onChange}
        placeholder={opts.placeholder}
        placeholderTextColor={COLORS.disabled}
        keyboardType={opts.keyboardType ?? 'default'}
        multiline={opts.multiline}
        editable={!submitting}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title={isEdit ? 'Edit Perusahaan' : 'Tambah Perusahaan'} onBack={goBackToCompanies} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {renderField('Nama Perusahaan *', name, setName, { placeholder: 'PT Teknologi Indonesia' })}
            {renderField('Bidang Industri *', industry, setIndustry, { placeholder: 'Teknologi Informasi' })}
            {renderField('Lokasi *', location, setLocation, { placeholder: 'Kota/Kabupaten' })}
            {renderField('Alamat *', address, setAddress, { placeholder: 'Alamat lengkap', multiline: true })}
            {renderField('Kontak Pembimbing Industri *', contactPerson, setContactPerson, { placeholder: 'Nama PIC' })}
            {renderField('Nomor Telepon *', phone, setPhone, { placeholder: '08xx', keyboardType: 'phone-pad' })}
            {renderField('Email Perusahaan *', email, setEmail, { placeholder: 'hrd@perusahaan.com', keyboardType: 'email-address' })}
            {renderField('Deskripsi (Opsional)', description, setDescription, { placeholder: 'Deskripsi singkat perusahaan', multiline: true })}

            <TouchableOpacity
              style={[styles.submit, submitting && { opacity: 0.6 }]}
              onPress={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={COLORS.surface} />
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color={COLORS.surface} />
                  <Text style={styles.submitText}>Simpan</Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
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
  submit: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  submitText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default CompanyFormScreen;
