import { db } from "../src/config/firebase";

const seedDoctors = async () => {
  const doctorsData = [
    {
      email: "doctor1@example.com",
      password: "hashed_password",
      fullName: "Dr. Nguyen Van A",
      phone: "0987654321",
      role: "doctor",
      avatar:
        "https://ui-avatars.com/api/?name=Dr+Nguyen+Van+A&background=0D8ABC&color=fff",
      address: "123 Main Street, Ho Chi Minh City",
      doctorInfo: {
        specialization: "Cardiology",
        licenseNumber: "DL001",
        yearsOfExperience: 10,
        education: [
          "Bachelor of Medicine - HCMC University",
          "Master of Cardiology - Singapore",
        ],
        hospital: "Central Hospital",
        consultationFee: {
          min: 150000,
          max: 500000,
        },
        bio: "Experienced cardiologist with 10 years of practice. Specialized in treating heart diseases.",
        rating: 4.8,
        totalReviews: 125,
        totalPatients: 500,
      },
    },
    {
      email: "doctor2@example.com",
      password: "hashed_password",
      fullName: "Dr. Tran Thi B",
      phone: "0912345678",
      role: "doctor",
      avatar:
        "https://ui-avatars.com/api/?name=Dr+Tran+Thi+B&background=0D8ABC&color=fff",
      address: "456 Oak Avenue, Ha Noi",
      doctorInfo: {
        specialization: "Pediatrics",
        licenseNumber: "DL002",
        yearsOfExperience: 8,
        education: [
          "Bachelor of Medicine - Ha Noi University",
          "Pediatrics Certification - WHO",
        ],
        hospital: "Children's Hospital",
        consultationFee: {
          min: 100000,
          max: 300000,
        },
        bio: "Dedicated pediatrician caring for children with compassion and expertise.",
        rating: 4.9,
        totalReviews: 98,
        totalPatients: 450,
      },
    },
    {
      email: "doctor3@example.com",
      password: "hashed_password",
      fullName: "Dr. Pham Van C",
      phone: "0901234567",
      role: "doctor",
      avatar:
        "https://ui-avatars.com/api/?name=Dr+Pham+Van+C&background=0D8ABC&color=fff",
      address: "789 Pine Road, Da Nang",
      doctorInfo: {
        specialization: "Orthopedics",
        licenseNumber: "DL003",
        yearsOfExperience: 12,
        education: [
          "Bachelor of Medicine - Da Nang University",
          "Orthopedic Surgery - Japan",
        ],
        hospital: "Orthopedic Specialty Center",
        consultationFee: {
          min: 200000,
          max: 600000,
        },
        bio: "Orthopedic surgeon specializing in joint replacement and sports medicine.",
        rating: 4.7,
        totalReviews: 112,
        totalPatients: 600,
      },
    },
    {
      email: "doctor4@example.com",
      password: "hashed_password",
      fullName: "Dr. Le Thi D",
      phone: "0923456789",
      role: "doctor",
      avatar:
        "https://ui-avatars.com/api/?name=Dr+Le+Thi+D&background=0D8ABC&color=fff",
      address: "321 Elm Street, Can Tho",
      doctorInfo: {
        specialization: "Dermatology",
        licenseNumber: "DL004",
        yearsOfExperience: 7,
        education: [
          "Bachelor of Medicine - Can Tho University",
          "Dermatology - South Korea",
        ],
        hospital: "Skin Care Clinic",
        consultationFee: {
          min: 80000,
          max: 250000,
        },
        bio: "Dermatologist providing comprehensive skin care treatments.",
        rating: 4.6,
        totalReviews: 87,
        totalPatients: 350,
      },
    },
    {
      email: "doctor5@example.com",
      password: "hashed_password",
      fullName: "Dr. Hoang Van E",
      phone: "0934567890",
      role: "doctor",
      avatar:
        "https://ui-avatars.com/api/?name=Dr+Hoang+Van+E&background=0D8ABC&color=fff",
      address: "654 Maple Drive, Hai Phong",
      doctorInfo: {
        specialization: "Neurology",
        licenseNumber: "DL005",
        yearsOfExperience: 11,
        education: [
          "Bachelor of Medicine - Hai Phong University",
          "Neurology - Germany",
        ],
        hospital: "Neuroscience Center",
        consultationFee: {
          min: 180000,
          max: 550000,
        },
        bio: "Neurologist specializing in diagnosis and treatment of nervous system disorders.",
        rating: 4.8,
        totalReviews: 105,
        totalPatients: 480,
      },
    },
  ];

  try {
    console.log("Seeding doctors...");

    const batch = db.batch();

    doctorsData.forEach((doctorData) => {
      const docRef = db.collection("users").doc();
      batch.set(docRef, {
        ...doctorData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await batch.commit();
    console.log(`Successfully seeded ${doctorsData.length} doctors`);
  } catch (error) {
    console.error("Error seeding doctors:", error);
  }
};

// Run the seed
seedDoctors()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
