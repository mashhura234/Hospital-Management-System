const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// GET /api/departments - anyone logged in can view
router.get('/', verifyToken, getAllDepartments);

// GET /api/departments/:id - anyone logged in can view
router.get('/:id', verifyToken, getDepartmentById);

// POST /api/departments - only admin can create
router.post('/', verifyToken, verifyAdmin, createDepartment);

// PUT /api/departments/:id - only admin can update
router.put('/:id', verifyToken, verifyAdmin, updateDepartment);

// DELETE /api/departments/:id - only admin can delete
router.delete('/:id', verifyToken, verifyAdmin, deleteDepartment);

module.exports = router;