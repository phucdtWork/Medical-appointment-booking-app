# API Update Guide - User Profile Management

## Overview

Đã cập nhật API để hỗ trợ cập nhật thông tin người dùng cho cả **bệnh nhân (Patient)** và **bác sĩ (Doctor)** với khả năng upload ảnh đại diện lên Cloudinary.

---

## New Endpoints

### 1. Doctor Registration (OTP-based)

**POST** `/auth/register/doctor`

**Description:** Đăng ký tài khoản bác sĩ sau khi xác thực OTP

**Request Body:**

```json
{
  "email": "doctor@example.com",
  "otp": "123456",
  "password": "securePassword123",
  "fullName": "Dr. Nguyen Van A",
  "phone": "0987654321",
  "doctorInfo": {
    "specialization": "Cardiology",
    "licenseNumber": "DL123456",
    "yearsOfExperience": 5,
    "education": ["Bachelor of Medicine", "Master of Cardiology"],
    "hospital": "Central Hospital",
    "consultationFee": {
      "min": 100000,
      "max": 500000
    },
    "bio": "Experienced cardiologist with 5 years of practice"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Doctor registration successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "doctor@example.com",
      "fullName": "Dr. Nguyen Van A",
      "phone": "0987654321",
      "role": "doctor",
      "createdAt": "2026-01-12T00:00:00Z",
      "updatedAt": "2026-01-12T00:00:00Z",
      "doctorInfo": {...}
    }
  }
}
```

---

### 2. Update Patient Profile with Avatar

**PUT** `/auth/me`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**

- `fullName` (optional): Họ và tên
- `phone` (optional): Số điện thoại
- `address` (optional): Địa chỉ
- `gender` (optional): Giới tính (male/female/other)
- `dateOfBirth` (optional): Ngày sinh
- `avatar` (optional): File ảnh đại diện (jpg, jpeg, png, webp, max 5MB)

**Example with cURL:**

```bash
curl -X PUT http://localhost:5000/auth/me \
  -H "Authorization: Bearer your_jwt_token" \
  -F "fullName=Nguyen Thi B" \
  -F "phone=0912345678" \
  -F "address=123 Main Street, Ha Noi" \
  -F "avatar=@/path/to/avatar.jpg"
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "user_id",
    "email": "patient@example.com",
    "fullName": "Nguyen Thi B",
    "phone": "0912345678",
    "address": "123 Main Street, Ha Noi",
    "avatar": "https://res.cloudinary.com/...",
    "role": "patient",
    "gender": "female",
    "dateOfBirth": "1995-05-20",
    "updatedAt": "2026-01-12T10:30:00Z"
  }
}
```

---

### 3. Update Doctor Profile with Avatar

**PUT** `/auth/me/doctor`

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**

- `fullName` (optional): Họ và tên
- `phone` (optional): Số điện thoại
- `address` (optional): Địa chỉ
- `avatar` (optional): File ảnh đại diện
- `doctorInfo` (optional): JSON object với thông tin bác sĩ
  - `specialization` (required if updating doctorInfo)
  - `licenseNumber` (required if updating doctorInfo)
  - `yearsOfExperience`
  - `education`
  - `hospital`
  - `consultationFee`
  - `bio`

**Example with cURL:**

```bash
curl -X PUT http://localhost:5000/auth/me/doctor \
  -H "Authorization: Bearer your_jwt_token" \
  -F "fullName=Dr. Pham Van C" \
  -F "phone=0998765432" \
  -F "address=Central Hospital, HCMC" \
  -F 'doctorInfo={
    "specialization": "Neurology",
    "licenseNumber": "DL789012",
    "yearsOfExperience": 8,
    "hospital": "Central Hospital",
    "consultationFee": {"min": 150000, "max": 600000},
    "bio": "Specialist in neurological disorders"
  }' \
  -F "avatar=@/path/to/doctor_avatar.jpg"
```

**Response:**

