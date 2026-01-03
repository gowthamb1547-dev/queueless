# QueueLess – Smart Appointment Booking System

A complete, production-ready full-stack web application for managing appointments with role-based access control, Google OAuth authentication, and real-time slot management.

## 🚀 Features

### Authentication
- User registration & login (email/password)
- Google OAuth login
- JWT access & refresh tokens
- Secure logout
- Role-based access (USER, ADMIN)

### Appointment System
- Book appointments (date, time slot, reason)
- Update appointments
- Cancel appointments
- View appointment history
- Appointment status management (Pending, Approved, Rejected, Completed)

### Time Slot Management
- Admin creates available slots
- Prevents double booking
- Auto-locks booked slots

### Dashboards
- **User Dashboard**: View upcoming appointments, appointment status, and history
- **Admin Dashboard**: View all appointments, approve/reject appointments, daily analytics, and slot management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Google OAuth 2.0
- **UI**: Tailwind CSS (responsive, modern design)

## 📁 Project Structure

```
project6/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   └── Slot.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   └── slots.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── jwt.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── auth/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── UserDashboard.js
│   │   └── AdminDashboard.js
│   ├── lib/
│   │   ├── api.js
│   │   └── auth.js
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── .env.example
├── README.md
└── .gitignore
```

## 🔧 Setup Instructions

> **📖 For detailed step-by-step setup, see [SETUP.md](./SETUP.md)**  
> **✅ For verification checklist, see [VERIFY.md](./VERIFY.md)**

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Google OAuth credentials (optional - for Google login)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `env.example.txt`):
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/queueless
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here_change_in_production
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
NODE_ENV=development
```

4. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (copy from `.env.example`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5000/auth/google/callback`
5. Copy the Client ID and Client Secret to your `.env` files

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh access token

### Appointments
- `POST /appointments` - Create appointment (protected)
- `GET /appointments` - Get appointments (protected)
- `GET /appointments/:id` - Get single appointment (protected)
- `PUT /appointments/:id` - Update appointment (protected)
- `DELETE /appointments/:id` - Delete appointment (protected)

### Time Slots (Admin Only)
- `POST /slots` - Create slot (admin)
- `GET /slots` - Get available slots
- `DELETE /slots/:id` - Delete slot (admin)

## 🗄️ Database Models

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required for local auth)
- `role` (String, enum: 'USER' | 'ADMIN', default: 'USER')
- `provider` (String, enum: 'local' | 'google')
- `googleId` (String, optional)
- `createdAt` (Date, auto)

### Appointment
- `userId` (ObjectId, ref: User, required)
- `date` (Date, required)
- `timeSlot` (String, required)
- `reason` (String, required)
- `status` (String, enum: 'Pending' | 'Approved' | 'Rejected' | 'Completed', default: 'Pending')
- `createdAt` (Date, auto)

### Slot
- `date` (Date, required)
- `timeSlot` (String, required)
- `isBooked` (Boolean, default: false)
- `createdAt` (Date, auto)

## 🎯 Usage

1. **Start MongoDB** (if using local instance):
```bash
mongod
```

2. **Start Backend**:
```bash
cd backend
npm run dev
```

3. **Start Frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```

4. **Access the application**:
   - Open `http://localhost:3000` in your browser
   - Register a new account or login
   - Book appointments (as a user) or manage appointments (as an admin)

## 👤 Creating an Admin User

To create an admin user, use the provided script:

```bash
cd backend
npm run create-admin [email] [password]
```

Example:
```bash
npm run create-admin admin@queueless.com admin123
```

If no email/password is provided, it defaults to:
- Email: `admin@queueless.com`
- Password: `admin123`

**Note**: Make sure MongoDB is running and your `.env` file is configured before running this script.

Alternatively, you can create an admin user using MongoDB directly:
```javascript
// Connect to MongoDB and run:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "ADMIN" } }
)
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Role-based access control
- CORS configuration
- Secure cookie handling
- Input validation

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the `MONGODB_URI` in your `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### CORS Errors
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `backend/server.js`

### Google OAuth Not Working
- Verify Google OAuth credentials in `.env`
- Check redirect URI matches Google Cloud Console settings
- Ensure Google+ API is enabled

### Token Expiration
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- The frontend automatically refreshes tokens on 401 errors

## 📝 Notes

- All environment variables should be set before running the application
- Use strong, unique JWT secrets in production
- MongoDB connection string format: `mongodb://localhost:27017/queueless` or MongoDB Atlas connection string
- The application uses ES6 modules (`type: "module"` in package.json)

## 🚀 Production Deployment

Before deploying to production:

1. Set `NODE_ENV=production` in backend `.env`
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Use MongoDB Atlas or a production MongoDB instance
5. Set up proper error logging
6. Configure HTTPS
7. Update Google OAuth redirect URIs for production domain

## 📄 License

This project is open source and available for use.

---

**Built with ❤️ for production-ready appointment booking**

