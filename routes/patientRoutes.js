const express = require('express');
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} = require('../controllers/patientController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// GET /api/patients - admin and doctor can view
router.get('/', verifyToken, getAllPatients);

// GET /api/patients/:id - admin and doctor can view
router.get('/:id', verifyToken, getPatientById);

// POST /api/patients - any logged in user can create
router.post('/', verifyToken, createPatient);

// PUT /api/patients/:id - admin only
router.put('/:id', verifyToken, verifyAdmin, updatePatient);

// DELETE /api/patients/:id - admin only
router.delete('/:id', verifyToken, verifyAdmin, deletePatient);

module.exports = router;