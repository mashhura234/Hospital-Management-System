// 1. Import required packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 2. Initialize environment variables
dotenv.config();

// 3. Create express app (CRITICAL: Must be done before app.use)
const app = express();

// 4. Import database connection
const db = require('./config/db');

// 5. MIDDLEWARE
// Enable CORS to allow your React frontend (port 3000) to talk to this backend
app.use(cors({ origin: '*' })); 
// Allow backend to read JSON data from incoming requests (Axios sends JSON)
app.use(express.json()); 

// 6. Import all route files
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// 7. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 8. TEST ROUTE
app.get('/', (req, res) => {
  res.json({ message: 'Hospital Management System API is running! 🏥' });
});

// 9. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});