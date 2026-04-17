const { sql, poolPromise } = require('../config/db');

// GET ALL DEPARTMENTS

const getAllDepartments = async (req, res) => {
  try {
     const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Departments');

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET SINGLE DEPARTMENT
//----------------------------
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Departments WHERE id = @id'
    );

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// CREATE DEPARTMENT
//-------------------
const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: 'Department name is required.' });
    }

     const pool = await poolPromise;

    // Check if department already exists
    const existing = await pool.request()
      .input('name', sql.VarChar, name)
      .query('SELECT * FROM Departments WHERE name = @name'
      );

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: 'Department already exists.' });
    }

    // Insert new department
   const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .query('INSERT INTO Departments (name, description) OUTPUT INSERTED.id VALUES (@name, @description)'
      );

    res.status(201).json({
      message: 'Department created successfully!',
      departmentId: result.recordset[0].id
    });

  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// UPDATE DEPARTMENT
//-------------------------
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const pool = await poolPromise;

    // Check if department exists
   const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Departments WHERE id = @id'
    );

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    // Update department
    await pool.request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .query('UPDATE Departments SET name = @name, description = @description WHERE id = @id'
    );

    res.status(200).json({ message: 'Department updated successfully!' });

  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// DELETE DEPARTMENT
//------------------------
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    // Check if department exists
    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Departments WHERE id = @id'
    );

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    // Delete department
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Departments WHERE id = @id');

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