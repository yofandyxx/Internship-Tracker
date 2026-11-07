// ============================================================
// Layanan Firebase Authentication
// - Login, logout, reset password
// - Registrasi mandiri (student / supervisor) + tulis profil Firestore
// ============================================================
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  deleteUser,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth } from '../firebase/auth';
import { db } from '../firebase/firestore';
import { fetchAppUser } from './userService';
import { AppUser } from '../types';

// ------------------------------------------------------------
// Login
// ------------------------------------------------------------
export const login = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email.trim(), password);
};

// ------------------------------------------------------------
// Logout
// ------------------------------------------------------------
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// ------------------------------------------------------------
// Reset password (kirim email)
// ------------------------------------------------------------
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email.trim());
};

// ------------------------------------------------------------
// Listener status autentikasi
// ------------------------------------------------------------
export const observeAuthState = (
  callback: (user: FirebaseUser | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// ------------------------------------------------------------
// Muat profil pengguna dari Firestore
// ------------------------------------------------------------
export const loadUserProfile = async (uid: string): Promise<AppUser | null> => {
  return fetchAppUser(uid);
};

// ------------------------------------------------------------
// REGISTRASI MANDIRI
// ------------------------------------------------------------
export interface RegisterProfile {
  name: string;
  role: 'student' | 'supervisor';
  phone?: string;
  studyProgram?: string;
  nim?: string;        // wajib untuk student
  semester?: number;   // wajib untuk student
  nidn?: string;       // wajib untuk supervisor
}

// Alur registrasi:
// 1) Buat akun Firebase Authentication
// 2) Tulis dokumen users/{uid} di Firestore
// 3) Jika langkah 2 gagal, hapus akun Auth agar email bisa dipakai ulang
//    (menghindari akun Auth tanpa profil di Firestore)
export const registerUser = async (
  email: string,
  password: string,
  profile: RegisterProfile
): Promise<string> => {
  // Pastikan role diizinkan
  if (profile.role !== 'student' && profile.role !== 'supervisor') {
    throw new Error('Role tidak valid. Hanya student atau supervisor yang diizinkan.');
  }

  // Langkah 1: buat akun Auth
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const uid = cred.user.uid;

  // Langkah 2: tulis dokumen profil
  try {
    const baseData = {
      email: email.trim(),
      name: profile.name.trim(),
      role: profile.role,
      status: 'active' as const,
      phone: profile.phone?.trim() ?? '',
      studyProgram: profile.studyProgram?.trim() ?? '',
      photoUrl: '',
      createdAt: Timestamp.now(),
    };

    const roleData =
      profile.role === 'student'
        ? {
            nim: profile.nim?.trim() ?? '',
            semester: profile.semester ?? 0,
          }
        : {
            nidn: profile.nidn?.trim() ?? '',
          };

    await setDoc(doc(db, 'users', uid), { ...baseData, ...roleData });
  } catch (e) {
    // Langkah 3: rollback — hapus akun Auth agar email bisa dipakai lagi
    try {
      await deleteUser(cred.user);
    } catch {
      // Rollback gagal (misal butuh recent login). User harus menghubungi
      // admin untuk membersihkan akun manual di Firebase Console.
    }
    throw e;
  }

  return uid;
};