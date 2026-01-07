import { db } from "../config/firebase";
import { Review, ReviewCreate } from "../models/Review";

export class ReviewService {
  async createReview(data: ReviewCreate): Promise<Review> {
    const newReview: Review = {
      doctorId: data.doctorId,
      patientId: data.patientId,
      appointmentId: data.appointmentId,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date(),
    };

    const docRef = await db.collection("reviews").add(newReview);

    // Update doctor's aggregated rating (incremental)
    const doctorRef = db.collection("users").doc(data.doctorId);
    const doctorDoc = await doctorRef.get();

    if (doctorDoc.exists) {
      const docData: any = doctorDoc.data();
      const doctorInfo = docData.doctorInfo || {};
      const prevTotal = doctorInfo.totalReviews || 0;
      const prevRating = doctorInfo.rating || 0;

      const newTotal = prevTotal + 1;
      const newRating = (prevRating * prevTotal + data.rating) / newTotal;

      await doctorRef.update({
        doctorInfo: {
          ...doctorInfo,
          totalReviews: newTotal,
          rating: Number(newRating.toFixed(2)),
        },
      });
    }

    return { id: docRef.id, ...newReview } as Review;
  }

  async getReviewsByDoctor(doctorId: string): Promise<Review[]> {
    const snapshot = await db
      .collection("reviews")
      .where("doctorId", "==", doctorId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as Review[];
  }
}
