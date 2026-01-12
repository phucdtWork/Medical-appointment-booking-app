import { db } from "../config/firebase";
import { User } from "../models/User";

// Simple in-memory cache for doctors list to avoid repeating expensive reads
// Cache key is JSON.stringify(filters). TTL is short (30s) in dev; adjust as needed.
const doctorsCache: Map<string, { data: User[]; expiresAt: number }> =
  new Map();

export class DoctorService {
  async getDoctors(filters?: {
    specialization?: string;
    minRating?: number;
  }): Promise<User[]> {
    const cacheKey = JSON.stringify(filters || {});
    const cached = doctorsCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      console.log("doctorService.getDoctors: cache hit", cacheKey);
      return cached.data;
    }

    const start = Date.now();
    let query = db.collection("users").where("role", "==", "doctor");

    if (filters?.specialization) {
      query = query.where(
        "doctorInfo.specialization",
        "==",
        filters.specialization
      );
    }

    const snapshot = await query.get();

    let doctors = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];

    if (filters?.minRating) {
      doctors = doctors.filter(
        (doc) => doc.doctorInfo && doc.doctorInfo.rating >= filters.minRating!
      );
    }

    doctors.forEach((doc) => delete (doc as any).password);
    const duration = Date.now() - start;
    console.log(
      `doctorService.getDoctors: fetched ${doctors.length} doctors in ${duration}ms`
    );

    // store in cache for 30s
    doctorsCache.set(cacheKey, {
      data: doctors,
      expiresAt: Date.now() + 30_000,
    });

    return doctors;
  }

  // Get doctor by ID
  async getDoctorById(doctorId: string): Promise<User | null> {
    const doc = await db.collection("users").doc(doctorId).get();

    if (!doc.exists || doc.data()?.role !== "doctor") {
      return null;
    }

    const doctor = { id: doc.id, ...doc.data() } as User;
    delete (doctor as any).password;

    return doctor;
  }

  // Update doctor info
  async updateDoctor(
    doctorId: string,
    updateData: Partial<User>
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
        }) as User
    );
  }
}
