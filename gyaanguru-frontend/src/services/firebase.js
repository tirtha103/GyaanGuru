import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuZaewcbVJOkWa7_HpuGQlt8OEREyNbeQ",
  authDomain: "gyanguru-918c7.firebaseapp.com",
  projectId: "gyanguru-918c7",
  storageBucket: "gyanguru-918c7.firebasestorage.app",
  messagingSenderId: "768807164996",
  appId: "1:768807164996:web:bf9b0be509f27c262b7011",
  measurementId: "G-3R8SRPC2X0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;