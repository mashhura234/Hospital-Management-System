# 🧪 Quick Testing Guide

## 📌 Three Key Features to Test

### 1. Role Selection in Login Form
```
✅ Visual Check:
   - Open http://localhost:3000/login
   - Should see new dropdown below password field
   - Options: Admin, Doctor, Patient (Patient selected by default)
   - Dropdown changes form state when clicked
   - Form won't submit without selecting a role
```

### 2. Doctor Registration Without Admin Access
```
✅ Test Registration:
   1. Go to http://localhost:3000/register
   2. Select role: "Doctor"
   3. Fill form:
      - Name: Dr. Test User
      - Email: doctor@test.com
      - Password: Test123456
      - Confirm Password: Test123456
   4. Click Register
   
   ✅ Expected: "Registration successful! Redirecting to login..."
   ❌ OLD ERROR (now fixed): "Access Denied: Admin Only"
```

### 3. User Data in Sidebar
```
✅ Visual Check After Login:
   - Login with registered account
   - Look at Sidebar (left panel)
   - Should show:
     ┌────────────────────┐
     │  Avatar (initials) │
     │  John Doe          │  ← Your name (from DB)
     │  john@test.com     │  ← Your email (from DB)
     │  Doctor            │  ← Your role (from DB)
     └────────────────────┘
   
   ✅ NOT hardcoded like before ("Dr. Kamal")
```

---

## 🔍 DevTools Verification

### After Successful Login:
```
1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "localStorage" on left
4. Should see TWO items:

   token: "eyJhbGc..."  (long JWT token)
   user: {
     "id": 1,
     "name": "John Doe",
     "email": "john@test.com",
     "role": "doctor"
   }
```

### After Logout:
```
1. Click Logout button
2. Returns to login page
3. Open DevTools > Application > localStorage
4. Should be EMPTY (both token and user removed)
```

---

## 🚨 Troubleshooting

### Issue: "Email already registered" on register
```
✅ Solution: Use a new email address
   Try: doctor2@test.com instead of doctor@test.com
```

### Issue: Role dropdown not showing on login
```
✅ Solution: Clear browser cache
   - DevTools > Network tab > Disable cache
   - Refresh page (Ctrl+F5)
```

### Issue: Sidebar still shows "Dr. Kamal"
```
✅ Solution: Ensure you're logged in
- Logout (clears localStorage)
- Login again with your credentials
- Should show your actual name
```

### Issue: "Access Denied: Admin Only" still appears
```
✅ Solution: Make sure backend is updated
   - Check: routes/doctorRoutes.js line 20
   - Should be: router.post('/', verifyToken, createDoctor);
   - NOT: router.post('/', verifyToken, verifyAdmin, createDoctor);
```

---

## 📱 Test Scenarios

### Scenario 1: Register & Login as Doctor
```
1. Register: Role=Doctor, Email=doctor@example.com
2. Login: Email=doctor@example.com, Password=Test123, Role=Doctor
3. Should go to /doctor/dashboard
4. Sidebar shows your name (not "Dr. Kamal")
```

### Scenario 2: Register & Login as Patient
```
1. Register: Role=Patient, Email=patient@example.com
2. Login: Email=patient@example.com, Password=Test123, Role=Patient
3. Should go to /patient/dashboard
4. Sidebar shows your name
5. Different menu items than doctor
```

### Scenario 3: Multiple Logins
```
1. Login as Patient
2. Note sidebar shows Patient name/role
3. Logout (clears localStorage)
4. Login as Doctor
5. Sidebar now shows Doctor name/role
```

---

## 📊 What Changed

### Before:
```javascript
// Login form
<input name="email" />
<input name="password" />
// ❌ No role selection
// ❌ Doctors couldn't register
// ❌ Sidebar showed "Dr. Kamal" (hardcoded)
// ❌ Email not shown in sidebar
// ❌ Logout didn't clear user data
```

### After:
```javascript
// Login form
<input name="email" />
<input name="password" />
<select name="role">  {/* ✅ NEW */}
  <option>Admin</option>
  <option>Doctor</option>
  <option>Patient</option>
</select>

// Sidebar
// ✅ Shows actual user.name from database
// ✅ Shows user.email
// ✅ Shows user.role
// ✅ Logout clears everything
```

---

## 🎯 Success Criteria

- [ ] Role dropdown visible on login form
- [ ] Can register as Doctor without error
- [ ] Sidebar shows user's actual name (not hardcoded)
- [ ] Sidebar shows user's email
- [ ] Dashboard greeting uses user's name
- [ ] Logout clears localStorage
- [ ] After logout, localStorage is empty
