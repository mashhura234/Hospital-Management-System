// Import required packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection (this also tests the connection)
const db = require('./config/db');

// Import all route files
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Create express app
const app = express();

// MIDDLEWARE
app.use(cors({ origin: '*'}));               // Allow frontend to call this backend
app.use(express.json());       // Allow backend to read JSON data from requests

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// TEST ROUTE - just to check if server is working
app.get('/', (req, res) => {
  res.json({ message: 'Hospital Management System API is running! 🏥' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});