```json
{
  "success": true,
  "message": "Doctor profile updated successfully",
  "data": {
    "id": "doctor_id",
    "email": "doctor@example.com",
    "fullName": "Dr. Pham Van C",
    "phone": "0998765432",
    "address": "Central Hospital, HCMC",
    "avatar": "https://res.cloudinary.com/...",
    "role": "doctor",
    "doctorInfo": {
      "specialization": "Neurology",
      "licenseNumber": "DL789012",
      "yearsOfExperience": 8,
      "education": [],
      "hospital": "Central Hospital",
      "consultationFee": {
        "min": 150000,
        "max": 600000
      },
      "bio": "Specialist in neurological disorders",
      "rating": 4.5,
      "totalReviews": 25,
      "totalPatients": 120
    },
    "updatedAt": "2026-01-12T11:00:00Z"
  }
}
```

---

### 4. Get Current User Info (No Changes)

**GET** `/auth/me`

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:** User object with all details including doctorInfo if user is a doctor

---

## Image Upload Features

### Cloudinary Integration

- **Folder Structure:**
  - Patient avatars: `medibook/avatars/`
  - Medical records: `medibook/medical-records/`
  - Doctor certificates: `medibook/certificates/`

- **Auto Transformations:**
  - Avatars: Auto-resized to 500x500px with fill crop
  - Format: Auto-optimized (jpg, png, webp)
  - Quality: Auto

### Old Avatar Deletion

- Khi upload ảnh mới, ảnh cũ sẽ tự động xóa khỏi Cloudinary
- Tránh lãng phí storage

---

## Error Handling

### Common Errors

**1. Missing Avatar File (optional)**

```json
{
  "success": false,
  "message": "Failed to upload avatar"
}
```

**2. Invalid Doctor Info**

```json
{
  "success": false,
  "message": "Invalid doctor info: specialization, licenseNumber, and yearsOfExperience are required"
}
```

**3. File Size Too Large**

```json
{
  "error": "File size exceeds 5MB limit"
}
```

**4. Invalid File Format**

```json
{
  "error": "Only jpg, jpeg, png, webp formats are allowed"
}
```

---

## Frontend Implementation Example

### Using FormData (JavaScript/React)

```javascript
// Patient Profile Update
const updatePatientProfile = async (token, userData) => {
  const formData = new FormData();
  formData.append("fullName", userData.fullName);
  formData.append("phone", userData.phone);
  formData.append("address", userData.address);

  if (userData.avatarFile) {
    formData.append("avatar", userData.avatarFile);
  }

  const response = await fetch("/auth/me", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};

// Doctor Profile Update
const updateDoctorProfile = async (token, userData) => {
  const formData = new FormData();
  formData.append("fullName", userData.fullName);
  formData.append("phone", userData.phone);
  formData.append("address", userData.address);

  if (userData.doctorInfo) {
    formData.append("doctorInfo", JSON.stringify(userData.doctorInfo));
  }

  if (userData.avatarFile) {
    formData.append("avatar", userData.avatarFile);
  }

  const response = await fetch("/auth/me/doctor", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

---

## Required Environment Variables

Ensure your `.env` file contains:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

---

## Summary of Changes

| Component          | Changes                                                                               |
| ------------------ | ------------------------------------------------------------------------------------- |
| **UploadService**  | Enhanced with Cloudinary file operations, public_id extraction, buffer upload support |
| **AuthService**    | Added `editUserProfile()` with avatar upload, new `registerDoctor()` method           |
| **AuthController** | Added `registerDoctor()`, `updateDoctorProfile()`, enhanced `editProfile()`           |
| **AuthRoutes**     | Added `/register/doctor`, `/me/doctor` endpoints                                      |

---

## Testing Checklist

- [ ] Test patient profile update without avatar
- [ ] Test patient profile update with avatar
- [ ] Test doctor registration with OTP
- [ ] Test doctor profile update without avatar
- [ ] Test doctor profile update with avatar
- [ ] Verify old avatar is deleted from Cloudinary
- [ ] Test error handling (invalid doctor info, file size, etc.)
- [ ] Verify JWT authentication on all protected endpoints
