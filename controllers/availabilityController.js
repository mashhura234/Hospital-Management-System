const { sql, poolPromise } = require('../config/db');

// DOCTOR ADDS AVAILABLE SLOT
const addAvailability = async (req, res) => {
  try {
    const { available_date, available_time, available_end_time } = req.body;

    if (!available_date || !available_time || !available_end_time) {
      return res.status(400).json({ message: 'Date, start time and end time are required.' });
    }

    const formatTime = (t) => {
      const parts = t.split(':');
      return parts.length === 2 ? `${t}:00` : t;
    };

    const formattedStart = formatTime(available_time);
    const formattedEnd = formatTime(available_end_time);

    const pool = await poolPromise;

    const doctor = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT * FROM Doctors WHERE user_id = @user_id');

    if (doctor.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor profile not found. Please contact admin.' });
    }

    const doctorId = doctor.recordset[0].id;

    const existing = await pool.request()
      .input('doctor_id', sql.Int, doctorId)
      .input('available_date', sql.Date, available_date)
      .input('available_time', sql.VarChar, formattedStart)
      .query(`
        SELECT * FROM DoctorAvailability
        WHERE doctor_id = @doctor_id
        AND available_date = @available_date
        AND available_time = @available_time
      `);

    if (existing.recordset.length > 0) {
      return res.status(400).json({ message: 'This slot already exists.' });
    }

    const result = await pool.request()
      .input('doctor_id', sql.Int, doctorId)
      .input('available_date', sql.Date, available_date)
      .input('available_time', sql.VarChar, formattedStart)
      .input('available_end_time', sql.VarChar, formattedEnd)
      .query(`
        INSERT INTO DoctorAvailability (doctor_id, available_date, available_time, available_end_time, is_booked)
        OUTPUT INSERTED.id
        VALUES (@doctor_id, @available_date, @available_time, @available_end_time, 0)
      `);

    res.status(201).json({
      message: 'Availability slot added successfully!',
      slotId: result.recordset[0].id
    });

  } catch (error) {
    console.error('Add availability error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET ALL AVAILABLE SLOTS FOR A DOCTOR (for patients to view)
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const pool = await poolPromise;

    const result = await pool.request()
      .input('doctor_id', sql.Int, doctor_id)
      .query(`
        SELECT da.id, da.available_date, da.available_time, da.available_end_time, da.is_booked,
               u.name AS doctor_name,
               dept.name AS department_name,
               d.specialization
        FROM DoctorAvailability da
        JOIN Doctors d ON da.doctor_id = d.id
        JOIN Users u ON d.user_id = u.id
        JOIN Departments dept ON d.department_id = dept.id
        WHERE da.doctor_id = @doctor_id
        AND da.is_booked = 0
        AND da.available_date >= CAST(GETDATE() AS DATE)
        ORDER BY da.available_date, da.available_time
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// GET MY AVAILABILITY SLOTS
const getMyAvailability = async (req, res) => {
  try {
    const pool = await poolPromise;

    const doctor = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT * FROM Doctors WHERE user_id = @user_id');

    if (doctor.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor profile not found.' });
    }

    const doctorId = doctor.recordset[0].id;

    const result = await pool.request()
      .input('doctor_id', sql.Int, doctorId)
      .query(`
        SELECT * FROM DoctorAvailability
        WHERE doctor_id = @doctor_id
        ORDER BY available_date, available_time
      `);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Get my availability error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// DELETE AVAILABILITY SLOT
const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const existing = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM DoctorAvailability WHERE id = @id');

    if (existing.recordset.length === 0) {
      return res.status(404).json({ message: 'Slot not found.' });
    }

    if (existing.recordset[0].is_booked === true) {
      return res.status(400).json({ message: 'Cannot delete a booked slot.' });
    }

    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM DoctorAvailability WHERE id = @id');

    res.status(200).json({ message: 'Availability slot deleted successfully!' });

  } catch (error) {
    console.error('Delete availability error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = {
  addAvailability,
  getDoctorAvailability,
  getMyAvailability,
  deleteAvailability
};