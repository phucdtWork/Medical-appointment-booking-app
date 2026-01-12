import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function validateConfig(cfg: any) {
  if (!cfg.apiKey) return "NEXT_PUBLIC_FIREBASE_API_KEY";
  if (!cfg.authDomain) return "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN";
  if (!cfg.projectId) return "NEXT_PUBLIC_FIREBASE_PROJECT_ID";
  if (!cfg.appId) return "NEXT_PUBLIC_FIREBASE_APP_ID";
  return null;
}

export function initFirebase() {
  const missing = validateConfig(firebaseConfig);
  if (missing) {
    throw new Error(
      `Missing Firebase client env var: ${missing}. Add it to frontend/.env.local and restart the dev server.`
    );
  }

  if (!getApps().length) {
    initializeApp(firebaseConfig as any);
  }
  return getAuth();
}

export function getFirebaseAuth() {
  // Ensure Firebase app is initialized before returning auth instance
  if (!getApps().length) initFirebase();
  return getAuth();
}

export default getFirebaseAuth;
