const { sql, poolPromise } = require('../config/db');

// GET ALL APPOINTMENTS
const getAllAppointments = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query(`
        SELECT a.id,
               u_patient.name AS patient_name,
               u_doctor.name AS doctor_name,
               dept.name AS department_name,
               a.date, a.time, a.status
        FROM Appointments a
        JOIN Patients p ON a.patient_id = p.id
        JOIN Users u_patient ON p.user_id = u_patient.id
        JOIN Doctors d ON a.doctor_id = d.id
        JOIN Users u_doctor ON d.user_id = u_doctor.id
        JOIN Departments dept ON d.department_id = dept.id
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET SINGLE APPOINTMENT
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT a.id,
               u_patient.name AS patient_name,
               u_doctor.name AS doctor_name,
               dept.name AS department_name,
               a.date, a.time, a.status
        FROM Appointments a
        JOIN Patients p ON a.patient_id = p.id
        JOIN Users u_patient ON p.user_id = u_patient.id
        JOIN Doctors d ON a.doctor_id = d.id
        JOIN Users u_doctor ON d.user_id = u_doctor.id
        JOIN Departments dept ON d.department_id = dept.id
        WHERE a.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// BOOK APPOINTMENT
const bookAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, availability_id } = req.body;

    if (!patient_id || !doctor_id || !availability_id) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const pool = await poolPromise;

    // Check if patient exists
    const patient = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .query('SELECT * FROM Patients WHERE id = @patient_id');

    if (patient.recordset.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    // Check if doctor exists
    const doctor = await pool.request()
      .input('doctor_id', sql.Int, doctor_id)
      .query('SELECT * FROM Doctors WHERE id = @doctor_id');

    if (doctor.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor not found.' });
    }

    // Check if availability slot exists and is not already booked
    const slot = await pool.request()
      .input('availability_id', sql.Int, availability_id)
      .query('SELECT * FROM DoctorAvailability WHERE id = @availability_id AND is_booked = 0');

    if (slot.recordset.length === 0) {
      return res.status(400).json({ message: 'This slot is not available. Please choose another.' });
    }

    const { available_date, available_time } = slot.recordset[0];

    // Book the appointment
    const result = await pool.request()
      .input('patient_id', sql.Int, patient_id)
      .input('doctor_id', sql.Int, doctor_id)
      .input('availability_id', sql.Int, availability_id)
      .input('date', sql.Date, available_date)
      .input('time', sql.Time, available_time)
      .query(`
        INSERT INTO Appointments (patient_id, doctor_id, availability_id, date, time, status)
        OUTPUT INSERTED.id
        VALUES (@patient_id, @doctor_id, @availability_id, @date, @time, 'pending')
      `);

    // Mark the slot as booked
    await pool.request()
      .input('availability_id', sql.Int, availability_id)
      .query('UPDATE DoctorAvailability SET is_booked = 1 WHERE id = @availability_id');

    res.status(201).json({
      message: 'Appointment booked successfully!',
      appointmentId: result.recordset[0].id
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

    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use: pending, completed, or cancelled.' });
    }

    const pool = await poolPromise;

    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Appointments WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .input('status', sql.VarChar, status)
      .query('UPDATE Appointments SET status = @status WHERE id = @id');

    // If cancelled, free up the availability slot
    if (status === 'cancelled') {
      const availability_id = existing.recordset[0].availability_id;
      await pool.request()
        .input('availability_id', sql.Int, availability_id)
        .query('UPDATE DoctorAvailability SET is_booked = 0 WHERE id = @availability_id');
    }

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

    const pool = await poolPromise;

    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Appointments WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // Free up the slot before deleting
    const availability_id = existing.recordset[0].availability_id;
    await pool.request()
      .input('availability_id', sql.Int, availability_id)
      .query('UPDATE DoctorAvailability SET is_booked = 0 WHERE id = @availability_id');

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Appointments WHERE id = @id');

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