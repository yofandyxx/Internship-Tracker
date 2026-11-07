# PPNP Internship Tracker

Aplikasi mobile untuk memantau proses magang mahasiswa, mulai dari pengajuan, jurnal harian, review pembimbing, hingga penilaian akhir.

## Teknologi

- React Native 0.88
- Expo SDK 58
- TypeScript
- React Navigation
- Expo Image Picker
- Firebase dan Cloudinary digunakan oleh aplikasi, tetapi detail konfigurasi dan kredensial sengaja tidak didokumentasikan di repository publik.

## Fitur utama

### Mahasiswa

- Login dan pemulihan password
- Melihat daftar perusahaan
- Mengirim pengajuan magang
- Melihat status pengajuan
- Membuat dan mengedit jurnal harian
- Menambahkan foto dokumentasi
- Melihat hasil evaluasi final

### Pembimbing

- Melihat mahasiswa bimbingan
- Melihat progress magang
- Meninjau jurnal harian
- Memberikan catatan revisi
- Membuat dan memfinalisasi penilaian

### Admin

- Dashboard statistik
- Manajemen pengguna
- Manajemen perusahaan
- Review pengajuan magang
- Laporan aplikasi

## Prasyarat

- Node.js 18 atau lebih baru
- npm
- Expo Go atau development build
- Android Studio untuk emulator Android (opsional)

## Instalasi

```bash
npm install
```

Jalankan aplikasi:

```bash
npm start
```

Perintah lain:

```bash
npm run android
npm run ios
npm run web
npm run typecheck
```

Untuk membersihkan cache Expo:

```bash
npx expo start -c
```

## Struktur proyek

```text
src/
├── components/       Komponen UI yang dapat digunakan ulang
├── constants/        Tema dan konstanta aplikasi
├── contexts/         Context global aplikasi
├── firebase/         Integrasi Firebase
├── hooks/            Custom React hooks
├── navigation/       Root, tab, dan stack navigator
├── screens/          Layar berdasarkan role pengguna
├── services/         Integrasi data dan layanan eksternal
├── types/            TypeScript interfaces dan tipe data
└── utils/            Validasi, tanggal, progress, dan scoring
```

## Catatan konfigurasi

> Konfigurasi Firebase, Firestore Rules, dan Cloudinary sengaja tidak dicantumkan di README ini.

> Sebelum menjalankan aplikasi, siapkan konfigurasi tersebut melalui mekanisme private/environment milik deployment Anda. Jangan mengunggah credential, upload preset, private key, atau file konfigurasi produksi ke repository publik.

> Firebase Web API key bukan pengganti security rules. Pastikan akses database dibatasi berdasarkan autentikasi, role, dan kepemilikan data.

## Validasi kode

Sebelum membuat commit atau pull request, jalankan:

```bash
npm run typecheck
```

Target pemeriksaan TypeScript adalah tanpa error.

## Kontribusi

1. Buat branch baru dari branch utama.
2. Kerjakan perubahan secara terisolasi.
3. Jalankan `npm run typecheck`.
4. Buat commit dengan pesan yang jelas.
5. Buka pull request dan jelaskan perubahan serta cara pengujiannya.

## Lisensi

Proyek ini menggunakan lisensi yang tercantum pada file [LICENSE](LICENSE).
