import { DailyLog } from '../types';

// Progress = (jumlah tanggal unik dengan jurnal DISETUJUI / target hari) × 100
// Batasi 0–100. Jika target 0, kembalikan null (belum tersedia).
export const calculateProgress = (logs: DailyLog[], targetDays: number): number | null => {
  if (!targetDays || targetDays <= 0) return null;

  const approvedUniqueDates = new Set<string>();
  logs.forEach((log) => {
    if (log.reviewStatus === 'approved') {
      // Gunakan string tanggal (YYYY-MM-DD) sebagai kunci unik
      const d = log.date.toDate();
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      approvedUniqueDates.add(key);
    }
  });

  const progress = (approvedUniqueDates.size / targetDays) * 100;
  return Math.min(100, Math.max(0, Math.round(progress * 100) / 100));
};