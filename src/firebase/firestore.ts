// Inisialisasi Cloud Firestore
import { initializeFirestore, Firestore } from 'firebase/firestore';
import app from './config';

// Field opsional yang kosong tidak boleh membuat write gagal.
const db: Firestore = initializeFirestore(app, { ignoreUndefinedProperties: true });
export { db };
