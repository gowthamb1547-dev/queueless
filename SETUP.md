# QueueLess - Complete Setup Guide

## 🚀 Step-by-Step Setup Instructions

### Prerequisites
- Node.js (v18 or higher) installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git (optional)

---

## Step 1: Backend Setup

### 1.1 Navigate to Backend Directory
```bash
cd backend
```

### 1.2 Install Dependencies
```bash
npm install
```

### 1.3 Create `.env` File
Create a `.env` file in the `backend` directory with the following content:

```env
MONGODB_URI=mongodb://localhost:27017/queueless
JWT_SECRET=supersecretkey
JWT_REFRESH_SECRET=refreshsecret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
PORT=5000
NODE_ENV=development
```

**Important:**
- Replace `MONGODB_URI` with your MongoDB connection string (local or Atlas)
- For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/queueless`
- Replace Google OAuth credentials if you want to use Google login
- Change JWT secrets to strong random strings in production

### 1.4 Start MongoDB (if using local MongoDB)
```bash
# Windows
mongod

# macOS/Linux
sudo mongod
```

### 1.5 Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

---

## Step 2: Frontend Setup

### 2.1 Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

### 2.2 Install Dependencies
```bash
npm install
```

### 2.3 Create `.env.local` File
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2.4 Start Frontend Server
```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

---

## Step 3: Create Admin User

### 3.1 Open New Terminal
```bash
cd backend
npm run create-admin
```

Or with custom credentials:
```bash
npm run create-admin admin@queueless.com admin123
```

---

## Step 4: Access the Application

1. Open your browser and go to: `http://localhost:3000`
2. You should see the login page
3. Register a new user or login with admin credentials

---

## Step 5: Verify Everything Works

### Test Registration
1. Click "Register"
2. Fill in name, email, password
3. Click "Register"
4. Should redirect to dashboard

### Test Login
1. Go to login page
2. Enter credentials
3. Should redirect to dashboard

### Test Appointment Booking (as User)
1. Click "Book Appointment"
2. Select date
3. Select time slot
4. Enter reason
5. Click "Book Appointment"
6. Should see appointment in "Upcoming Appointments"

### Test Admin Features (as Admin)
1. Login as admin
2. Should see admin dashboard
3. Click "Create Slot"
4. Enter date and time slot
5. Should see slot created
6. View all appointments
7. Approve/reject appointments

---

## Troubleshooting

### Backend Won't Start

**Error: MongoDB connection failed**
- Check if MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGODB_URI` in `.env` is correct
- For Atlas: Check IP whitelist and credentials

**Error: Port 5000 already in use**
- Change `PORT` in `.env` to another port (e.g., 5001)
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local` accordingly

**Error: Module not found**
- Run `npm install` again in backend directory
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Frontend Won't Start

**Error: Port 3000 already in use**
- Kill the process using port 3000 or change port in `package.json`

**Error: Module not found**
- Run `npm install` again in frontend directory
- Delete `node_modules` and `package-lock.json`, then `npm install`

**Error: Cannot find module '@/lib/api'**
- Verify `jsconfig.json` exists in frontend directory
- Restart the dev server

### API Errors

**401 Unauthorized**
- Check if JWT_SECRET is set in backend `.env`
- Verify token is being sent in requests
- Check browser console for errors

**CORS Error**
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `backend/server.js`

**404 Not Found**
- Verify backend is running on correct port
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

### Database Issues

**Appointments not saving**
- Check MongoDB connection
- Verify database name in connection string
- Check backend console for errors

**Slots not showing**
- Admin must create slots first
- Check if slots are marked as `isBooked: false`
- Verify date format matches

---

## Quick Commands Reference

```bash
# Backend
cd backend
npm install
npm run dev          # Start development server
npm start            # Start production server
npm run create-admin # Create admin user

# Frontend
cd frontend
npm install
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

---

## Environment Variables Summary

### Backend `.env`
- `MONGODB_URI` - MongoDB connection string (REQUIRED)
- `JWT_SECRET` - Secret for JWT tokens (REQUIRED)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (REQUIRED)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (OPTIONAL)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (OPTIONAL)
- `FRONTEND_URL` - Frontend URL for CORS (REQUIRED)
- `BACKEND_URL` - Backend URL for OAuth callback (REQUIRED)
- `PORT` - Backend server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Frontend `.env.local`
- `NEXT_PUBLIC_API_URL` - Backend API URL (REQUIRED)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID (OPTIONAL)

---

## Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 3000
3. ✅ MongoDB connected
4. ✅ Admin user created
5. ✅ Test registration/login
6. ✅ Test appointment booking
7. ✅ Test admin features

**Your QueueLess application is now ready to use!** 🎉

