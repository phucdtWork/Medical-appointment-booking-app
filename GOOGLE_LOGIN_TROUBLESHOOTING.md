# Google Login Troubleshooting Guide

## Symptoms
- Google login works locally but fails on production (Vercel)
- Popup closes without error
- Error: "Error: operation-not-allowed" or "popup-blocked"
- Firebase popup shows but nothing happens

## Root Causes & Solutions

### 1. **Firebase Console Missing Authorized Domains** (Most Common)

When you deploy to Vercel, your app runs on a different domain. Firebase security requires that domain to be authorized.

**Steps to Fix:**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → Authentication → Settings
3. Scroll down to **Authorized Domains**
4. Add your Vercel domain:
   - Production: `medical-appointment-booking-app-frontend-[id].vercel.app`
   - Preview: `medical-appointment-booking-app-frontend-[branch].[id].vercel.app`
5. Also add `localhost:3000` for local development

### 2. **Google OAuth Credentials Misconfigured**

The OAuth 2.0 consent screen settings must include your domains.

**Steps to Fix:**

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **Credentials** (left sidebar)
4. Find your Web OAuth 2.0 Client ID
5. Click it and add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3000/en
   http://localhost:3000/vi
   https://medical-appointment-booking-app-frontend-[id].vercel.app
   https://medical-appointment-booking-app-frontend-[branch].[id].vercel.app
   ```
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:3000/en/(auth)/login
   http://localhost:3000/vi/(auth)/login
   https://medical-appointment-booking-app-frontend-[id].vercel.app/en/(auth)/login
   https://medical-appointment-booking-app-frontend-[id].vercel.app/vi/(auth)/login
   ```
7. Click **Save**

### 3. **Firebase API Key Configuration Missing on Vercel**

Vercel environment variables are different from local `.env.local`.

**Steps to Fix:**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Add these variables (get values from Firebase console):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=[your-api-key]
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[project].firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=[project-id]
   NEXT_PUBLIC_FIREBASE_APP_ID=[app-id]
   ```
5. Select both "Production" and "Preview" environments
6. Redeploy the app (or push new code)

### 4. **Backend URL Misconfigured**

The frontend needs to send the Google token to the correct backend URL.

**Check:**

1. Verify `NEXT_PUBLIC_API_URL` on Vercel is set to your backend (Render):
   ```
   https://medical-appointment-booking-app.onrender.com/api
   ```
2. Verify backend has CORS enabled for your Vercel domain

### 5. **Content Security Policy (CSP) Blocking Popup**

Modern Next.js apps sometimes have strict security headers.

**Check Browser Console:**
- Open DevTools → Console
- Try clicking Google button
- Look for errors starting with "Refused to load"

**Solution:** Ensure no middleware blocks the popup (already fixed in your middleware.ts)

---

## Testing Checklist

### Local Testing (Should Work)
- [ ] Google login works at `http://localhost:3000/en`
- [ ] Token is sent to backend successfully
- [ ] User is created/logged in

### Vercel Testing

1. **Check Environment Variables:**
   ```bash
   # In your Vercel project settings, verify all NEXT_PUBLIC_FIREBASE_* vars are set
   ```

2. **Check Browser Console for Errors:**
   - Open DevTools (F12)
   - Go to Console tab
   - Click Google button
   - Look for error messages

3. **Check Network Tab:**
   - Go to Network tab
   - Click Google button
   - Should see request to `identitytoolkit.googleapis.com`
   - Then request to `/api/auth/google` (your backend)

4. **Common Error Codes:**
   - `operation-not-allowed`: Firebase auth method disabled in console
   - `popup-blocked`: Browser blocked the popup (security issue)
   - `CORS error`: Backend doesn't allow your Vercel domain
   - `auth/invalid-api-key`: Wrong Firebase API key

---

## Quick Verification Steps

### Step 1: Verify Firebase is Configured
```
In browser console on Vercel app:
1. Press F12 → Console
2. Type: localStorage.getItem('token')
3. Should show token after Google login
```

### Step 2: Check Backend Receives Token
```
1. Click Google button
2. Check Render logs: Dashboard → Logs
3. Should see request to POST /auth/google
4. Should return success with user data
```

### Step 3: Verify CORS is Allowed
```
1. Check backend is accessible
2. Go to: https://[your-backend].onrender.com/api/doctors
3. Should return doctors list
```

---

## Still Not Working?

### Enable Debug Mode
In `frontend/src/lib/firebaseClient.ts`, add before `initializeApp`:
```typescript
import { enableLogging } from 'firebase/auth';
enableLogging(true); // Shows detailed Firebase auth logs
```

### Check Backend Logs
In [Render Dashboard](https://dashboard.render.com):
1. Select your backend service
2. Click "Logs" tab
3. Try Google login
4. Look for POST /auth/google requests and errors

### Common Fixes
1. **Clear cache & reload**: Cmd+Shift+R or Ctrl+Shift+R
2. **Incognito window**: Try in private/incognito mode to bypass cache
3. **Different browser**: Try Chrome, Firefox, Safari
4. **Check time sync**: System clock must be accurate for OAuth

---

## Configuration Summary Needed on Vercel

```
Environment Variables:
✅ NEXT_PUBLIC_FIREBASE_API_KEY=...
✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=....firebaseapp.com
✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
✅ NEXT_PUBLIC_FIREBASE_APP_ID=...
✅ NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api

Firebase Console:
✅ Google provider enabled in Authentication
✅ Your Vercel domain(s) in Authorized Domains list

Google Cloud Console:
✅ OAuth 2.0 credentials configured
✅ Vercel domain in Authorized JavaScript origins
✅ Callback URLs in Authorized redirect URIs
```

---

## Still Having Issues?

1. Share the exact error message from browser console
2. Check if Google login works with `signInWithRedirect` (fallback)
3. Verify backend is receiving the idToken at `/auth/google`
4. Test with a fresh incognito window to rule out cache issues
