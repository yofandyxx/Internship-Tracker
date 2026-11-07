// Perhitungan nilai akhir sesuai bobot yang ditentukan
export const calculateFinalScore = (
  discipline: number,
  responsibility: number,
  communication: number,
  teamwork: number,
  technicalSkill: number
): number => {
  const final =
    discipline * 0.20 +
    responsibility * 0.20 +
    communication * 0.15 +
    teamwork * 0.15 +
    technicalSkill * 0.30;
  return Math.round(final * 100) / 100; // dua desimal
};