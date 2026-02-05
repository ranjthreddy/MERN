import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCkxkakUEaPxLyOqgR71xebnpz1CBa_tgA",
  authDomain: "journal-8c65e.firebaseapp.com",
  projectId: "journal-8c65e",
  storageBucket: "journal-8c65e.firebasestorage.app",
  messagingSenderId: "50313048990",
  appId: "1:50313048990:web:732a86e4a7a6bea0a8dc8f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);