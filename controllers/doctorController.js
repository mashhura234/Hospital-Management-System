const { sql, poolPromise } = require('../config/db');

// GET ALL DOCTORS
const getAllDoctors = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT d.id, u.name, u.email, u.role,
               dept.name AS department_name,
               d.specialization, d.phone
        FROM Doctors d
        JOIN Users u ON d.user_id = u.id
        JOIN Departments dept ON d.department_id = dept.id
      `);
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET SINGLE DOCTOR
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT d.id, u.name, u.email,
               dept.name AS department_name,
               d.specialization, d.phone
        FROM Doctors d
        JOIN Users u ON d.user_id = u.id
        JOIN Departments dept ON d.department_id = dept.id
        WHERE d.id = @id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// CREATE DOCTOR
const createDoctor = async (req, res) => {
  try {
    const { user_id, department_id, specialization, phone } = req.body;
    const tokenUserId = req.user.id;
    const tokenUserRole = req.user.role;

    if (!user_id || !department_id || !specialization || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (user_id !== tokenUserId && tokenUserRole !== 'admin') {
      return res.status(403).json({ message: 'You can only create a profile for yourself.' });
    }

    const pool = await poolPromise;

    const user = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query("SELECT * FROM Users WHERE id = @user_id AND role = 'doctor'");

    if (user.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor user not found.' });
    }

    const department = await pool.request()
      .input('department_id', sql.Int, department_id)
      .query('SELECT * FROM Departments WHERE id = @department_id');

    if (department.recordset.length === 0) {
      return res.status(404).json({ message: 'Department not found.' });
    }

    const existingDoctor = await pool.request()
      .input('user_id', sql.Int, user_id)
      .query('SELECT * FROM Doctors WHERE user_id = @user_id');

    if (existingDoctor.recordset.length > 0) {
      return res.status(400).json({ message: 'Doctor profile already exists.' });
    }

    const result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('department_id', sql.Int, department_id)
      .input('specialization', sql.VarChar, specialization)
      .input('phone', sql.VarChar, phone)
      .query('INSERT INTO Doctors (user_id, department_id, specialization, phone) OUTPUT INSERTED.id VALUES (@user_id, @department_id, @specialization, @phone)');

    res.status(201).json({
      message: 'Doctor created successfully!',
      doctorId: result.recordset[0].id
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
    const { department_id, specialization, phone, degrees, name } = req.body;
    const pool = await poolPromise;

    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Doctors WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Update doctor profile
    await pool.request()
      .input('id', sql.Int, id)
      .input('specialization', sql.VarChar, specialization)
      .input('phone', sql.VarChar, phone)
      .input('degrees', sql.VarChar, degrees || '')
      .query('UPDATE Doctors SET specialization = @specialization, phone = @phone, degrees = @degrees WHERE id = @id');

    // Update name in Users table if provided
    if (name) {
      const doctorData = existing.recordset[0];
      await pool.request()
        .input('user_id', sql.Int, doctorData.user_id)
        .input('name', sql.VarChar, name)
        .query('UPDATE Users SET name = @name WHERE id = @user_id');
    }

    res.status(200).json({ message: 'Doctor profile updated successfully!' });
  } catch (error) {
    console.error('Update doctor error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// DELETE DOCTOR
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Doctors WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Doctors WHERE id = @id');

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