// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvBXE18KleZZ-PC0ywivNPPBQmnE8Bc1Y",
  authDomain: "ppnp-internship-tracker.firebaseapp.com",
  projectId: "ppnp-internship-tracker",
  storageBucket: "ppnp-internship-tracker.firebasestorage.app",
  messagingSenderId: "723622478532",
  appId: "1:723622478532:web:3e85b8484605f39c2bbf91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  

export default app;
