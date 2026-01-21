import { db } from "../config/firebase";
import { User } from "../models/User";
import crypto from "crypto";

let Redis: any = null;
let redisClient: any = null;

const REDIS_URL = process.env.REDIS_URL || process.env.REDIS_HOST;
if (REDIS_URL) {
  try {
    Redis = require("ioredis");
    redisClient = new Redis(REDIS_URL);
    redisClient.on("error", (err: any) => console.warn("Redis error:", err));
  } catch (e) {
    console.warn("Failed to initialize Redis client", e);
    redisClient = null;
  }
}

// fallback in-memory cache (short TTL) if no Redis
const doctorsCache: Map<string, { data: User[]; expiresAt: number }> =
  new Map();

export class DoctorService {
  // Returns data plus ETag/lastModified metadata for HTTP caching
  async getDoctors(options?: {
    specialization?: string;
    minRating?: number;
    limit?: number;
    page?: number; // 1-based
    fields?: string[]; // Firestore select fields
  }): Promise<{
    data: User[];
    etag: string;
    lastModified: string;
    fromCache: boolean;
  }> {
    const filters = options || {};
    const limit = filters.limit ?? 30;
    const page = Math.max(1, options?.page ?? 1);
    const offset = (page - 1) * limit;

    const cacheKey = JSON.stringify({ ...filters, limit, page });

    // Try Redis cache first
    if (redisClient) {
      try {
        const cached = await redisClient.get(`doctors:${cacheKey}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          console.log("doctorService.getDoctors: redis cache hit", cacheKey);
          return {
            data: parsed.data,
            etag: parsed.etag,
            lastModified: parsed.lastModified,
            fromCache: true,
          };
        }
      } catch (e) {
        console.warn("Redis get failed", e);
      }
    }

    // In-memory fallback
    const memCached = doctorsCache.get(cacheKey);
    if (memCached && memCached.expiresAt > Date.now()) {
      console.log("doctorService.getDoctors: mem cache hit", cacheKey);
      const data = memCached.data;
      const etag = crypto
        .createHash("md5")
        .update(JSON.stringify(data))
        .digest("hex");
      return {
        data,
        etag,
        lastModified: new Date().toUTCString(),
        fromCache: true,
      };
    }

    const start = Date.now();
    let query: FirebaseFirestore.Query = db
      .collection("users")
      .where("role", "==", "doctor");

    // Apply filters carefully
    if (filters.specialization && filters.specialization.trim()) {
      query = query.where(
        "doctorInfo.specialization",
        "==",
        filters.specialization.trim(),
      );
    }

    if (typeof filters.minRating === "number" && filters.minRating > 0) {
      query = query.where("doctorInfo.rating", ">=", filters.minRating);
    }

    // Apply pagination with limit
    let q = query.limit(limit) as FirebaseFirestore.Query;

    // Try to apply offset if supported
    if (offset > 0 && typeof (q as any).offset === "function") {
      q = (q as any).offset(offset);
    }

    try {
      const snapshot = await q.get();

      const doctors = snapshot.docs.map((doc) => {
        const data = doc.data() as any;
        const user = { id: doc.id, ...data } as User;
        delete (user as any).password;
        return user;
      }) as User[];

      const duration = Date.now() - start;
      console.log(
        `doctorService.getDoctors: fetched ${doctors.length} doctors in ${duration}ms`,
      );

      const etag = crypto
        .createHash("md5")
        .update(JSON.stringify(doctors))
        .digest("hex");
      const lastModified = new Date().toUTCString();

      // Cache result
      const ttlSeconds = parseInt(process.env.DOCTORS_CACHE_TTL || "30", 10);
      const payload = JSON.stringify({ data: doctors, etag, lastModified });

      if (redisClient) {
        try {
          await redisClient.setex(`doctors:${cacheKey}`, ttlSeconds, payload);
        } catch (e) {
          console.warn("Redis set failed", e);
        }
      } else {
        doctorsCache.set(cacheKey, {
          data: doctors,
          expiresAt: Date.now() + ttlSeconds * 1000,
        });
      }

      return { data: doctors, etag, lastModified, fromCache: false };
    } catch (error: any) {
      console.error("Error fetching doctors from Firestore:", error.message);

      // Fallback: fetch all doctors without composite index filters
      // and filter in-memory if complex filters fail
      try {
        console.log(
          "Attempting fallback - fetching all doctors without filters",
        );
        const simpleQuery = db
          .collection("users")
          .where("role", "==", "doctor")
          .limit(100);

        const snapshot = await simpleQuery.get();

        let doctors = snapshot.docs.map((doc) => {
          const data = doc.data() as any;
          const user = { id: doc.id, ...data } as User;
          delete (user as any).password;
          return user;
        }) as User[];

        // Apply in-memory filters
        if (filters.specialization && filters.specialization.trim()) {
          doctors = doctors.filter(
            (d) =>
              d.doctorInfo?.specialization === filters.specialization?.trim(),
          );
        }

        if (typeof filters.minRating === "number" && filters.minRating > 0) {
          doctors = doctors.filter(
            (d) => (d.doctorInfo?.rating ?? 0) >= (filters.minRating ?? 0),
          );
        }

        // Apply pagination in-memory
        const paginatedDoctors = doctors.slice(offset, offset + limit);

        const duration = Date.now() - start;
        console.log(
          `doctorService.getDoctors (fallback): returned ${paginatedDoctors.length} doctors in ${duration}ms`,
        );

        const etag = crypto
          .createHash("md5")
          .update(JSON.stringify(paginatedDoctors))
          .digest("hex");
        const lastModified = new Date().toUTCString();

        return { data: paginatedDoctors, etag, lastModified, fromCache: false };
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        throw new Error(
          `Failed to fetch doctors: ${error.message || "Unknown error"}`,
        );
      }
    }
  }

  // Get doctor by ID
  async getDoctorById(doctorId: string): Promise<User | null> {
    try {
      const doc = await db.collection("users").doc(doctorId).get();

      if (!doc.exists || doc.data()?.role !== "doctor") {
        return null;
      }

      const doctor = { id: doc.id, ...doc.data() } as User;
      delete (doctor as any).password;

      return doctor;
    } catch (error) {
      console.error("Error fetching doctor by ID:", error);
      throw error;
    }
  }

  // Update doctor info
  async updateDoctor(
    doctorId: string,
    updateData: Partial<User>,
  ): Promise<User> {
    const docRef = db.collection("users").doc(doctorId);

    await docRef.update({
      ...updateData,
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();
    const doctor = { id: updatedDoc.id, ...updatedDoc.data() } as User;
    delete (doctor as any).password;

    return doctor;
  }

  // Add a new doctor
  static async addDoctor(doctorData: Partial<User>): Promise<User> {
    const docRef = await db.collection("users").add({
      ...doctorData,
      role: "doctor",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...doctorData } as User;
  }

  // add many doctors
  async addManyDoctors(doctorsData: Partial<User>[]): Promise<User[]> {
    const batch = db.batch();
    const doctorRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[] =
      [];
    doctorsData.forEach((doctorData) => {
      const docRef = db.collection("users").doc();
      batch.set(docRef, {
        ...doctorData,
        role: "doctor",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      doctorRefs.push(docRef);
    });
    await batch.commit();
    return doctorRefs.map(
      (ref, index) =>
        ({
          id: ref.id,
          ...doctorsData[index],
        }) as User,
    );
  }
}
