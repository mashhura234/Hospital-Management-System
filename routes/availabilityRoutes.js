const express = require('express');
const router = express.Router();
const {
  addAvailability,
  getDoctorAvailability,
  getMyAvailability,
  deleteAvailability
} = require('../controllers/availabilityController');

const { verifyToken, verifyDoctor } = require('../middleware/authMiddleware');

// POST /api/availability - doctor adds a new slot
router.post('/', verifyToken, verifyDoctor, addAvailability);

// GET /api/availability/my - doctor views their own slots
router.get('/my', verifyToken, verifyDoctor, getMyAvailability);

// GET /api/availability/:doctor_id - patient views a doctor's available slots
router.get('/:doctor_id', verifyToken, getDoctorAvailability);

// DELETE /api/availability/:id - doctor deletes a slot
router.delete('/:id', verifyToken, verifyDoctor, deleteAvailability);

module.exports = router;