const { sql, poolPromise } = require('../config/db');

// GET ALL PATIENTS
const getAllPatients = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT p.id, u.name, u.email,
               p.age, p.gender, p.phone
        FROM Patients p
        JOIN Users u ON p.user_id = u.id
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET SINGLE PATIENT
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT p.id, u.name, u.email,
               p.age, p.gender, p.phone
        FROM Patients p
        JOIN Users u ON p.user_id = u.id
        WHERE p.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// CREATE PATIENT
const createPatient = async (req, res) => {
  try {
    const { user_id, age, gender, phone } = req.body;

    if (!user_id || !age || !gender || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const pool = await poolPromise;

    // Check if user exists and has patient role
    const user = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query("SELECT * FROM Users WHERE id = @user_id AND role = 'patient'");

    if (user.recordset.length === 0) {
      return res.status(404).json({ message: 'Patient user not found.' });
    }

    // Check if patient profile already exists
    const existingPatient = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT * FROM Patients WHERE user_id = @user_id');

    if (existingPatient.recordset.length > 0) {
      return res.status(400).json({ message: 'Patient profile already exists.' });
    }

    // Insert new patient
    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('age', sql.Int, age)
      .input('gender', sql.VarChar, gender)
      .input('phone', sql.VarChar, phone)
      .query('INSERT INTO Patients (user_id, age, gender, phone) OUTPUT INSERTED.id VALUES (@user_id, @age, @gender, @phone)');

    res.status(201).json({
      message: 'Patient created successfully!',
      patientId: result.recordset[0].id
    });

  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// UPDATE PATIENT
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { age, gender, phone } = req.body;

    const pool = await poolPromise;

    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Patients WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('age', sql.Int, age)
      .input('gender', sql.VarChar, gender)
      .input('phone', sql.VarChar, phone)
      .query('UPDATE Patients SET age = @age, gender = @gender, phone = @phone WHERE id = @id');

    res.status(200).json({ message: 'Patient updated successfully!' });

  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// DELETE PATIENT
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;

    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Patients WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Patients WHERE id = @id');

    res.status(200).json({ message: 'Patient deleted successfully!' });

  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};