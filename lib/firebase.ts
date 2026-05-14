import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyxvPrzYUop533mDAQO3C-Mu6_8hGqlfE",
  authDomain: "yumachan-app.firebaseapp.com",
  projectId: "yumachan-app",
  storageBucket: "yumachan-app.firebasestorage.app",
  messagingSenderId: "949215886768",
  appId: "1:949215886768:web:d98b322abda242b91fea75",
  measurementId: "G-VS3ZCVX2QT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

auth.useDeviceLanguage();

setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app);