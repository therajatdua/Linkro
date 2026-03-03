import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";

import { hasFirebaseClientEnv } from "@/lib/env";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyA33-Y8_ctDLFSEagG1ffPEOv3BoDCYdq4",
  authDomain: "linkro-320e5.firebaseapp.com",
  projectId: "linkro-320e5",
  storageBucket: "linkro-320e5.firebasestorage.app",
  messagingSenderId: "825553538676",
  appId: "1:825553538676:web:88bc2822f4ba72ee4a4b21",
  measurementId: "G-MMBP8KL57Q",
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? fallbackFirebaseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? fallbackFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? fallbackFirebaseConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? fallbackFirebaseConfig.storageBucket,
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? fallbackFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? fallbackFirebaseConfig.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? fallbackFirebaseConfig.measurementId,
};

const app = hasFirebaseClientEnv || Boolean(fallbackFirebaseConfig.apiKey)
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseApp = app;
export const firebaseAuth = app ? getAuth(app) : null;
export const firestore = app ? getFirestore(app) : null;
export const firebaseStorage = app ? getStorage(app) : null;

export async function initFirebaseAnalytics() {
  if (!app || typeof window === "undefined") {
    return null;
  }

  const supported = await analyticsSupported();
  if (!supported) {
    return null;
  }

  return getAnalytics(app);
}
