# 🚀 QueueLess - START HERE

## Welcome to QueueLess!

This is a **complete, production-ready** full-stack appointment booking system.

---

## ⚡ Quick Start (5 Minutes)

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file (copy from env.example.txt)
npm run dev
```

### 2. Frontend Setup (New Terminal)
```bash
cd frontend
npm install
# Create .env.local file
npm run dev
```

### 3. Create Admin User (New Terminal)
```bash
cd backend
npm run create-admin
```

### 4. Open Browser
Go to: `http://localhost:3000`

---

## 📋 Required Files

### Backend `.env` File
Create `backend/.env` with:
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

**Important:** Replace `MONGODB_URI` with your MongoDB connection string!

### Frontend `.env.local` File
Create `frontend/.env.local` with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[VERIFY.md](./VERIFY.md)** - Verification checklist
- **[README.md](./README.md)** - Full documentation
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick reference guide

---

## ✅ What's Included

- ✅ Complete backend API (Express.js + MongoDB)
- ✅ Complete frontend (Next.js + Tailwind CSS)
- ✅ Authentication (JWT + Google OAuth)
- ✅ Appointment CRUD operations
- ✅ Admin dashboard
- ✅ User dashboard
- ✅ Time slot management
- ✅ Role-based access control

---

## 🎯 Next Steps

1. **Follow [SETUP.md](./SETUP.md)** for detailed instructions
2. **Use [VERIFY.md](./VERIFY.md)** to test everything
3. **Start building!** 🚀

---

## 🆘 Need Help?

- Check [SETUP.md](./SETUP.md) for troubleshooting
- Review [VERIFY.md](./VERIFY.md) for testing
- Check console logs for errors
- Verify MongoDB is running
- Ensure all environment variables are set

---

## ✨ Features

- 🔐 User registration & login
- 🔑 Google OAuth
- 📅 Appointment booking
- 👤 User dashboard
- 👨‍💼 Admin dashboard
- ⏰ Time slot management
- 📊 Analytics
- 🔒 Secure authentication

---

**Ready to start? Follow the Quick Start above!** 🎉

