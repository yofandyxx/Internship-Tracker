// Layanan magang aktif
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { Internship } from '../types';

export const getActiveInternshipByStudent = async (
  studentId: string
): Promise<Internship | null> => {
  const snap = await getDocs(
    query(
      collection(db, 'internships'),
      where('studentId', '==', studentId),
      where('status', '==', 'ongoing')
    )
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Internship, 'id'>) };
};

export const getInternship = async (id: string): Promise<Internship | null> => {
  const snap = await getDoc(doc(db, 'internships', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Internship, 'id'>) };
};

export const listInternshipsBySupervisor = async (
  supervisorId: string
): Promise<Internship[]> => {
  const snap = await getDocs(
    query(collection(db, 'internships'), where('supervisorId', '==', supervisorId))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Internship, 'id'>) }));
};

export const listAllInternships = async (): Promise<Internship[]> => {
  const snap = await getDocs(collection(db, 'internships'));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Internship, 'id'>) }));
};

export const markInternshipCompleted = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'internships', id), { status: 'completed' });
};