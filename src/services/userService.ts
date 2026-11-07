// Layanan pengelolaan profil pengguna di Firestore
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { AppUser, UserRole } from '../types';

export const fetchAppUser = async (uid: string): Promise<AppUser | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...(snap.data() as Omit<AppUser, 'uid'>) };
};

// Update profil milik sendiri (field aman, tidak termasuk role & status)
export const updateOwnProfile = async (
  uid: string,
  updates: Partial<Pick<AppUser, 'name' | 'phone' | 'photoUrl' | 'semester' | 'studyProgram' | 'nim'>>
): Promise<void> => {
  const clean: Record<string, unknown> = {};
  Object.entries(updates).forEach(([k, v]) => {
    if (v !== undefined) clean[k] = v;
  });
  await updateDoc(doc(db, 'users', uid), clean);
};

// Admin: ubah role/status pengguna
export const adminUpdateUser = async (
  uid: string,
  updates: Partial<Pick<AppUser, 'name' | 'role' | 'status' | 'phone' | 'studyProgram' | 'semester' | 'nim' | 'nidn'>>
): Promise<void> => {
  const clean: Record<string, unknown> = {};
  Object.entries(updates).forEach(([k, v]) => {
    if (v !== undefined) clean[k] = v;
  });
  await updateDoc(doc(db, 'users', uid), clean);
};

export const listUsersByRole = async (role: UserRole): Promise<AppUser[]> => {
  const snap = await getDocs(query(collection(db, 'users'), where('role', '==', role)));
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<AppUser, 'uid'>) }));
};

export const listAllUsers = async (): Promise<AppUser[]> => {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<AppUser, 'uid'>) }));
};