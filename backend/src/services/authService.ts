import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";
import { User } from "../models/User";
import { uploadAvatar } from "../config/multer";
import uploadService, { UploadService } from "./uploadService";

export class AuthService {
  // Register Patient
  async registerPatient(
    userData: Partial<User>
  ): Promise<{ token: string; user: User }> {
    const { email, password, fullName, phone } = userData;

    // Check if user exists
    const usersRef = db.collection("users");
    const existingUser = await usersRef.where("email", "==", email).get();

    if (!existingUser.empty) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password!, 10);

    // Create user
    const newUserData = {
      email,
      password: hashedPassword,
      fullName,
      phone,
      role: "patient" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await usersRef.add(newUserData);
    const userId = docRef.id;

    // Generate JWT
    const token = this.generateToken(userId, email!, "patient");

    // Build user object to return (remove password)
    const userWithId = { id: userId, ...newUserData } as User;
    delete (userWithId as any).password;

    return { token, user: userWithId };
  }

  // Login
  async login(
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      throw new Error("Invalid credentials");
    }

    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as User;

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = this.generateToken(user.id!, user.email, user.role);

    delete (user as any).password;

    return { token, user };
  }

  private generateToken(userId: string, email: string, role: string): string {
    const secretEnv = process.env.JWT_SECRET;
    if (!secretEnv) {
      throw new Error("JWT_SECRET is not configured in environment variables");
    }
    const secret: Secret = secretEnv;

    const expiresInSeconds = this.parseExpiresToSeconds(
      process.env.JWT_EXPIRE || "7d"
    );
    const options: SignOptions = {
      expiresIn: expiresInSeconds,
      algorithm: "HS256",
    };

    try {
      return jwt.sign({ userId, email, role }, secret, options);
    } catch (error) {
      console.error("JWT signing error:", error);
      throw new Error("Failed to generate authentication token");
    }
  }

  private parseExpiresToSeconds(value: string): number {
    if (/^\d+$/.test(value)) return Number(value);
    const m = value.match(/^(\d+)\s*([smhdw])$/i);
    if (!m)
      throw new Error(
        "Invalid JWT_EXPIRE format. Use e.g. 7d, 12h, 30m, 10s or seconds."
      );
    const amount = parseInt(m[1], 10);
    const unit = m[2].toLowerCase();
    const factors = { s: 1, m: 60, h: 3600, d: 86400, w: 604800 } as const;
    return amount * factors[unit as keyof typeof factors];
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    const doc = await db.collection("users").doc(userId).get();

    if (!doc.exists) {
      return null;
    }

    const user = { id: doc.id, ...doc.data() } as User;
    delete (user as any).password;

    return user;
  }

  // Google sign-in / register (accepts Firebase ID token)
  async googleSignIn(idToken: string): Promise<{ token: string; user: User }> {
    // verify idToken with Firebase Admin
    const decoded = await auth.verifyIdToken(idToken);

    const email = decoded.email;
    const fullName =
      (decoded.name as string) || (email ? email.split("@")[0] : "");
    const avatar = decoded.picture as string | undefined;

    if (!email) {
      throw new Error("Google token does not contain email");
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const user = { id: userDoc.id, ...userDoc.data() } as User;
      delete (user as any).password;

      const token = this.generateToken(user.id!, user.email, user.role);
      return { token, user };
    }

    // create new patient user
    const newUserData = {
      email,
      password: "",
      fullName,
      phone: "",
      role: "patient" as const,
      avatar: avatar || process.env.DEFAULT_AVATAR_URL,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await usersRef.add(newUserData);
    const userId = docRef.id;

    const token = this.generateToken(userId, email, "patient");

    const userWithId = { id: userId, ...newUserData } as User;
    delete (userWithId as any).password;

    return { token, user: userWithId };
  }

  // Edit user profile
  async editUserProfile(
    userId: string,
    updateData: Partial<User>
  ): Promise<User> {
    const docRef = db.collection("users").doc(userId);

    // Check if user exists
    const userDoc = await docRef.get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const updates: Partial<User> & { updatedAt: Date } = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Remove fields that shouldn't be updated
    delete (updates as any).id;
    delete (updates as any).password;
    delete (updates as any).email;
    delete (updates as any).role;
    delete (updates as any).createdAt;

    await docRef.update(updates);

    const updatedDoc = await docRef.get();
    const updatedUser = { id: updatedDoc.id, ...updatedDoc.data() } as User;
    delete (updatedUser as any).password;

    return updatedUser;
  }
}
