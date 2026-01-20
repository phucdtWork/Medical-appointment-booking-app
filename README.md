# 🏥 Medical Appointment Booking App

> A modern, full-stack medical appointment booking system built with cutting-edge technologies. Connects patients and doctors for seamless healthcare appointment management.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Technical Stack](#-technical-stack)
- [Key Features](#-key-features)
- [Features by Role](#-features-by-role)
- [Key Highlights](#-key-highlights)
- [How to Run](#-how-to-run)
- [Environment Variables](#-environment-variables)
- [Test Credentials](#-test-credentials)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)

---

## 🎯 Overview

Medical Appointment Booking App is a comprehensive healthcare management platform that enables:

- **Patients** to search for doctors, book appointments, write reviews, and manage their medical profile
- **Doctors** to manage schedules, view appointments, interact with patients, and build their professional reputation
- **Real-time updates** with WebSocket for live appointment status notifications
- **Multi-language support** (Vietnamese & English) for global accessibility
- **Secure authentication** with JWT tokens and Google OAuth integration
- **Advanced search & filtering** to find the right doctor quickly

---

## 🛠 Technical Stack

### Frontend

| Technology            | Purpose                               | Version               |
| --------------------- | ------------------------------------- | --------------------- |
| **Next.js 14+**       | React framework with SSR & App Router | Latest                |
| **React 18+**         | UI library                            | 18+                   |
| **TypeScript**        | Type safety                           | 5+                    |
| **Tailwind CSS**      | Utility-first CSS styling             | 3+                    |
| **Ant Design (AntD)** | Component library                     | 5+                    |
| **React Query**       | Server state management & caching     | @tanstack/react-query |
| **Socket.io Client**  | Real-time WebSocket communication     | Latest                |
| **next-intl**         | Internationalization (i18n)           | Latest                |
| **Firebase Auth**     | Authentication & ID tokens            | Latest                |
| **Dayjs**             | Date/time manipulation                | Latest                |
| **Axios**             | HTTP client for API calls             | Latest                |

### Backend

| Technology                     | Purpose                                  | Version |
| ------------------------------ | ---------------------------------------- | ------- |
| **Node.js + Express**          | Server framework                         | 18+     |
| **TypeScript**                 | Type safety                              | 5+      |
| **Firebase Realtime Database** | NoSQL cloud database                     | Latest  |
| **Firebase Admin SDK**         | Backend Firebase integration             | Latest  |
| **JWT (jsonwebtoken)**         | Authentication tokens                    | Latest  |
| **Nodemailer**                 | Email notifications (OTP, confirmations) | Latest  |
| **Multer**                     | File upload handling                     | Latest  |
| **Cloudinary**                 | Cloud storage for images/documents       | Latest  |
| **Socket.io**                  | Real-time bi-directional communication   | Latest  |
| **Helmet**                     | Security headers middleware              | Latest  |
| **CORS**                       | Cross-origin request handling            | Latest  |
| **Morgan**                     | HTTP request logging                     | Latest  |

### Database

| Service                        | Purpose                                                  |
| ------------------------------ | -------------------------------------------------------- |
| **Firebase Realtime Database** | Primary NoSQL database for all entities                  |
| **Cloudinary**                 | Cloud storage for avatars, certificates, medical records |

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- ✅ Email/Password registration with OTP verification
- ✅ Google OAuth integration (Sign in with Google)
- ✅ JWT token-based authentication
- ✅ Role-based access control (Patient/Doctor)
- ✅ Automatic token refresh & session management

### 👥 User Management

- ✅ User profile management with avatar upload
- ✅ Two-factor authentication support (OTP)
- ✅ Account settings & preferences
- ✅ Profile completion tracking

### 🏥 Doctor Features

- ✅ Detailed doctor profiles with credentials
- ✅ Specialization categorization
- ✅ Consultation fee management (min/max)
- ✅ Professional information (education, experience, bio)
- ✅ Doctor ratings & reviews

### 📅 Appointment Management

- ✅ Advanced appointment booking system
- ✅ Real-time slot availability
- ✅ Appointment status tracking (Pending, Confirmed, Completed, Cancelled)
- ✅ Doctor notes & patient notes on appointments
- ✅ Appointment history & analytics
- ✅ Appointment cancellation & rescheduling
- ✅ Real-time appointment updates via WebSocket

### 🗓️ Schedule Management (Doctor Only)

- ✅ Doctor schedule creation & management
- ✅ Daily time slot configuration
- ✅ Block dates for unavailability
- ✅ Real-time schedule synchronization
- ✅ Schedule templates

### ⭐ Review System

- ✅ Patient reviews for doctors
- ✅ 5-star rating system
- ✅ Rich comment support
- ✅ Review editing & deletion
- ✅ Review moderation

### 🔍 Search & Discovery

- ✅ Advanced doctor search by specialization
- ✅ Filter by rating, experience, consultation fee
- ✅ Doctor recommendation algorithm
- ✅ Search history tracking

### 📱 Multi-language Support

- ✅ Vietnamese (VI) 🇻🇳
- ✅ English (EN) 🇬🇧
- ✅ Automatic language detection
- ✅ Seamless language switching

### 📧 Notifications

- ✅ Email OTP for registration
- ✅ Appointment confirmation emails
- ✅ Real-time notifications via Socket.io
- ✅ Notification preferences

### 📊 Medical Data Management

- ✅ Medical conditions tracking
- ✅ Allergies management
- ✅ Medical history storage
- ✅ Health metrics tracking

### 🎨 UI/UX Features

- ✅ Dark mode / Light mode toggle
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Loading states & animations
- ✅ Error handling & user feedback
- ✅ Skeleton screens for better UX

---

## 👨‍⚕️ Features by Role

### 👤 Patient Features

| Feature                      | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| **Search Doctors**           | Find doctors by specialization, rating, experience  |
| **View Doctor Profiles**     | Detailed information, credentials, reviews, ratings |
| **Book Appointments**        | Select date, time slot, provide reason for visit    |
| **Manage Appointments**      | View, reschedule, cancel appointments               |
| **Write Reviews**            | Rate doctors and leave feedback                     |
| **View Appointment History** | Track past & upcoming appointments                  |
| **Medical Profile**          | Store medical conditions, allergies, health info    |
| **Dashboard**                | Quick overview of appointments & recommendations    |
| **Export Records**           | Download appointment records as PDF                 |

### 👨‍⚕️ Doctor Features

| Feature                 | Description                                 |
| ----------------------- | ------------------------------------------- |
| **Profile Management**  | Educational background, certifications, bio |
| **Schedule Management** | Set available hours, create time slots      |
| **Block Dates**         | Mark unavailable dates                      |
| **View Appointments**   | All patient appointments with details       |
| **Appointment Actions** | Confirm, reject, mark completed, add notes  |
| **Manage Reviews**      | View & respond to patient reviews           |
| **Analytics Dashboard** | Patient count, ratings, appointment stats   |
| **Real-time Updates**   | Live notification of new appointments       |
| **Consultation Fee**    | Set minimum & maximum fees                  |

---

## 🌟 Key Highlights

### 1. **Real-time Updates**

- WebSocket integration for instant appointment notifications
- Live slot availability updates
- Bi-directional communication between doctor & patient

### 2. **Secure Authentication**

- Industry-standard JWT tokens
- Google OAuth for seamless login
- OTP email verification for registration
- Automatic session management

### 3. **Optimized Performance**

- React Query caching strategy (5-minute staleTime)
- Image optimization via Cloudinary
- Code splitting & lazy loading
- Memoization for expensive components

### 4. **Responsive Design**

- Mobile-first approach
- Works on all device sizes
- Touch-optimized interface
- Fast performance on slow networks

### 5. **International Support**

- Full Vietnamese & English translations
- Next-intl for type-safe i18n
- Currency & date formatting per locale
- RTL support ready

### 6. **Cloud Infrastructure**

- Firebase for scalable backend
- Cloudinary for reliable file storage
- Nodemailer for email delivery
- No server maintenance required

### 7. **Type Safety**

- Full TypeScript codebase
- Strict type checking
- Better IDE support & autocomplete
- Fewer runtime errors

---

## 🚀 How to Run

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase project created
- Cloudinary account (for image uploads)
- SMTP credentials for emails (Gmail App Password recommended)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section)
# Update .env with your Firebase & API credentials

# Start development server
npm run dev

# Backend will run on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file (see Environment Variables section)
# Update .env.local with your API URL & Firebase config

# Start development server
npm run dev

# Frontend will run on http://localhost:3000
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/api (if docs enabled)

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=medical-appointment-app-1c985
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@medical-appointment-app-1c985.iam.gserviceaccount.com

# Firebase Client Configuration (shared with frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyACFbyWXuGH2Xn3mMXDiNdD78-Xqo7I9fo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=medical-appointment-app-1c985.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=medical-appointment-app-1c985
NEXT_PUBLIC_FIREBASE_APP_ID=1:415116181363:web:51a95374d7737b2fe00f06

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Cloudinary Configuration (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Default Avatar URL
DEFAULT_AVATAR_URL=https://res.cloudinary.com/your_cloud/image/upload/v.../default_avatar.jpg

# Email Configuration (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_app_specific_password
EMAIL_FROM_NAME=Medibook Support

# Google OAuth (Optional for backend verification)
FIREBASE_CLIENT_ID=415116181363-ntp6iq98m82htknumopd39usk5a7m3ee.apps.googleusercontent.com
```

### Frontend (.env.local)

```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyACFbyWXuGH2Xn3mMXDiNdD78-Xqo7I9fo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=medical-appointment-app-1c985.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=medical-appointment-app-1c985
NEXT_PUBLIC_FIREBASE_APP_ID=1:415116181363:web:51a95374d7737b2fe00f06

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# OpenAI API Key (For Health Chat AI - Optional)
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```

---

## 🔑 Test Credentials

### Doctor Account Example

```
Email:    dr.nguyen.lan@hospital.vn
Password: 123456
```

**Profile Details:**

- Full Name: Dr. Nguyễn Thị Lan
- Specialization: Cardiology (Tim mạch)
- License Number: DL001
- Years of Experience: 10
- Hospital: Central Hospital
- Consultation Fee: 150,000 - 500,000 VND
- Rating: 4.8/5 ⭐

### Patient Account (For Testing)

You can register a new patient account during signup process with any email/password combination.

---

## 📁 Project Structure

```
medical-appointment-booking-app/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Main server file
│   │   ├── config/               # Firebase, Cloudinary, Multer configs
│   │   ├── controllers/          # Request handlers
│   │   ├── services/             # Business logic
│   │   ├── models/               # Data models/types
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Auth, error handling
│   │   ├── utils/                # Helper functions
│   │   └── socket/               # WebSocket handlers
│   ├── scripts/                  # Seed data scripts
│   ├── .env                      # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   ├── components/           # React components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities & services
│   │   ├── providers/            # Context providers
│   │   ├── types/                # TypeScript types
│   │   ├── utils/                # Helper functions
│   │   ├── messages/             # i18n translations (EN, VI)
│   │   ├── config/               # Configuration files
│   │   └── middleware.ts         # Next.js middleware
│   ├── public/                   # Static assets
│   ├── .env.local                # Environment variables
│   └── package.json
│
└── README.md                     # This file
```

---

## 📡 API Documentation

### Key API Endpoints

#### Authentication

```
POST   /api/auth/register/request-otp       # Request OTP for registration
POST   /api/auth/register/verify-otp        # Verify OTP & register user
POST   /api/auth/login                      # Login with email/password
POST   /api/auth/google                     # Login with Google ID token
GET    /api/auth/me                         # Get current user info
PUT    /api/auth/me                         # Update user profile
```

#### Doctors

```
GET    /api/doctors                         # List doctors with filters
GET    /api/doctors/:id                     # Get doctor details
GET    /api/doctors/search                  # Search doctors
```

#### Appointments

```
POST   /api/appointments                    # Create appointment
GET    /api/appointments/my                 # Patient's appointments
GET    /api/appointments/doctor             # Doctor's appointments
GET    /api/appointments/:id                # Get appointment details
PATCH  /api/appointments/:id/status         # Update appointment status
PUT    /api/appointments/:id                # Reschedule appointment
```

#### Schedules

```
GET    /api/schedules/doctor/:doctorId      # Get doctor's schedule
POST   /api/schedules                       # Create/update schedule
GET    /api/schedules/doctor/:doctorId/slots # Get available slots
```

#### Reviews

```
POST   /api/reviews                         # Create review
GET    /api/reviews/doctor/:doctorId        # Get doctor reviews
PUT    /api/reviews/:id                     # Update review
DELETE /api/reviews/:id                     # Delete review
```

For complete API documentation, visit: `/api` endpoint when backend is running.

---

## 🛡️ Security Features

- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Google OAuth**: Secure third-party authentication
- ✅ **CORS**: Configured to prevent unauthorized access
- ✅ **Helmet**: Security headers middleware
- ✅ **Input Validation**: Server-side validation on all endpoints
- ✅ **Rate Limiting**: (Can be added) Prevent brute force attacks
- ✅ **Firebase Security Rules**: Row-level security in database

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Port 3000 is already in use"

```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Issue**: "Cannot connect to backend API"

- Check if backend is running: `http://localhost:5000`
- Verify CORS_ORIGIN in backend .env matches frontend URL
- Check firewall settings

**Issue**: "Firebase authentication error"

- Verify Firebase config in .env files is correct
- Check Firebase project is active & quota not exceeded

**Issue**: "Image upload fails"

- Verify Cloudinary credentials in .env
- Check file size doesn't exceed 5MB limit
- Ensure Cloudinary account has sufficient quota

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Socket.io Documentation](https://socket.io/docs)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is open source and available under the MIT License.

---

## 📧 Contact & Support

For issues, questions, or support:

- Create an issue in the repository
- Email: support@medibook.com

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Active Development ✅
