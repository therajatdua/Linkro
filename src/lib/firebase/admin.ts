import { cert, getApps, initializeApp, App, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

import { hasFirebaseAdminEnv } from "@/lib/env";

let app: App | null = null;

export function getFirebaseAdminApp() {
  if (app) {
    return app;
  }

  if (!getApps().length) {
    app = hasFirebaseAdminEnv
      ? initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        })
      : initializeApp({ credential: applicationDefault() });
  } else {
    app = getApps()[0] ?? null;
  }

  return app;
}

export const adminAuth = () => getAuth(getFirebaseAdminApp());
export const adminDb = () => getFirestore(getFirebaseAdminApp());
