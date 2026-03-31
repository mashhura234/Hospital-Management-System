const db = require('../config/db');


// GET ALL APPOINTMENTS
const getAllAppointments = async (req, res) => {
  try {
    const [appointments] = await db.query(`
      SELECT a.id,
             u_patient.name AS patient_name,
             u_doctor.name AS doctor_name,
             dept.name AS department_name,
             a.date, a.time, a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u_patient ON p.user_id = u_patient.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u_doctor ON d.user_id = u_doctor.id
      JOIN departments dept ON d.department_id = dept.id
    `);
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// GET SINGLE APPOINTMENT
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [appointment] = await db.query(`
      SELECT a.id,
             u_patient.name AS patient_name,
             u_doctor.name AS doctor_name,
             dept.name AS department_name,
             a.date, a.time, a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u_patient ON p.user_id = u_patient.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u_doctor ON d.user_id = u_doctor.id
      JOIN departments dept ON d.department_id = dept.id
      WHERE a.id = ?
    `, [id]);

    if (appointment.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(appointment[0]);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// BOOK APPOINTMENT
const bookAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time } = req.body;

    // Check if all fields are provided
    if (!patient_id || !doctor_id || !date || !time) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if patient exists
    const [patient] = await db.query(
      'SELECT * FROM patients WHERE id = ?', [patient_id]
    );

    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Check if doctor exists
    const [doctor] = await db.query(
      'SELECT * FROM doctors WHERE id = ?', [doctor_id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Check if appointment already exists at same date and time
    const [existing] = await db.query(
      'SELECT * FROM appointments WHERE doctor_id = ? AND date = ? AND time = ?',
      [doctor_id, date, time]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: 'This time slot is already booked. Please choose another time.'
      });
    }

    // Book appointment
    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, date, time, 'pending']
    );

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointmentId: result.insertId
    });

  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// UPDATE APPOINTMENT STATUS
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status value
    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status. Use: pending, completed, or cancelled.'
      });
    }

    // Check if appointment exists
    const [existing] = await db.query(
      'SELECT * FROM appointments WHERE id = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Update status
    await db.query(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, id]
    );

    res.status(200).json({ message: 'Appointment status updated successfully!' });

  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// DELETE APPOINTMENT
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if appointment exists
    const [existing] = await db.query(
      'SELECT * FROM appointments WHERE id = ?', [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Delete appointment
    await db.query('DELETE FROM appointments WHERE id = ?', [id]);

    res.status(200).json({ message: 'Appointment deleted successfully!' });

  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  bookAppointment,
  updateAppointment,
  deleteAppointment
};