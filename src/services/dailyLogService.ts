// Layanan jurnal harian + workflow review
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
import { DailyLog, ReviewStatus } from '../types';

const startOfDayTs = (d: Date): Timestamp => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(x);
};
const endOfDayTs = (d: Date): Timestamp => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return Timestamp.fromDate(x);
};

export const createDailyLog = async (
  data: Omit<
    DailyLog,
    'id' | 'reviewStatus' | 'createdAt' | 'supervisorComment' | 'reviewedBy' | 'reviewedAt'
  >
): Promise<string> => {
  // Cegah jurnal ganda di tanggal yang sama untuk magang yang sama
  const day = data.date.toDate();
  const dupSnap = await getDocs(
    query(collection(db, 'dailyLogs'), where('studentId', '==', data.studentId))
  );
  const hasDuplicate = dupSnap.docs.some((d) => {
    const log = d.data() as DailyLog;
    const date = log.date.toDate();
    return log.internshipId === data.internshipId
      && date >= dayStartDate(day)
      && date <= dayEndDate(day);
  });
  if (hasDuplicate) {
    throw new Error('Jurnal untuk tanggal ini sudah ada.');
  }

  const ref = await addDoc(collection(db, 'dailyLogs'), {
    ...data,
    reviewStatus: 'pending_review' as ReviewStatus,
    createdAt: Timestamp.now(),
  });
  return ref.id;
};

const dayStartDate = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const dayEndDate = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

export const updateDailyLog = async (
  id: string,
  updates: Partial<Pick<DailyLog, 'activityType' | 'description' | 'result' | 'obstacles' | 'photoUrl' | 'date'>>
): Promise<void> => {
  const snap = await getDoc(doc(db, 'dailyLogs', id));
  if (!snap.exists()) throw new Error('Jurnal tidak ditemukan');
  const log = snap.data() as DailyLog;
  if (log.reviewStatus === 'approved') {
    throw new Error('Jurnal yang sudah disetujui tidak dapat diubah.');
  }
  await updateDoc(doc(db, 'dailyLogs', id), updates);
};

export const deleteDailyLog = async (id: string): Promise<void> => {
  const snap = await getDoc(doc(db, 'dailyLogs', id));
  if (!snap.exists()) throw new Error('Jurnal tidak ditemukan');
  const log = snap.data() as DailyLog;
  if (log.reviewStatus === 'approved') {
    throw new Error('Jurnal yang sudah disetujui tidak dapat dihapus.');
  }
  await deleteDoc(doc(db, 'dailyLogs', id));
};

// Mahasiswa: kirim ulang setelah revisi
export const resubmitDailyLog = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'dailyLogs', id), {
    reviewStatus: 'pending_review',
    supervisorComment: '',
    reviewedBy: '',
    reviewedAt: null,
  });
};

export const listLogsByStudent = async (studentId: string): Promise<DailyLog[]> => {
  const snap = await getDocs(
    query(collection(db, 'dailyLogs'), where('studentId', '==', studentId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DailyLog, 'id'>) }))
    .sort((a, b) => b.date.toMillis() - a.date.toMillis());
};

export const listLogsByInternship = async (
  internshipId: string
): Promise<DailyLog[]> => {
  const snap = await getDocs(
    query(collection(db, 'dailyLogs'), where('internshipId', '==', internshipId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<DailyLog, 'id'>) }))
    .sort((a, b) => b.date.toMillis() - a.date.toMillis());
};

export const getDailyLog = async (id: string): Promise<DailyLog | null> => {
  const snap = await getDoc(doc(db, 'dailyLogs', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<DailyLog, 'id'>) };
};

// Pembimbing: review jurnal
export const reviewDailyLog = async (
  id: string,
  decision: 'approved' | 'needs_revision',
  supervisorId: string,
  comment: string
): Promise<void> => {
  await updateDoc(doc(db, 'dailyLogs', id), {
    reviewStatus: decision,
    supervisorComment: comment,
    reviewedBy: supervisorId,
    reviewedAt: Timestamp.now(),
  });
};
