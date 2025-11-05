import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { db } from "../config/firebase";
import { User } from "../models/User";

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

    // Hash password
    const hashedPassword = await bcrypt.hash(password!, 10);

    // Create user
    const newUser: Omit<User, "id"> = {
      email: email!,
      password: hashedPassword,
      fullName: fullName!,
      phone: phone!,
      role: "patient",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await usersRef.add(newUser);
    const userId = docRef.id;

    // Generate JWT
    const token = this.generateToken(userId, email!, "patient");

    const userWithId = { ...newUser, id: userId };
    delete (userWithId as any).password;

    return { token, user: userWithId as User };
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
}
