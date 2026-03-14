const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// GET /api/doctors - anyone logged in can view
router.get('/', verifyToken, getAllDoctors);

// GET /api/doctors/:id - anyone logged in can view
router.get('/:id', verifyToken, getDoctorById);

// POST /api/doctors - only admin can create
router.post('/', verifyToken, verifyAdmin, createDoctor);

// PUT /api/doctors/:id - only admin can update
router.put('/:id', verifyToken, verifyAdmin, updateDoctor);

// DELETE /api/doctors/:id - only admin can delete
router.delete('/:id', verifyToken, verifyAdmin, deleteDoctor);

module.exports = router;