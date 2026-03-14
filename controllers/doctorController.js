const db = require('../config/db');


// GET ALL DOCTORS
const getAllDoctors = async (req, res) => {
  try {
    // Join with users and departments to get full info
    const [doctors] = await db.query(`
      SELECT d.id, u.name, u.email, u.role,
             dept.name AS department_name,
             d.specialization, d.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN departments dept ON d.department_id = dept.id
    `);
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// GET SINGLE DOCTOR
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [doctor] = await db.query(`
      SELECT d.id, u.name, u.email,
             dept.name AS department_name,
             d.specialization, d.phone
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN departments dept ON d.department_id = dept.id
      WHERE d.id = ?
    `, [id]);

    if (doctor.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    res.status(200).json(doctor[0]);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// CREATE DOCTOR
const createDoctor = async (req, res) => {
  try {
    const { user_id, department_id, specialization, phone } = req.body;

    // Check if all fields are provided
    if (!user_id || !department_id || !specialization || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user exists and has doctor role
    const [user] = await db.query(
      'SELECT * FROM users WHERE id = ? AND role = ?', [user_id, 'doctor']
    );

    if (user.length === 0) {
      return res.status(404).json({ message: 'Doctor user not found.' });
    }

    // Check if department exists
    const [department] = await db.query(
      'SELECT * FROM departments WHERE id = ?', [department_id]
    );

    if (department.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    // Check if doctor profile already exists for this user
    const [existingDoctor] = await db.query(
      'SELECT * FROM doctors WHERE user_id = ?', [user_id]
    );

    if (existingDoctor.length > 0) {
      return res.status(400).json({ message: 'Doctor profile already exists.' });
    }

    // Insert new doctor
    const [result] = await db.query(
      'INSERT INTO doctors (user_id, department_id, specialization, phone) VALUES (?, ?, ?, ?)',
      [user_id, department_id, specialization, phone]
    );

    res.status(201).json({
      message: 'Doctor created successfully!',
      doctorId: result.insertId
    });

  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// UPDATE DOCTOR
const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { department_id, specialization, phone } = req.body;

    // Check if doctor exists
    const [existing] = await db.query(
      'SELECT * FROM doctors WHERE id = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Update doctor
    await db.query(
      'UPDATE doctors SET department_id = ?, specialization = ?, phone = ? WHERE id = ?',
      [department_id, specialization, phone, id]
    );

    res.status(200).json({ message: 'Doctor updated successfully!' });

  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if doctor exists
    const [existing] = await db.query(
      'SELECT * FROM doctors WHERE id = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Delete doctor
    await db.query('DELETE FROM doctors WHERE id = ?', [id]);

    res.status(200).json({ message: 'Doctor deleted successfully!' });

  } catch (error) {
    console.error('Delete doctor error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};