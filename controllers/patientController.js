const db = require('../config/db');

// GET ALL PATIENTS
const getAllPatients = async (req, res) => {
  try {
    const [patients] = await db.query(`
      SELECT p.id, u.name, u.email,
             p.age, p.gender, p.phone
      FROM patients p
      JOIN users u ON p.user_id = u.id
    `);
    res.status(200).json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET SINGLE PATIENT
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const [patient] = await db.query(`
      SELECT p.id, u.name, u.email,
             p.age, p.gender, p.phone
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.status(200).json(patient[0]);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// CREATE PATIENT
const createPatient = async (req, res) => {
  try {
    const { user_id, age, gender, phone } = req.body;

    // Check if all fields are provided
    if (!user_id || !age || !gender || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user exists and has patient role
    const [user] = await db.query(
      'SELECT * FROM users WHERE id = ? AND role = ?', [user_id, 'patient']
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'Patient user not found.' });
    }

    // Check if patient profile already exists
    const [existingPatient] = await db.query(
      'SELECT * FROM patients WHERE user_id = ?', [user_id]
    );

    if (existingPatient.length > 0) {
      return res.status(400).json({ message: 'Patient profile already exists.' });
    }

    // Insert new patient
    const [result] = await db.query(
      'INSERT INTO patients (user_id, age, gender, phone) VALUES (?, ?, ?, ?)',
      [user_id, age, gender, phone]
    );

    res.status(201).json({
      message: 'Patient created successfully!',
      patientId: result.insertId
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

    // Check if patient exists
    const [existing] = await db.query(
      'SELECT * FROM patients WHERE id = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Update patient
    await db.query(
      'UPDATE patients SET age = ?, gender = ?, phone = ? WHERE id = ?',
      [age, gender, phone, id]
    );

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

    // Check if patient exists
    const [existing] = await db.query(
      'SELECT * FROM patients WHERE id = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Delete patient
    await db.query('DELETE FROM patients WHERE id = ?', [id]);

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
