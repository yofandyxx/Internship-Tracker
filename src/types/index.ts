// Semua tipe data utama aplikasi
import { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'student' | 'supervisor';
export type UserStatus = 'active' | 'inactive';

export interface AppUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  nim?: string;              // Khusus mahasiswa
  studyProgram?: string;
  semester?: number;
  phone?: string;
  photoUrl?: string;
  nidn?: string;             // Khusus pembimbing
  createdAt: Timestamp;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  description?: string;
  createdAt: Timestamp;
}

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface InternshipApplication {
  id: string;
  studentId: string;
  companyId: string;
  supervisorId?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  topic: string;
  description: string;
  proposalUrl?: string;
  status: ApplicationStatus;
  decisionNotes?: string;
  decidedBy?: string;
  decidedAt?: Timestamp;
  createdAt: Timestamp;
}

export type InternshipStatus = 'ongoing' | 'completed';

export interface Internship {
  id: string;
  applicationId: string;
  studentId: string;
  companyId: string;
  supervisorId: string;
  startDate: Timestamp;
  endDate: Timestamp;
  topic: string;
  status: InternshipStatus;
  targetDays: number;
  createdAt: Timestamp;
}

export type ActivityType =
  | 'Pengembangan Aplikasi'
  | 'Analisis Sistem'
  | 'Instalasi dan Konfigurasi'
  | 'Administrasi'
  | 'Pengujian Sistem'
  | 'Kegiatan Lainnya';

export type ReviewStatus = 'pending_review' | 'approved' | 'needs_revision';

export interface DailyLog {
  id: string;
  internshipId: string;
  studentId: string;
  date: Timestamp;
  activityType: ActivityType;
  description: string;
  result: string;
  obstacles: string;
  photoUrl?: string;
  reviewStatus: ReviewStatus;
  supervisorComment?: string;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
  createdAt: Timestamp;
}

export interface Evaluation {
  id: string;
  internshipId: string;
  studentId: string;
  supervisorId: string;
  discipline: number;
  responsibility: number;
  communication: number;
  teamwork: number;
  technicalSkill: number;
  finalScore: number;
  notes?: string;
  isFinal: boolean;
  publishedAt?: Timestamp;
  createdAt: Timestamp;
}