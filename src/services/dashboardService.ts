// Agregasi statistik dashboard per role
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { AppUser, DailyLog, Internship } from '../types';

export interface AdminStats {
  totalStudents: number;
  totalCompanies: number;
  pendingApplications: number;
  approvedApplications: number;
  ongoingInternships: number;
  completedInternships: number;
  totalLogs: number;
  studyProgramStats: Record<string, number>;
}

export const getAdminStats = async (): Promise<AdminStats> => {
  const [studentsSnap, companiesSnap, pendingApps, approvedApps, ongoing, completed, logsSnap] =
    await Promise.all([
      getDocs(query(collection(db, 'users'), where('role', '==', 'student'))),
      getDocs(collection(db, 'companies')),
      getDocs(
        query(collection(db, 'internshipApplications'), where('status', '==', 'pending'))
      ),
      getDocs(
        query(collection(db, 'internshipApplications'), where('status', '==', 'approved'))
      ),
      getDocs(query(collection(db, 'internships'), where('status', '==', 'ongoing'))),
      getDocs(query(collection(db, 'internships'), where('status', '==', 'completed'))),
      getDocs(collection(db, 'dailyLogs')),
    ]);

  const studyProgramStats: Record<string, number> = {};
  studentsSnap.forEach((d) => {
    const p = (d.data() as AppUser).studyProgram || 'Lainnya';
    studyProgramStats[p] = (studyProgramStats[p] || 0) + 1;
  });

  return {
    totalStudents: studentsSnap.size,
    totalCompanies: companiesSnap.size,
    pendingApplications: pendingApps.size,
    approvedApplications: approvedApps.size,
    ongoingInternships: ongoing.size,
    completedInternships: completed.size,
    totalLogs: logsSnap.size,
    studyProgramStats,
  };
};

export interface SupervisorStats {
  totalStudents: number;
  pendingReviews: number;
  needsRevision: number;
  approved: number;
  students: AppUser[];
  internships: Internship[];
}

export const getSupervisorStats = async (
  supervisorId: string
): Promise<SupervisorStats> => {
  const intSnap = await getDocs(
    query(collection(db, 'internships'), where('supervisorId', '==', supervisorId))
  );
  const internships = intSnap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Internship, 'id'>),
  }));

  // Ambil data mahasiswa bimbingan
  const students: AppUser[] = [];
  for (const i of internships) {
    const uSnap = await getDocs(
      query(collection(db, 'users'), where('__name__', '==', i.studentId))
    );
    // fallback: cari lewat collection users by uid
    if (uSnap.empty) {
      const allUsers = await getDocs(collection(db, 'users'));
      allUsers.forEach((d) => {
        if (d.id === i.studentId) {
          students.push({ uid: d.id, ...(d.data() as Omit<AppUser, 'uid'>) });
        }
      });
    } else {
      uSnap.forEach((d) => {
        students.push({ uid: d.id, ...(d.data() as Omit<AppUser, 'uid'>) });
      });
    }
  }

  // Hitung status jurnal per magang
  let pendingReviews = 0;
  let needsRevision = 0;
  let approved = 0;

  for (const i of internships) {
    const logsSnap = await getDocs(
      query(collection(db, 'dailyLogs'), where('internshipId', '==', i.id))
    );
    logsSnap.forEach((d) => {
      const status = (d.data() as DailyLog).reviewStatus;
      if (status === 'pending_review') pendingReviews++;
      else if (status === 'needs_revision') needsRevision++;
      else if (status === 'approved') approved++;
    });
  }

  return {
    totalStudents: students.length,
    pendingReviews,
    needsRevision,
    approved,
    students,
    internships,
  };
};