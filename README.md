# 🏥 Medical Appointment Booking App

> A comprehensive full-stack medical appointment booking platform that bridges the gap between patients and healthcare providers. Features real-time scheduling, AI-powered health insights, multi-language support, and secure authentication with an intuitive user experience for seamless healthcare management.

![App Screenshot](./screenshort.png)

---

## 📋 Quick Links

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)

---

## 🌐 Live Demo

🔗 **[Medical Appointment Booking App](https://medical-appointment-booking-app-fro.vercel.app)**

> Live application is now deployed and ready to use!

---

## ✨ Key Features

### Patient Features

- 🔍 Search & filter doctors by specialization, rating, experience
- 📅 Book, reschedule & cancel appointments
- 📱 View appointment history & manage bookings

### Doctor Features

- 🗓️ Manage work schedule & blocked dates
- 📅 View & confirm patient appointments
- 📈 Access appointment analytics

### General Features

- 🌍 Multi-language support (Vietnamese & English)
- 📋 Manage profile
- 🔐 Secure authentication (Email/Password + Google OAuth)
- 🎨 Dark/Light mode toggle
- 📱 Fully responsive design
- 💬 Chat to ask about app features
- 🤖 AI-powered weight loss plan generator (input health data → receive personalized plan)

---

## 🛠 Tech Stack

**Frontend**

- Next.js 14+ | React 18+ | TypeScript
- Tailwind CSS | Ant Design | React Query
- next-intl | Firebase Auth | Dayjs

**Backend**

- Node.js + Express | TypeScript
- Firebase Realtime Database & Admin SDK
- JWT Authentication | Nodemailer | Cloudinary

**Database**

- Firebase Realtime Database | Cloudinary Storage

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install

# Create .env file with your credentials
npm run dev
# Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file with your credentials
npm run dev
# Runs on http://localhost:3000
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# JWT & Security
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_password
EMAIL_FROM_NAME=Medibook Support

# Google OAuth
FIREBASE_CLIENT_ID=your_google_client_id
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🎯 Running the App

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

---

## 🔑 Test Account

**Doctor Account:**

- Email: dr.nguyen.lan@hospital.vn
- Password: 123456

---

## 📁 Project Structure

```
medical-appointment-booking-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, error handling
│   │   └── config/          # Firebase, Cloudinary configs
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── types/          # TypeScript types
│   │   ├── messages/       # i18n translations
│   │   └── lib/            # Utilities
│   └── package.json
│
└── README.md
```

---

## 📡 Key API Endpoints

```
# Authentication
POST   /api/auth/register/request-otp
POST   /api/auth/register/verify-otp
POST   /api/auth/login
POST   /api/auth/google

# Doctors
GET    /api/doctors
GET    /api/doctors/:id
GET    /api/doctors/search

# Appointments
GET    /api/appointments/my
POST   /api/appointments
PATCH  /api/appointments/:id/status

# Schedules
GET    /api/schedules/doctor/:doctorId
POST   /api/schedules

# Reviews
GET    /api/reviews/doctor/:doctorId
POST   /api/reviews
```

---

## 🛡️ Security

- ✅ JWT Authentication
- ✅ Google OAuth
- ✅ CORS Protection
- ✅ Helmet Security Headers
- ✅ Input Validation
- ✅ Firebase Security Rules

---

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

---
