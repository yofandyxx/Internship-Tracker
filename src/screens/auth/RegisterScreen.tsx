import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { registerUser } from '../../services/authService';
import { isValidEmail, isValidPassword, isNonEmpty } from '../../utils/validation';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Role = 'student' | 'supervisor';

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const [role, setRole] = useState<Role>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [nim, setNim] = useState('');
  const [nidn, setNidn] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [semester, setSemester] = useState('');
  const [phone, setPhone] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = (): string | null => {
    if (!isNonEmpty(name)) return 'Nama lengkap wajib diisi.';
    if (!isValidEmail(email)) return 'Email tidak valid.';
    if (!isValidPassword(password)) return 'Password minimal 6 karakter.';
    if (password !== confirmPassword) return 'Konfirmasi password tidak cocok.';
    if (!isNonEmpty(studyProgram)) return 'Program studi wajib diisi.';

    if (role === 'student') {
      if (!isNonEmpty(nim)) return 'NIM wajib diisi.';
      const sem = Number(semester);
      if (!sem || sem < 1 || sem > 14) return 'Semester harus antara 1–14.';
    } else {
      if (!isNonEmpty(nidn)) return 'NIDN wajib diisi.';
    }
    return null;
  };

  const onSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    if (submitting) return;
    setError(null);
    setSubmitting(true);

    try {
      await registerUser(email, password, {
        name,
        role,
        phone,
        studyProgram,
        ...(role === 'student'
          ? { nim, semester: Number(semester) }
          : { nidn }),
      });
      // RootNavigator otomatis berpindah ke dashboard role setelah
      // AuthContext menerima event onAuthStateChanged. Tidak perlu navigate manual.
      Alert.alert(
        'Registrasi Berhasil',
        'Akun Anda telah dibuat. Selamat menggunakan aplikasi.',
        [{ text: 'OK' }]
      );
    } catch (e: any) {
      const code: string = e?.code ?? '';
      if (code === 'auth/email-already-in-use') {
        setError('Email sudah terdaftar. Silakan login atau reset password.');
      } else if (code === 'auth/weak-password') {
        setError('Password terlalu lemah (minimal 6 karakter).');
      } else if (code === 'auth/invalid-email') {
        setError('Format email tidak valid.');
      } else if (code === 'permission-denied') {
        setError('Registrasi ditolak oleh server. Hubungi administrator.');
      } else {
        setError(e?.message ?? 'Registrasi gagal. Coba lagi.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (t: string) => void,
    opts: {
      placeholder?: string;
      keyboardType?: any;
      secure?: boolean;
      rightBtn?: React.ReactNode;
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    } = {}
  ) => (
    <View style={{ marginBottom: SPACING.md }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={opts.placeholder}
          placeholderTextColor={COLORS.disabled}
          keyboardType={opts.keyboardType ?? 'default'}
          secureTextEntry={opts.secure}
          autoCapitalize={opts.autoCapitalize ?? 'words'}
          editable={!submitting}
        />
        {opts.rightBtn}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.surface} />
          <Text style={styles.backText}>Kembali ke Login</Text>
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="person-add" size={36} color={COLORS.surface} />
          </View>
          <Text style={styles.appName}>Daftar Akun</Text>
          <Text style={styles.tagline}>PPNP Internship Tracker</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Daftar Sebagai *</Text>
          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
              onPress={() => setRole('student')}
              disabled={submitting}
            >
              <Ionicons
                name="school"
                size={16}
                color={role === 'student' ? COLORS.surface : COLORS.primary}
              />
              <Text
                style={[styles.roleText, role === 'student' && styles.roleTextActive]}
              >
                Mahasiswa
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'supervisor' && styles.roleBtnActive]}
              onPress={() => setRole('supervisor')}
              disabled={submitting}
            >
              <Ionicons
                name="briefcase"
                size={16}
                color={role === 'supervisor' ? COLORS.surface : COLORS.primary}
              />
              <Text
                style={[styles.roleText, role === 'supervisor' && styles.roleTextActive]}
              >
                Pembimbing
              </Text>
            </TouchableOpacity>
          </View>

          {renderInput('Nama Lengkap *', name, setName, {
            placeholder: 'Nama sesuai KTP',
          })}

          {renderInput('Email *', email, setEmail, {
            placeholder: 'nama@email.com',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          })}

          {renderInput('Password *', password, setPassword, {
            placeholder: 'Minimal 6 karakter',
            secure: !showPass,
            autoCapitalize: 'none',
            rightBtn: (
              <TouchableOpacity onPress={() => setShowPass((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            ),
          })}

          {renderInput('Konfirmasi Password *', confirmPassword, setConfirmPassword, {
            placeholder: 'Ulangi password',
            secure: !showPass,
            autoCapitalize: 'none',
          })}

          {renderInput('Program Studi *', studyProgram, setStudyProgram, {
            placeholder: 'Teknologi Rekayasa Komputer',
          })}

          {role === 'student' ? (
            <>
              {renderInput('NIM *', nim, setNim, {
                placeholder: '2024001',
                autoCapitalize: 'none',
              })}
              {renderInput('Semester *', semester, setSemester, {
                placeholder: '1 - 14',
                keyboardType: 'numeric',
                autoCapitalize: 'none',
              })}
            </>
          ) : (
            renderInput('NIDN *', nidn, setNidn, {
              placeholder: '0012345678',
              keyboardType: 'numeric',
              autoCapitalize: 'none',
            })
          )}

          {renderInput('Nomor Telepon (Opsional)', phone, setPhone, {
            placeholder: '08xxxxxxxxxx',
            keyboardType: 'phone-pad',
            autoCapitalize: 'none',
          })}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, submitting && { opacity: 0.6 }]}
            onPress={onSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <Text style={styles.buttonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} disabled={submitting}>
              <Text style={styles.footerLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.primary },
  container: { flexGrow: 1, padding: SPACING.lg },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  backText: { color: COLORS.surface, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  logoWrap: { alignItems: 'center', marginBottom: SPACING.lg },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  appName: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginTop: SPACING.sm,
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    height: 44,
    gap: SPACING.sm,
  },
  input: { flex: 1, color: COLORS.text, fontSize: FONT_SIZE.md },
  roleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    height: 42,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  roleBtnActive: { backgroundColor: COLORS.primary },
  roleText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  roleTextActive: { color: COLORS.surface },
  error: {
    color: COLORS.red,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 46,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  footerText: { color: COLORS.textSecondary, fontSize: FONT_SIZE.sm },
  footerLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
});

export default RegisterScreen;