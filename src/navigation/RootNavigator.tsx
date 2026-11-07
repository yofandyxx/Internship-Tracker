import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { RootStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AdminNavigator from './AdminNavigator';
import StudentNavigator from './StudentNavigator';
import SupervisorNavigator from './SupervisorNavigator';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Splash screen: ditampilkan saat inisialisasi Auth ATAU saat fetch profil
const SplashScreen: React.FC = () => (
  <View style={styles.splash}>
    <View style={styles.logoCircle}>
      <Ionicons name="school" size={48} color={COLORS.surface} />
    </View>
    <Text style={styles.splashTitle}>PPNP Internship Tracker</Text>
    <ActivityIndicator color={COLORS.surface} style={{ marginTop: SPACING.lg }} />
  </View>
);

// Blocked screen: hanya muncul jika profil benar-benar tidak valid
const BlockedScreen: React.FC<{ message: string | null; onLogout: () => void }> = ({
  message,
  onLogout,
}) => (
  <View style={styles.blocked}>
    <Ionicons name="alert-circle" size={72} color={COLORS.red} />
    <Text style={styles.blockedTitle}>Akses Ditolak</Text>
    <Text style={styles.blockedMsg}>
      {message ?? 'Profil pengguna tidak ditemukan atau tidak aktif. Hubungi administrator.'}
    </Text>
    <TouchableOpacity style={styles.blockedBtn} onPress={onLogout}>
      <Ionicons name="log-out-outline" size={18} color={COLORS.surface} />
      <Text style={styles.blockedBtnText}>Keluar</Text>
    </TouchableOpacity>
  </View>
);

const RootNavigator: React.FC = () => {
  const { firebaseUser, appUser, initializing, authError, logout } = useAuth();

  // (1) Loading awal ATAU sedang fetch profil → Splash
  if (initializing) {
    return <SplashScreen />;
  }

  // (2) Sudah login Firebase tapi profil belum siap
  if (firebaseUser && !appUser) {
    // Ada error eksplisit → Blocked
    if (authError) {
      return <BlockedScreen message={authError} onLogout={logout} />;
    }
    // Belum ada error tapi profil belum ada → masih memuat (jangan tampilkan Blocked)
    return <SplashScreen />;
  }

  // (3) Belum login → Auth Stack (Login / Register / Forgot Password)
  if (!appUser) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  // (4) Login valid → Role-based navigator
  switch (appUser.role) {
    case 'admin':
      return <AdminNavigator />;
    case 'student':
      return <StudentNavigator />;
    case 'supervisor':
      return <SupervisorNavigator />;
    default:
      return (
        <BlockedScreen
          message={`Role "${String(appUser.role)}" tidak dikenal.`}
          onLogout={logout}
        />
      );
  }
};

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  splashTitle: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    marginTop: SPACING.md,
  },
  blocked: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  blockedTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  blockedMsg: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  blockedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.red,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.lg,
  },
  blockedBtnText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: FONT_SIZE.md,
  },
});

export default RootNavigator;