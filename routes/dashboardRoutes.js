const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getDoctorStats,
  getPatientStats
} = require('../controllers/dashboardController');

const { verifyToken, verifyAdmin, verifyDoctor, verifyPatient } = require('../middleware/authMiddleware');

// GET /api/dashboard/admin - admin only
router.get('/admin', verifyToken, verifyAdmin, getAdminStats);

// GET /api/dashboard/doctor - doctor only
router.get('/doctor', verifyToken, verifyDoctor, getDoctorStats);

// GET /api/dashboard/patient - patient only
router.get('/patient', verifyToken, verifyPatient, getPatientStats);

module.exports = router;