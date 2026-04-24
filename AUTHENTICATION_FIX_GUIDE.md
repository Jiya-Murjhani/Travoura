# Travoura Authentication Fix Guide

## Overview
This guide documents all the changes made to fix the JWT authentication issue and align the application with Supabase Auth as the single source of truth.

---

## 🔧 Changes Made

### 1. Backend Configuration

#### File: `backend/src/config/env.ts`
- **Changed**: Environment variable names from `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Reason**: To match the naming convention in your `.env` file

```typescript
export const env = {
  supabase: {
    url: process.env.VITE_SUPABASE_URL,
    anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  },
};
```

#### File: `backend/src/middleware/authMiddleware.ts`
- **Changed**: Replaced custom JWT verification with Supabase-based validation
- **Installed**: `@supabase/supabase-js` package
- **How it works**: 
  - Extracts the token from the `Authorization: Bearer <token>` header
  - Calls `supabase.auth.getUser(token)` to validate the token with Supabase
  - Sets `req.user` to the authenticated Supabase user object
  - Returns 403 if the token is invalid

```typescript
const { data, error } = await supabase.auth.getUser(token);
if (error || !data.user) {
  return res.status(403).json({ message: 'Invalid token' });
}
req.user = data.user;
```

#### File: `backend/src/server.ts`
- **Removed**: Reference to `/api/users` routes (obsolete custom auth)
- **Kept**: All protected routes now use the new Supabase-based middleware

#### File: `backend/src/routes/itineraryRoutes.ts`
- **Added**: `authenticateToken` middleware to protect the `/generate` endpoint

#### File: `backend/src/routes/userRoutes.ts`
- **Deleted**: This file is no longer needed as authentication is handled entirely by Supabase

---

### 2. Frontend Configuration

#### File: `frontend/.env`
- **Added**: `VITE_API_URL="http://localhost:5000"`
- **Reason**: Centralized API base URL configuration

#### File: `frontend/src/pages/Trips.tsx`
- **Changed**: Token retrieval from `localStorage.getItem("token")` to `session.access_token`
- **Changed**: API URL from hardcoded `"http://localhost:5000/api/trips"` to `${apiUrl}/api/trips`
- **Integrated**: `useAuth` hook from `AuthContext` for consistent session management

```typescript
const { session } = useAuth();
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const token = session.access_token;

const response = await fetch(`${apiUrl}/api/trips`, {
  headers: {
    "Authorization": `Bearer ${token}`,
  },
});
```

#### File: `frontend/src/pages/TripDashboard.tsx`
- **Changed**: Same token and API URL updates as `Trips.tsx`
- **Integrated**: `useAuth` hook for session management

---

## ✅ Environment Variables Required

### Backend `.env` file
```
# Supabase Configuration
VITE_SUPABASE_URL=https://oggnaifnlukepkhlqrdh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server
PORT=5000

# Database (if using PostgreSQL directly)
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
DB_HOST=localhost
DB_PORT=5432
```

### Frontend `.env` file
```
VITE_SUPABASE_URL=https://oggnaifnlukepkhlqrdh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:5000
```

---

## 🚀 How to Test

### 1. Start the Backend
```bash
cd backend
npm install  # If not already done
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
```

**If you see the error:**
```
[ERROR] EnvError: Missing required environment variable: VITE_SUPABASE_URL
```

**Solution**: Ensure your `backend/.env` file has the correct variable names with the `VITE_` prefix.

### 2. Start the Frontend
```bash
cd frontend
npm install  # If not already done
npm run dev
```

### 3. Test the Authentication Flow

1. **Sign up** at `http://localhost:8080/signup`
2. **Log in** at `http://localhost:8080/login`
3. **Navigate** to `/trips` to see your trips
4. **Check the browser console** for any errors

### 4. Test API Connectivity

- **Test root endpoint**: `http://localhost:5000/`
- **Test database connection**: `http://localhost:5000/test-db`
- **Test protected route** (requires valid token):
  ```bash
  curl -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" http://localhost:5000/protected
  ```

---

## 🔍 Troubleshooting

### Issue: "Failed to fetch" or "Connection Refused"
**Cause**: Backend is not running or API URL is incorrect

**Solution**:
1. Ensure backend is running: `npm run dev` in the `backend` directory
2. Check that `VITE_API_URL` in `frontend/.env` matches the backend port (default: `http://localhost:5000`)
3. Check browser console for the actual error message

### Issue: "Missing required environment variable: VITE_SUPABASE_URL"
**Cause**: Backend `.env` file doesn't have the Supabase variables

**Solution**:
1. Add the following to `backend/.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
2. Restart the backend server

### Issue: "Invalid token" (403 Forbidden)
**Cause**: Token is not being sent correctly or is invalid

**Solution**:
1. Ensure you're logged in (check `AuthContext` via browser DevTools)
2. Verify the token is being extracted correctly: `session.access_token`
3. Check that the `Authorization` header format is exactly: `Bearer <token>`

### Issue: Trips not displaying
**Cause**: Either backend is not running, or database query is failing

**Solution**:
1. Check backend logs for errors
2. Test database connection: `http://localhost:5000/test-db`
3. Verify user ID is being passed correctly from the Supabase token

---

## 📋 Summary of Key Changes

| Component | Before | After |
|-----------|--------|-------|
| **Auth Source** | Custom JWT + localStorage | Supabase Auth only |
| **Token Storage** | localStorage.getItem("token") | session.access_token |
| **Backend Validation** | jwt.verify() with JWT_SECRET | supabase.auth.getUser() |
| **User Routes** | /api/users/login, /register | Removed (use Supabase) |
| **Protected Routes** | Using custom JWT middleware | Using Supabase validation |
| **API URL** | Hardcoded | Environment variable (VITE_API_URL) |

---

## 🎯 Next Steps

1. **Verify backend starts without errors**
2. **Test login/signup flow**
3. **Confirm trips are fetched and displayed**
4. **Test CRUD operations on trips**
5. **Monitor browser console for any remaining errors**

If you encounter any issues, check the troubleshooting section above or review the specific files mentioned in the "Changes Made" section.
