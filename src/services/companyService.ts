// CRUD perusahaan/instansi (admin)
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { Company } from '../types';

export const listCompanies = async (): Promise<Company[]> => {
  const snap = await getDocs(collection(db, 'companies'));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Company, 'id'>) }));
};

export const getCompany = async (id: string): Promise<Company | null> => {
  const snap = await getDoc(doc(db, 'companies', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Company, 'id'>) };
};

// Cek duplikasi nama perusahaan (case-insensitive)
export const isCompanyNameTaken = async (
  name: string,
  excludeId?: string
): Promise<boolean> => {
  const snap = await getDocs(collection(db, 'companies'));
  const normalized = name.trim().toLowerCase();
  return snap.docs.some((d) => {
    if (excludeId && d.id === excludeId) return false;
    return ((d.data() as Company).name || '').trim().toLowerCase() === normalized;
  });
};

export const createCompany = async (
  data: Omit<Company, 'id' | 'createdAt'>
): Promise<string> => {
  const ref = await addDoc(collection(db, 'companies'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return ref.id;
};

export const updateCompany = async (
  id: string,
  data: Partial<Omit<Company, 'id' | 'createdAt'>>
): Promise<void> => {
  await updateDoc(doc(db, 'companies', id), data);
};

export const deleteCompany = async (id: string): Promise<void> => {
  // Cegah hapus jika perusahaan dipakai pengajuan/magang
  const appsSnap = await getDocs(
    query(collection(db, 'internshipApplications'), where('companyId', '==', id))
  );
  if (!appsSnap.empty) {
    throw new Error('Perusahaan masih terhubung dengan pengajuan magang.');
  }
  await deleteDoc(doc(db, 'companies', id));
};