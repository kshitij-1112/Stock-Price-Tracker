// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyBKe57a-TBbfvM_USQdmTOc_gzJ6iQBZLM",
  authDomain: "stock-tracker-cb9a7.firebaseapp.com",
  projectId: "stock-tracker-cb9a7",
  storageBucket: "stock-tracker-cb9a7.appspot.com",
  messagingSenderId: "158072202594",
  appId: "1:158072202594:web:fd74c4a94c4122931af83b",
  measurementId: "G-JH4162CQR1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app); // Initialize Firestore

export { auth, firestore };
