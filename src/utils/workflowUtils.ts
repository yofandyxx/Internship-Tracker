// Util bisnis proses: label, transisi status, dan predikat workflow
import {
  ApplicationStatus,
  InternshipStatus,
  ReviewStatus,
} from '../types';

// ---- Label ----
export const applicationStatusLabel = (s: ApplicationStatus): string => {
  switch (s) {
    case 'pending': return 'Menunggu';
    case 'approved': return 'Disetujui';
    case 'rejected': return 'Ditolak';
    default: return s;
  }
};

export const reviewStatusLabel = (s: ReviewStatus): string => {
  switch (s) {
    case 'pending_review': return 'Menunggu Review';
    case 'approved': return 'Disetujui';
    case 'needs_revision': return 'Perlu Revisi';
    default: return s;
  }
};

export const internshipStatusLabel = (s: InternshipStatus): string => {
  switch (s) {
    case 'ongoing': return 'Berlangsung';
    case 'completed': return 'Selesai';
    default: return s;
  }
};

// ---- Predikat workflow ----
// Mahasiswa boleh mengedit jurnal selama belum disetujui
export const canStudentEditLog = (status: ReviewStatus): boolean =>
  status !== 'approved';

// Mahasiswa boleh menghapus jurnal selama belum disetujui
export const canStudentDeleteLog = (status: ReviewStatus): boolean =>
  status !== 'approved';

// Mahasiswa boleh mengajukan jurnal baru jika magang aktif dan belum ada jurnal di tanggal tersebut.
// (Pengecekan duplikat dilakukan di service.)
export const canAddDailyLog = (hasActiveInternship: boolean): boolean =>
  hasActiveInternship;

// Pengajuan dapat direview jika masih berstatus pending
export const canReviewApplication = (status: ApplicationStatus): boolean =>
  status === 'pending';

// Transisi status review yang diizinkan
export const nextReviewStatus = (
  current: ReviewStatus,
  action: 'approve' | 'request_revision' | 'resubmit'
): ReviewStatus | null => {
  if (action === 'approve' && current === 'pending_review') return 'approved';
  if (action === 'request_revision' && current === 'pending_review') return 'needs_revision';
  if (action === 'resubmit' && current === 'needs_revision') return 'pending_review';
  return null;
};

// Transisi status pengajuan yang diizinkan
export const nextApplicationStatus = (
  current: ApplicationStatus,
  action: 'approve' | 'reject'
): ApplicationStatus | null => {
  if (current !== 'pending') return null;
  if (action === 'approve') return 'approved';
  if (action === 'reject') return 'rejected';
  return null;
};

// Predikat jurnal butuh perhatian mahasiswa
export const logNeedsStudentAction = (status: ReviewStatus): boolean =>
  status === 'needs_revision';

// Predikat jurnal butuh perhatian pembimbing
export const logNeedsSupervisorAction = (status: ReviewStatus): boolean =>
  status === 'pending_review';