// services/otpService.ts
import { db } from "../config/firebase";
import crypto from "crypto";
import type { Timestamp } from "firebase-admin/firestore";

interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: Date | Timestamp;
  attempts: number;
  resendCount: number;
  lastResendAt: Date | Timestamp;
  createdAt: Date | Timestamp;
}

export class OTPService {
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly MAX_ATTEMPTS = 5;
  private readonly MAX_RESEND_PER_DAY = 3;
  private readonly RESEND_COUNTDOWN_SECONDS = 60;

  // Generate 6-digit OTP
  generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Create and store OTP
  async createOTP(email: string): Promise<string> {
    const otpRef = db.collection("email_verifications");

    // Check existing OTP
    const existingSnapshot = await otpRef
      .where("email", "==", email)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      const existingDoc = existingSnapshot.docs[0];
      const existingData = existingDoc.data() as OTPRecord;

      // Convert Firestore Timestamp to Date
      const lastResendDate =
        existingData.lastResendAt instanceof Date
          ? existingData.lastResendAt
          : (existingData.lastResendAt as any).toDate();

      // Check resend countdown
      const countDownEnd = new Date(
        lastResendDate.getTime() + this.RESEND_COUNTDOWN_SECONDS * 1000,
      );

      if (new Date() < countDownEnd) {
        const remainingSeconds = Math.ceil(
          (countDownEnd.getTime() - new Date().getTime()) / 1000,
        );
        throw new Error(
          `Please wait ${remainingSeconds} seconds before requesting a new OTP`,
        );
      }

      // Convert createdAt to Date for comparison
      const createdAtDate =
        existingData.createdAt instanceof Date
          ? existingData.createdAt
          : (existingData.createdAt as any).toDate();

      // Delete old OTP
      await existingDoc.ref.delete();
    }

    // Generate new OTP
    const otp = this.generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + this.OTP_EXPIRY_MINUTES);

    const otpRecord: OTPRecord = {
      email,
      otp,
      expiresAt,
      attempts: 0,
      resendCount: existingSnapshot.empty
        ? 0
        : (existingSnapshot.docs[0].data() as OTPRecord).resendCount + 1,
      lastResendAt: new Date(),
      createdAt: new Date(),
    };

    await otpRef.add(otpRecord);

    return otp;
  }

  // Verify OTP
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const otpRef = db.collection("email_verifications");

    const snapshot = await otpRef
      .where("email", "==", email)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error("OTP not found. Please request a new one.");
    }

    const otpDoc = snapshot.docs[0];
    const otpData = otpDoc.data() as OTPRecord;

    // Convert Firestore Timestamp to Date
    const expiresAtDate =
      otpData.expiresAt instanceof Date
        ? otpData.expiresAt
        : (otpData.expiresAt as any).toDate();

    // Check if OTP expired
    if (new Date() > expiresAtDate) {
      await otpDoc.ref.delete();
      throw new Error("OTP has expired. Please request a new one.");
    }

    // Check max attempts
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      await otpDoc.ref.delete();
      throw new Error(
        `Maximum verification attempts (${this.MAX_ATTEMPTS}) exceeded. Please request a new OTP.`,
      );
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      // Increment attempts
      await otpDoc.ref.update({
        attempts: otpData.attempts + 1,
      });

      const remainingAttempts = this.MAX_ATTEMPTS - (otpData.attempts + 1);
      throw new Error(
        `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
      );
    }

    // OTP is valid - delete it
    await otpDoc.ref.delete();
    return true;
  }

  // Validate OTP without deleting it (for password reset)
  async validateOTP(email: string, otp: string): Promise<boolean> {
    const otpRef = db.collection("email_verifications");

    const snapshot = await otpRef
      .where("email", "==", email)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error("OTP not found. Please request a new one.");
    }

    const otpData = snapshot.docs[0].data() as OTPRecord;

    // Convert Firestore Timestamp to Date
    const expiresAtDate =
      otpData.expiresAt instanceof Date
        ? otpData.expiresAt
        : (otpData.expiresAt as any).toDate();

    // Check if OTP expired
    if (new Date() > expiresAtDate) {
      await snapshot.docs[0].ref.delete();
      throw new Error("OTP has expired. Please request a new one.");
    }

    // Check max attempts
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      await snapshot.docs[0].ref.delete();
      throw new Error(
        `Maximum verification attempts (${this.MAX_ATTEMPTS}) exceeded. Please request a new OTP.`,
      );
    }

    // Validate OTP
    if (otpData.otp !== otp) {
      throw new Error("Invalid OTP.");
    }

    return true;
  }

  // Delete OTP (cleanup)
  async deleteOTP(email: string): Promise<void> {
    const otpRef = db.collection("email_verifications");
    const snapshot = await otpRef.where("email", "==", email).get();

    const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);
  }

  // Get remaining countdown time
  async getRemainingCountdown(email: string): Promise<number> {
    const otpRef = db.collection("email_verifications");
    const snapshot = await otpRef
      .where("email", "==", email)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return 0;
    }

    const otpData = snapshot.docs[0].data() as OTPRecord;

    // Convert Firestore Timestamp to Date
    const lastResendDate =
      otpData.lastResendAt instanceof Date
        ? otpData.lastResendAt
        : (otpData.lastResendAt as any).toDate();

    const countdownEnd = new Date(
      lastResendDate.getTime() + this.RESEND_COUNTDOWN_SECONDS * 1000,
    );

    const remaining = Math.ceil(
      (countdownEnd.getTime() - new Date().getTime()) / 1000,
    );

    return remaining > 0 ? remaining : 0;
  }
}
