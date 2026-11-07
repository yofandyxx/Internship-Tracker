import React, { createContext, useCallback, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  login as svcLogin,
  logout as svcLogout,
  resetPassword as svcResetPassword,
  observeAuthState,
  loadUserProfile,
} from '../services/authService';
import { AppUser } from '../types';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  initializing: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Retry dengan exponential backoff — menangani error transien dari Firestore
// (misal rules baru dipublikasikan, sesi auth token belum selesai disinkronkan).
const loadProfileWithRetry = async (
  uid: string,
  maxRetries = 3
): Promise<AppUser | null> => {
  let lastError: any = null;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await loadUserProfile(uid);
    } catch (e) {
      lastError = e;
      if (i < maxRetries - 1) {
        // 300ms, 600ms sebelum percobaan berikutnya
        await new Promise((resolve) => setTimeout(resolve, 300 * (i + 1)));
      }
    }
  }
  throw lastError;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthState = useCallback(async (user: FirebaseUser | null) => {
    setFirebaseUser(user);
    setAuthError(null);

    if (!user) {
      setAppUser(null);
      setInitializing(false);
      return;
    }

    // PERBAIKAN UTAMA: set initializing = true saat fetch profil.
    // Ini mencegah RootNavigator menampilkan BlockedScreen pada frame
    // di antara setFirebaseUser() dan setAppUser() selesai.
    setInitializing(true);

    try {
      const profile = await loadProfileWithRetry(user.uid);
      if (!profile) {
        setAuthError('Profil tidak ditemukan di Firestore.');
        setAppUser(null);
      } else if (profile.status !== 'active') {
        setAuthError('Akun tidak aktif. Hubungi admin.');
        setAppUser(null);
      } else {
        setAppUser(profile);
        setAuthError(null);
      }
    } catch (e: any) {
      setAuthError(e?.message ?? 'Gagal memuat profil');
      setAppUser(null);
    } finally {
      setInitializing(false);
    }
  }, []);

  useEffect(() => {
    const unsub = observeAuthState(handleAuthState);
    return () => unsub();
  }, [handleAuthState]);

  const login = async (email: string, password: string) => {
    setAuthError(null);
    await svcLogin(email, password);
  };

  const logout = async () => {
    await svcLogout();
    setAppUser(null);
    setFirebaseUser(null);
    setAuthError(null);
  };

  const resetPassword = async (email: string) => {
    await svcResetPassword(email);
  };

  const refreshProfile = async () => {
    if (!firebaseUser) return;
    try {
      const profile = await loadUserProfile(firebaseUser.uid);
      setAppUser(profile);
    } catch {
      // diamkan
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        appUser,
        initializing,
        authError,
        login,
        logout,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};