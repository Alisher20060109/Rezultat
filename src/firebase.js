import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SENING_API_KEY",
  authDomain: "rezultat-6c10e.firebaseapp.com",
  projectId: "rezultat-6c10e",
  storageBucket: "rezultat-6c10e.firebasestorage.app",
  messagingSenderId: "514521840310",
  appId: "1:514521840310:web:a5f17eec824f88b8ea4417",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);