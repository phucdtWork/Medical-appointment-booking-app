import admin from "firebase-admin";
import path from "path";
import dotenv from "dotenv";

// Only load .env in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
  });
}

let serviceAccount: any;

console.log("[Firebase Config] NODE_ENV:", process.env.NODE_ENV);
console.log(
  "[Firebase Config] FIREBASE_SERVICE_ACCOUNT exists:",
  !!process.env.FIREBASE_SERVICE_ACCOUNT,
);
console.log(
  "[Firebase Config] FIREBASE_PROJECT_ID:",
  process.env.FIREBASE_PROJECT_ID ? "exists" : "MISSING",
);
console.log(
  "[Firebase Config] FIREBASE_PRIVATE_KEY:",
  process.env.FIREBASE_PRIVATE_KEY
    ? "exists (length: " + process.env.FIREBASE_PRIVATE_KEY.length + ")"
    : "MISSING",
);
console.log(
  "[Firebase Config] FIREBASE_CLIENT_EMAIL:",
  process.env.FIREBASE_CLIENT_EMAIL ? "exists" : "MISSING",
);

// Try to use full JSON first (Railway), then individual env vars (local)
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log("[Firebase Config] Loaded FIREBASE_SERVICE_ACCOUNT JSON");
  } catch (e) {
    console.error(
      "[Firebase Config] Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:",
      e,
    );
  }
} else {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY || "";
  privateKey = privateKey.replace(/\\n/g, "\n");

  serviceAccount = {
    private_key: privateKey,
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };
  console.log("[Firebase Config] Using individual env vars");
}

console.log(
  "[Firebase Config] serviceAccount.project_id:",
  serviceAccount?.project_id ? "exists" : "MISSING",
);
console.log(
  "[Firebase Config] serviceAccount.private_key:",
  serviceAccount?.private_key
    ? "exists (length: " + serviceAccount.private_key.length + ")"
    : "MISSING",
);
console.log(
  "[Firebase Config] serviceAccount.client_email:",
  serviceAccount?.client_email ? "exists" : "MISSING",
);

// Validate serviceAccount has required fields
if (
  serviceAccount &&
  serviceAccount.project_id &&
  serviceAccount.private_key &&
  serviceAccount.client_email
) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }
} else {
  console.error(
    "Firebase credentials are not properly configured. Missing: project_id, private_key, or client_email",
  );
  console.error("Please set FIREBASE_SERVICE_ACCOUNT or individual env vars");
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
