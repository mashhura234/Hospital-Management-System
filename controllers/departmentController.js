const db = require('../config/db');

// GET ALL DEPARTMENTS

const getAllDepartments = async (req, res) => {
  try {
    const [departments] = await db.query('SELECT * FROM departments');
    res.status(200).json(departments);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET SINGLE DEPARTMENT

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [department] = await db.query(
      'SELECT * FROM departments WHERE id = ?', [id]
    );

    if (department.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    res.status(200).json(department[0]);
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// CREATE DEPARTMENT

const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: 'Department name is required.' });
    }

    // Check if department already exists
    const [existing] = await db.query(
      'SELECT * FROM departments WHERE name = ?', [name]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Department already exists.' });
    }

    // Insert new department
    const [result] = await db.query(
      'INSERT INTO departments (name, description) VALUES (?, ?)',
      [name, description]
    );

    res.status(201).json({
      message: 'Department created successfully!',
      departmentId: result.insertId
    });

  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// UPDATE DEPARTMENT

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if department exists
    const [existing] = await db.query(
      'SELECT * FROM departments WHERE id = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    // Update department
    await db.query(
      'UPDATE departments SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );

    res.status(200).json({ message: 'Department updated successfully!' });

  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// DELETE DEPARTMENT

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if department exists
    const [existing] = await db.query(
      'SELECT * FROM departments WHERE id = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    // Delete department
    await db.query('DELETE FROM departments WHERE id = ?', [id]);

    res.status(200).json({ message: 'Department deleted successfully!' });

  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};