# 🔧 Fixes Required - QueueLess Setup

## ⚠️ CRITICAL ISSUE: MongoDB Connection String

### Problem:
Your `backend/.env` file has `YOUR_PASSWORD` as a placeholder. The backend server **cannot connect to MongoDB** without your actual password.

### Solution:

1. **Open `backend/.env` file**

2. **Find this line:**
   ```
   MONGODB_URI=mongodb+srv://gowthamb1547_db_user:YOUR_PASSWORD@cluster0.n08vifm.mongodb.net/queueless?retryWrites=true&w=majority
   ```

3. **Replace `YOUR_PASSWORD` with your actual MongoDB password:**
   ```
   MONGODB_URI=mongodb+srv://gowthamb1547_db_user:YourActualPassword123@cluster0.n08vifm.mongodb.net/queueless?retryWrites=true&w=majority
   ```

4. **How to get your MongoDB password:**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Click "Database Access" in the left menu
   - Find user: `gowthamb1547_db_user`
   - Click "Edit" → "Edit Password"
   - If you forgot it, click "Edit" → "Reset Password" to create a new one
   - Copy the password

5. **Also ensure your IP is whitelisted:**
   - Go to "Network Access" in MongoDB Atlas
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your specific IP

---

## ✅ After Fixing MongoDB URI:

### Step 1: Stop Current Servers
Press `Ctrl+C` in both terminal windows running the servers.

### Step 2: Start Backend
```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**If you see MongoDB connection error:**
- Double-check your password in `.env`
- Verify IP is whitelisted in MongoDB Atlas
- Check network connectivity

### Step 3: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

---

## 🧪 Testing Checklist

Once both servers are running:

### 1. Test Backend Health
Open browser: `http://localhost:5000/health`
Should show: `{"status":"OK","message":"QueueLess API is running"}`

### 2. Test Frontend
Open browser: `http://localhost:3000`
Should show: Login page

### 3. Test Registration
- Click "Register"
- Fill in: Name, Email, Password
- Click "Register"
- Should redirect to dashboard

### 4. Test Login
- Go to login page
- Enter credentials
- Should redirect to dashboard

### 5. Test Appointment Booking
- Click "Book Appointment"
- Select date and time slot
- Enter reason
- Should create appointment

### 6. Create Admin User
```bash
cd backend
npm run create-admin admin@test.com admin123
```

### 7. Test Admin Features
- Login as admin
- Should see admin dashboard
- Can create slots
- Can approve/reject appointments

---

## 🐛 Common Issues & Fixes

### Issue 1: "MongoDB connection error"
**Fix:** Update password in `backend/.env` file

### Issue 2: "Port 5000 already in use"
**Fix:** 
- Find process: `netstat -ano | findstr :5000`
- Kill process or change PORT in `.env`

### Issue 3: "Port 3000 already in use"
**Fix:**
- Find process: `netstat -ano | findstr :3000`
- Kill process or change port in `package.json`

### Issue 4: "Cannot find module"
**Fix:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "CORS error"
**Fix:** Verify `FRONTEND_URL=http://localhost:3000` in `backend/.env`

### Issue 6: "401 Unauthorized"
**Fix:** 
- Check JWT_SECRET is set in `backend/.env`
- Verify token is being sent in requests
- Check browser console for errors

---

## 📝 Summary of Required Changes

1. ✅ **Update MongoDB password** in `backend/.env`
   - Replace `YOUR_PASSWORD` with actual password

2. ✅ **Verify MongoDB IP whitelist** in MongoDB Atlas

3. ✅ **Restart backend server** after updating `.env`

4. ✅ **Test all features** using the checklist above

---

## 🎯 Next Steps

1. Fix MongoDB password in `.env`
2. Restart backend server
3. Verify connection works
4. Test all features
5. Report any remaining issues

---

**The main issue is the MongoDB password placeholder. Once you update it with your real password, everything should work!**

