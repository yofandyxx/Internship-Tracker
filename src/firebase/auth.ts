// Inisialisasi Firebase Auth dengan persistensi AsyncStorage untuk React Native
import { getAuth, Auth } from 'firebase/auth';
import app from './config';

// getReactNativePersistence memastikan sesi login tersimpan di AsyncStorage
// sehingga pengguna tetap login setelah aplikasi ditutup.
// getAuth memakai konfigurasi Auth yang kompatibel dengan Firebase Web SDK.
// Persistensi native memerlukan paket tambahan; tanpa itu sesi tetap aman dan
// aplikasi tidak gagal start karena modul native yang hilang.
const auth: Auth = getAuth(app);

export { auth };
