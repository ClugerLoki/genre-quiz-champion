import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAsayXz8OO8DyhfnoeJl6m1I269zbwKUBE",
  authDomain: "quiz-5b981.firebaseapp.com",
  projectId: "quiz-5b981",
  storageBucket: "quiz-5b981.firebasestorage.app",
  messagingSenderId: "276322600019",
  appId: "1:276322600019:web:a24f7c363f30422c04b2a6",
  measurementId: "G-RWHZ29GM5F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;