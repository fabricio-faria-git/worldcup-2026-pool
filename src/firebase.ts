import { initializeApp } from "firebase/app";

import {
  getAuth,
  browserLocalPersistence,
  setPersistence
} from "firebase/auth";

import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAeST1wZV6eQRPHhXpRMNcMim4haXTkOhI",
  authDomain: "worldcup-2026-pool.firebaseapp.com",
  projectId: "worldcup-2026-pool",
  storageBucket: "worldcup-2026-pool.firebasestorage.app",
  messagingSenderId: "631904897117",
  appId: "1:631904897117:web:7ee877c85d8537b59f65b4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);

export const db = getDatabase(app);