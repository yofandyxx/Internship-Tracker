// Layanan pengajuan magang + transaksi review admin
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { InternshipApplication, ApplicationStatus } from '../types';

export const createApplication = async (
  data: Omit<InternshipApplication, 'id' | 'status' | 'createdAt' | 'decidedBy' | 'decidedAt' | 'decisionNotes'>
): Promise<string> => {
  // Cegah pengajuan ganda yang masih pending
  const pendingSnap = await getDocs(
    query(
      collection(db, 'internshipApplications'),
      where('studentId', '==', data.studentId),
      where('status', '==', 'pending')
    )
  );
  if (!pendingSnap.empty) {
    throw new Error('Anda masih memiliki pengajuan yang menunggu keputusan.');
  }

  // Cegah pengajuan ganda jika sudah ada magang aktif
  const ongoingSnap = await getDocs(
    query(
      collection(db, 'internships'),
      where('studentId', '==', data.studentId),
      where('status', '==', 'ongoing')
    )
  );
  if (!ongoingSnap.empty) {
    throw new Error('Anda sedang menjalani magang aktif.');
  }

  // Firestore Web SDK menolak nilai undefined. Field opsional seperti
  // proposalUrl harus dihilangkan dari payload jika tidak diisi.
  const payload = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
  const ref = await addDoc(collection(db, 'internshipApplications'), {
    ...payload,
    status: 'pending' as ApplicationStatus,
    createdAt: Timestamp.now(),
  });
  return ref.id;
};

export const getApplication = async (
  id: string
): Promise<InternshipApplication | null> => {
  const snap = await getDoc(doc(db, 'internshipApplications', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<InternshipApplication, 'id'>) };
};

export const listApplicationsByStudent = async (
  studentId: string
): Promise<InternshipApplication[]> => {
  const snap = await getDocs(
    query(
      collection(db, 'internshipApplications'),
      where('studentId', '==', studentId)
    )
  );
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<InternshipApplication, 'id'>),
  })).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const listAllApplications = async (): Promise<InternshipApplication[]> => {
  const snap = await getDocs(collection(db, 'internshipApplications'));
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<InternshipApplication, 'id'>),
  })).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

// Admin: proses pengajuan (approve/reject). Menggunakan transaksi atomik.
export const reviewApplication = async (
  applicationId: string,
  decision: 'approved' | 'rejected',
  adminId: string,
  notes: string,
  supervisorId?: string
): Promise<void> => {
  const appRef = doc(db, 'internshipApplications', applicationId);

  await runTransaction(db, async (transaction) => {
    const appSnap = await transaction.get(appRef);
    if (!appSnap.exists()) throw new Error('Pengajuan tidak ditemukan');

    const appData = appSnap.data() as InternshipApplication;
    if (appData.status !== 'pending') {
      throw new Error('Pengajuan sudah diproses sebelumnya.');
    }

    if (decision === 'approved') {
      if (!supervisorId) throw new Error('Pembimbing wajib dipilih untuk disetujui.');

      // Hitung target hari dari selisih tanggal
      const start = appData.startDate.toDate();
      const end = appData.endDate.toDate();
      const diffMs = Math.max(0, end.getTime() - start.getTime());
      const targetDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1);

      const intRef = doc(collection(db, 'internships'));
      transaction.set(intRef, {
        applicationId,
        studentId: appData.studentId,
        companyId: appData.companyId,
        supervisorId,
        startDate: appData.startDate,
        endDate: appData.endDate,
        topic: appData.topic,
        status: 'ongoing',
        targetDays,
        createdAt: Timestamp.now(),
      });
    }

    transaction.update(appRef, {
      status: decision,
      decisionNotes: notes,
      decidedBy: adminId,
      decidedAt: Timestamp.now(),
      ...(decision === 'approved' ? { supervisorId } : {}),
    });
  });
};
