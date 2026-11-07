// Layanan penilaian magang
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { Evaluation } from '../types';
import { calculateFinalScore } from '../utils/scoreUtils';
import { fetchAppUser } from './userService';

export interface EvaluationWithStudent extends Evaluation {
  studentName: string;
}

const withStudent = async (evaluation: Evaluation): Promise<EvaluationWithStudent> => {
  const student = await fetchAppUser(evaluation.studentId);
  return { ...evaluation, studentName: student?.name ?? 'Mahasiswa' };
};

export const listAllEvaluations = async (): Promise<EvaluationWithStudent[]> => {
  const snap = await getDocs(collection(db, 'evaluations'));
  return Promise.all(snap.docs.map((d) => withStudent({ id: d.id, ...(d.data() as Omit<Evaluation, 'id'>) })));
};

export const listEvaluationsBySupervisor = async (supervisorId: string): Promise<EvaluationWithStudent[]> => {
  const snap = await getDocs(query(collection(db, 'evaluations'), where('supervisorId', '==', supervisorId)));
  return Promise.all(snap.docs.map((d) => withStudent({ id: d.id, ...(d.data() as Omit<Evaluation, 'id'>) })));
};

export const getEvaluationByInternship = async (
  internshipId: string,
  ownerField: 'studentId' | 'supervisorId',
  ownerId: string
): Promise<Evaluation | null> => {
  const snap = await getDocs(
    query(
      collection(db, 'evaluations'),
      where(ownerField, '==', ownerId)
    )
  );
  if (snap.empty) return null;
  const d = snap.docs.find((item) => item.data().internshipId === internshipId);
  if (!d) return null;
  return { id: d.id, ...(d.data() as Omit<Evaluation, 'id'>) };
};

export interface EvaluationInput {
  internshipId: string;
  studentId: string;
  supervisorId: string;
  discipline: number;
  responsibility: number;
  communication: number;
  teamwork: number;
  technicalSkill: number;
  notes?: string;
}

export const createEvaluation = async (input: EvaluationInput): Promise<string> => {
  const existing = await getEvaluationByInternship(
    input.internshipId,
    'supervisorId',
    input.supervisorId
  );
  if (existing) throw new Error('Penilaian untuk magang ini sudah ada.');

  const finalScore = calculateFinalScore(
    input.discipline,
    input.responsibility,
    input.communication,
    input.teamwork,
    input.technicalSkill
  );

  const ref = await addDoc(collection(db, 'evaluations'), {
    ...input,
    finalScore,
    isFinal: false,
    createdAt: Timestamp.now(),
  });
  return ref.id;
};

export const updateEvaluation = async (
  id: string,
  input: Omit<EvaluationInput, 'internshipId' | 'studentId' | 'supervisorId'>
): Promise<void> => {
  const snap = await getDoc(doc(db, 'evaluations', id));
  if (!snap.exists()) throw new Error('Penilaian tidak ditemukan');
  const data = snap.data() as Evaluation;
  if (data.isFinal) throw new Error('Penilaian yang sudah final tidak dapat diubah.');

  const finalScore = calculateFinalScore(
    input.discipline,
    input.responsibility,
    input.communication,
    input.teamwork,
    input.technicalSkill
  );

  await updateDoc(doc(db, 'evaluations', id), {
    ...input,
    finalScore,
  });
};

export const finalizeEvaluation = async (id: string): Promise<void> => {
  const snap = await getDoc(doc(db, 'evaluations', id));
  if (!snap.exists()) throw new Error('Penilaian tidak ditemukan');
  const data = snap.data() as Evaluation;
  if (data.isFinal) throw new Error('Penilaian sudah difinalisasi.');
  await updateDoc(doc(db, 'evaluations', id), {
    isFinal: true,
    publishedAt: Timestamp.now(),
  });
};
