import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/AppHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useAuth } from '../../hooks/useAuth';
import { updateOwnProfile } from '../../services/userService';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

const ProfileScreen: React.FC = () => {
  const { appUser, logout, refreshProfile } = useAuth();

  const [name, setName] = useState(appUser?.name ?? '');
  const [phone, setPhone] = useState(appUser?.phone ?? '');
  const [photoUrl, setPhotoUrl] = useState(appUser?.photoUrl ?? '');
  const [studyProgram, setStudyProgram] = useState(appUser?.studyProgram ?? '');
  const [semester, setSemester] = useState(appUser?.semester?.toString() ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  if (!appUser) return null;

  const save = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await updateOwnProfile(appUser.uid, {
        name: name.trim(),
        phone: phone.trim(),
        photoUrl: photoUrl.trim() || undefined,
        studyProgram: studyProgram.trim() || undefined,
        semester: semester ? Number(semester) : undefined,
      });
      await refreshProfile();
      Alert.alert('Berhasil', 'Profil diperbarui.');
    } catch (e: any) {
      Alert.alert('Gagal', e?.message ?? 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabel =
    appUser.role === 'admin' ? 'Admin' : appUser.role === 'student' ? 'Mahasiswa' : 'Pembimbing';

  return (
    <SafeAreaView style={styles.flex} edges={['bottom']}>
      <AppHeader title="Profil" rightIcon="log-out-outline" onRightPress={() => setShowLogout(true)} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={COLORS.surface} />
            </View>
            <Text style={styles.name}>{appUser.name}</Text>
            <Text style={styles.role}>{roleLabel}</Text>
            <Text style={styles.meta}>{appUser.email}</Text>
          </View>

          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            editable={!submitting}
          />

          <Text style={styles.label}>Nomor Telepon</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!submitting}
          />

          <Text style={styles.label}>URL Foto Profil (Opsional)</Text>
          <TextInput
            style={styles.input}
            value={photoUrl}
            onChangeText={setPhotoUrl}
            autoCapitalize="none"
            editable={!submitting}
          />

          <Text style={styles.label}>Program Studi</Text>
          <TextInput
            style={styles.input}
            value={studyProgram}
            onChangeText={setStudyProgram}
            editable={!submitting}
          />

          {appUser.role === 'student' && (
            <>
              <Text style={styles.label}>Semester</Text>
              <TextInput
                style={styles.input}
                value={semester}
                onChangeText={setSemester}
                keyboardType="numeric"
                editable={!submitting}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.btn, submitting && { opacity: 0.6 }]}
            onPress={save}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color={COLORS.surface} />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color={COLORS.surface} />
                <Text style={styles.btnText}>Simpan Perubahan</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={showLogout}
        title="Keluar?"
        message="Anda akan keluar dari aplikasi."
        confirmLabel="Keluar"
        confirmColor={COLORS.red}
        onConfirm={async () => {
          setShowLogout(false);
          await logout();
        }}
        onCancel={() => setShowLogout(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.md, paddingBottom: SPACING.xl },
  avatarWrap: { alignItems: 'center', marginBottom: SPACING.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text, marginTop: SPACING.sm },
  role: { fontSize: FONT_SIZE.sm, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
  meta: { fontSize: FONT_SIZE.xs, color: COLORS.textSecondary, marginTop: 2 },
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
  btn: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  btnText: { color: COLORS.surface, fontWeight: '700', fontSize: FONT_SIZE.md },
});

export default ProfileScreen;