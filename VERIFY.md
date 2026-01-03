# QueueLess - Verification Checklist

Use this checklist to verify your QueueLess application is working correctly.

## ✅ Pre-Startup Checks

- [ ] Backend `.env` file exists with all required variables
- [ ] Frontend `.env.local` file exists with API URL
- [ ] MongoDB is running (local or Atlas)
- [ ] All dependencies installed (`npm install` in both directories)

## ✅ Backend Verification

### Start Backend
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Check:**
- [ ] No errors in console
- [ ] MongoDB connection successful
- [ ] Server listening on port 5000

### Test Health Endpoint
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{"status":"OK","message":"QueueLess API is running"}
```

**Check:**
- [ ] Health endpoint returns success

## ✅ Frontend Verification

### Start Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

**Check:**
- [ ] No build errors
- [ ] Server starts successfully
- [ ] Can access http://localhost:3000

### Test Pages Load
- [ ] Home page redirects to login (if not authenticated)
- [ ] Login page loads correctly
- [ ] Register page loads correctly
- [ ] No console errors in browser

## ✅ Authentication Tests

### Test Registration
1. Go to `/register`
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
3. Click "Register"

**Expected:**
- [ ] Registration successful
- [ ] Redirected to dashboard
- [ ] User data visible in navbar
- [ ] User created in MongoDB

### Test Login
1. Go to `/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: test123
3. Click "Login"

**Expected:**
- [ ] Login successful
- [ ] Redirected to dashboard
- [ ] Token stored in cookies
- [ ] User data visible

### Test Logout
1. Click "Logout" button

**Expected:**
- [ ] Logged out successfully
- [ ] Redirected to login page
- [ ] Token removed from cookies

## ✅ Appointment Tests (User)

### Test Book Appointment
1. Login as regular user
2. Click "Book Appointment"
3. Fill in:
   - Date: Future date
   - Time Slot: Select from available slots
   - Reason: Test appointment
4. Click "Book Appointment"

**Expected:**
- [ ] Appointment created successfully
- [ ] Appears in "Upcoming Appointments"
- [ ] Status is "Pending"
- [ ] Saved in MongoDB

### Test View Appointments
1. View dashboard

**Expected:**
- [ ] Upcoming appointments visible
- [ ] Appointment history visible
- [ ] Status badges display correctly

### Test Cancel Appointment
1. Find a pending appointment
2. Click "Cancel"

**Expected:**
- [ ] Appointment cancelled
- [ ] Removed from upcoming list
- [ ] Slot freed up
- [ ] Updated in MongoDB

## ✅ Admin Tests

### Create Admin User
```bash
cd backend
npm run create-admin admin@test.com admin123
```

**Expected:**
- [ ] Admin user created
- [ ] Role is "ADMIN"
- [ ] Can login with admin credentials

### Test Admin Dashboard
1. Login as admin
2. View dashboard

**Expected:**
- [ ] Admin dashboard loads
- [ ] Statistics visible (total, pending, approved, etc.)
- [ ] All appointments visible (not just own)

### Test Create Slot
1. Click "Create Slot"
2. Fill in:
   - Date: Future date
   - Time Slot: 10:00 AM - 11:00 AM
3. Click "Create Slot"

**Expected:**
- [ ] Slot created successfully
- [ ] Appears in slot list
- [ ] Marked as available
- [ ] Saved in MongoDB

### Test Approve Appointment
1. Find a pending appointment
2. Click "Approve"

**Expected:**
- [ ] Status changed to "Approved"
- [ ] Updated in database
- [ ] User can see updated status

### Test Reject Appointment
1. Find a pending appointment
2. Click "Reject"

**Expected:**
- [ ] Status changed to "Rejected"
- [ ] Slot freed up
- [ ] Updated in database

## ✅ Database Verification

### Check MongoDB Collections
```javascript
// Connect to MongoDB
use queueless

// Check users
db.users.find().pretty()

// Check appointments
db.appointments.find().pretty()

// Check slots
db.slots.find().pretty()
```

**Expected:**
- [ ] Users collection has registered users
- [ ] Appointments collection has booked appointments
- [ ] Slots collection has created slots
- [ ] Data relationships correct (userId references)

## ✅ API Endpoint Tests

### Test Auth Endpoints
```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test2@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Expected:**
- [ ] Registration returns user and token
- [ ] Login returns user and token

### Test Protected Endpoints
```bash
# Get appointments (requires token)
curl -X GET http://localhost:5000/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get slots
curl -X GET http://localhost:5000/slots
```

**Expected:**
- [ ] Returns data with valid token
- [ ] Returns 401 without token

## ✅ Error Handling Tests

### Test Invalid Login
1. Try login with wrong password

**Expected:**
- [ ] Error message displayed
- [ ] Not redirected to dashboard

### Test Duplicate Registration
1. Try register with existing email

**Expected:**
- [ ] Error message displayed
- [ ] User not created

### Test Booking Without Slot
1. Try book appointment without selecting slot

**Expected:**
- [ ] Validation error
- [ ] Appointment not created

## ✅ Final Verification

- [ ] All authentication flows work
- [ ] All CRUD operations work
- [ ] Data persists in MongoDB
- [ ] Admin features work
- [ ] User features work
- [ ] No console errors
- [ ] No API errors
- [ ] UI is responsive
- [ ] All routes protected correctly

## 🎉 Success Criteria

Your application is fully working if:
- ✅ Backend starts without errors
- ✅ Frontend starts without errors
- ✅ Can register and login
- ✅ Can book appointments
- ✅ Can view appointments
- ✅ Admin can manage appointments
- ✅ Data saves to MongoDB
- ✅ No runtime errors

---

**If all checks pass, your QueueLess application is fully functional!** 🚀

