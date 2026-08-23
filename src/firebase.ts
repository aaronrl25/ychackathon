import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDWpoJNKz5bQgsd151gfSiJ2zvwi7t8qbI",
  authDomain: "takeda-5ad2e.firebaseapp.com",
  projectId: "takeda-5ad2e",
  storageBucket: "takeda-5ad2e.appspot.com",
  messagingSenderId: "561533153430",
  appId: "1:561533153430:web:4213f051a3c0f4fb8f92b7",
  measurementId: "G-ZZZ8PL37PW",
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);
const app = isFirebaseConfigured ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

if (app) {
  void isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}
