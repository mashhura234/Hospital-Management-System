const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  bookAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// GET /api/appointments - admin and doctor can view all
router.get('/', verifyToken, getAllAppointments);

// GET /api/appointments/:id - anyone logged in can view
router.get('/:id', verifyToken, getAppointmentById);

// POST /api/appointments - patient can book
router.post('/', verifyToken, bookAppointment);

// PUT /api/appointments/:id - admin or doctor can update status
router.put('/:id', verifyToken, updateAppointment);

// DELETE /api/appointments/:id - admin only
router.delete('/:id', verifyToken, verifyAdmin, deleteAppointment);

module.exports = router;