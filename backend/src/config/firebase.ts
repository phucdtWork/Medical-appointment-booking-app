import admin from "firebase-admin";
import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";

privateKey = privateKey.replace(/\\n/g, "\n");

const serviceAccount = {
  private_key: privateKey,
  project_id: process.env.FIREBASE_PROJECT_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
