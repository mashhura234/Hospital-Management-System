# 🏥 Hospital Management System - Registration/Login Fix Guide

## ✅ Issues Fixed

### 1. **Missing JWT_SECRET** 
- **File**: `.env`
- **Fix Applied**: Added `JWT_SECRET=your_super_secret_key_12345_change_in_production`
- **Action Needed**: Change this to a stronger secret in production!

### 2. **Missing Content-Type Headers**
- **Files**: `Register.jsx`, `Login.jsx`
- **Fix Applied**: Added explicit `Content-Type: application/json` headers to all axios calls
- **Why**: Ensures backend correctly parses JSON payload

### 3. **Missing Database Tables**
- **Issue**: Registration tries to insert into `users` table which doesn't exist
- **Fix Applied**: 
  - Created `config/initDb.js` - Automatic table initialization script
  - Updated `server.js` to call `initializeTables()` on startup
  - Created `database_setup.sql` for manual setup if needed

### 4. **Registration Logic** ✓ 
- **Status**: CORRECT - Properly checks for existing users before insertion
- **Code**: `SELECT * FROM users WHERE email = ?`

### 5. **Database Connection** ✓
- **Status**: CORRECT - Uses .env variables (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)

---

## 🚀 Next Steps

### Step 1: Verify Backend is Running
```bash
cd Hospital-Management-System
npm start
```
You should see:
```
✅ Database connected successfully!
✅ All database tables initialized successfully!
✅ Server is running on http://localhost:5000
```

### Step 2: Verify Frontend URL
- Frontend should be on `http://localhost:3000`
- Backend should be on `http://localhost:5000`
- Axios calls will go to `/api/auth/register` and `/api/auth/login`

### Step 3: Test Registration
1. Go to http://localhost:3000/register
2. Fill in the form with:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123456
   - Role: Patient
3. Click Register
4. Should see "Registration successful!" message

### Step 4: Test Login
1. Go to http://localhost:3000/login
2. Use the same email/password from registration
3. Should see dashboard based on role

---

## 🔍 Debugging Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000  
- [ ] Check browser DevTools > Network tab - see all API responses
- [ ] Check backend console for error messages
- [ ] Ensure MySQL is running and `hospital_db` exists
- [ ] Check that users table was created (tables auto-created on startup)
- [ ] Verify .env file has all required variables

---

## 📋 Database Schema

The `users` table now includes:
```sql
fields: id, name, email, password, phone, age, gender, role
unique: email
indexes: email, role
```

Related tables auto-created:
- `departments` - For hospital departments
- `doctors` - Links users as doctors with department & specialization
- `patients` - Links users as patients with medical history
- `appointments` - Links patients & doctors for scheduling

---

## ⚠️ Important Notes

1. **JWT Secret**: Change in production! Currently set to a placeholder value.
2. **Password**: Stored hashed using bcryptjs (bcrypt) - never stored plain text ✓
3. **CORS**: Enabled for all origins (`*`) - change in production!
4. **Token**: Expires in 7 days
5. **Email**: Must be unique per user

---

## 📝 Files Modified

1. ✏️ `.env` - Added JWT_SECRET
2. ✏️ `hospital-frontend/src/pages/auth/Register.jsx` - Added Content-Type headers
3. ✏️ `hospital-frontend/src/pages/auth/Login.jsx` - Added Content-Type headers
4. ✏️ `server.js` - Added database initialization call
5. ✨ `config/initDb.js` - NEW: Auto-creates all database tables
6. 📄 `database_setup.sql` - Manual SQL setup (if needed)

---

## 🆘 Still Getting "Server error"?

### Check 1: Backend Connection
```bash
curl http://localhost:5000
# Should return: {"message":"Hospital Management System API is running!"}
```

### Check 2: Registration Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test123","role":"patient"}'
```

### Check 3: Database
- Open MySQL command line
- Run: `USE hospital_db; DESCRIBE users;`
- Should show all user columns

### Check 4: Server Logs
- Look for any error messages in backend terminal
- Check `/api/auth/register` endpoint in `controllers/authController.js`
