# Quick Start Guide - QueueLess

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend (.env):**
```bash
cd backend
# Copy env.example.txt to .env and fill in your values
PORT=5000
MONGODB_URI=mongodb://localhost:27017/queueless
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
NODE_ENV=development
```

**Frontend (.env.local):**
```bash
cd frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Step 3: Start MongoDB

Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Just update MONGODB_URI in .env
```

### Step 4: Start Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 5: Start Frontend

Open a new terminal:
```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 6: Create Admin User

Open another terminal:
```bash
cd backend
npm run create-admin admin@queueless.com admin123
```

### Step 7: Access the Application

1. Open `http://localhost:3000` in your browser
2. Register a new user or login with:
   - Email: `admin@queueless.com`
   - Password: `admin123` (if you created admin)
3. Start booking appointments!

## 📝 Important Notes

- **MongoDB**: Make sure MongoDB is running before starting the backend
- **Ports**: Backend uses port 5000, Frontend uses port 3000
- **Google OAuth**: Optional - app works without it, just skip Google login
- **Admin Access**: Only admins can create time slots and manage appointments

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

**Frontend won't start:**
- Check port 3000 is not in use
- Verify `.env.local` file exists
- Run `npm install` again

**Can't login:**
- Check backend is running
- Verify API_URL in frontend `.env.local` matches backend URL
- Check browser console for errors

**MongoDB connection error:**
- Verify MongoDB is running
- Check MONGODB_URI in backend `.env`
- For MongoDB Atlas, ensure IP is whitelisted

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can access dashboard
- [ ] Admin can create time slots
- [ ] User can book appointments
- [ ] Admin can approve/reject appointments

---

**Need help?** Check the main README.md for detailed documentation.

