import { db } from "../config/firebase";
import { User } from "../models/User";

export class DoctorService {
  // Get all doctors with filters
  async getDoctors(filters?: {
    specialization?: string;
    minRating?: number;
  }): Promise<User[]> {
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

    // Filter by rating (client-side because Firestore limitations)
    if (filters?.minRating) {
      doctors = doctors.filter(
        (doc) => doc.doctorInfo && doc.doctorInfo.rating >= filters.minRating!
      );
    }

    // Remove passwords
    doctors.forEach((doc) => delete (doc as any).password);

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
        } as User)
    );
  }
}
