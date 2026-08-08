import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsPOiWCVu1QlPtd5UmQup4torK25KkjPw",
  authDomain: "finora-98ca3.firebaseapp.com",
  projectId: "finora-98ca3",
  storageBucket: "finora-98ca3.firebasestorage.app",
  messagingSenderId: "744491484330",
  appId: "1:744491484330:web:988c0fc368e7d6c3563cd3",
  measurementId: "G-5F92T09KSD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);