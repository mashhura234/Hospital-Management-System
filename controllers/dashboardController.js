const { sql, poolPromise } = require('../config/db');

// ADMIN DASHBOARD STATS
const getAdminStats = async (req, res) => {
  try {
    const pool = await poolPromise;

    const doctors = await pool.request()
      .query("SELECT COUNT(*) as total FROM Users WHERE role = 'doctor'");

    const patients = await pool.request()
      .query("SELECT COUNT(*) as total FROM Users WHERE role = 'patient'");

    const departments = await pool.request()
      .query('SELECT COUNT(*) as total FROM Departments');

    const appointments = await pool.request()
      .query('SELECT COUNT(*) as total FROM Appointments');

    const pending = await pool.request()
      .query("SELECT COUNT(*) as total FROM Appointments WHERE status = 'pending'");

    const completed = await pool.request()
      .query("SELECT COUNT(*) as total FROM Appointments WHERE status = 'completed'");

    const cancelled = await pool.request()
      .query("SELECT COUNT(*) as total FROM Appointments WHERE status = 'cancelled'");

    const recentAppointments = await pool.request()
      .query(`
        SELECT TOP 5
               a.id,
               u_patient.name AS patient_name,
               u_doctor.name AS doctor_name,
               a.date, a.time, a.status
        FROM Appointments a
        JOIN Patients p ON a.patient_id = p.id
        JOIN Users u_patient ON p.user_id = u_patient.id
        JOIN Doctors d ON a.doctor_id = d.id
        JOIN Users u_doctor ON d.user_id = u_doctor.id
        ORDER BY a.date DESC, a.time DESC
      `);

    res.status(200).json({
      totalDoctors: doctors.recordset[0].total,
      totalPatients: patients.recordset[0].total,
      totalDepartments: departments.recordset[0].total,
      totalAppointments: appointments.recordset[0].total,
      pendingAppointments: pending.recordset[0].total,
      completedAppointments: completed.recordset[0].total,
      cancelledAppointments: cancelled.recordset[0].total,
      recentAppointments: recentAppointments.recordset
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// DOCTOR DASHBOARD STATS
const getDoctorStats = async (req, res) => {
  try {
    const pool = await poolPromise;

    const doctor = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT * FROM Doctors WHERE user_id = @user_id');

    if (doctor.recordset.length === 0) {
      return res.status(404).json({ message: 'Doctor profile not found.' });
    }

    const doctorId = doctor.recordset[0].id;

    const totalAppointments = await pool.request()
      .input('doctor_id', sql.Int, doctorId)
      .query('SELECT COUNT(*) as total FROM Appointments WHERE doctor_id = @doctor_id');

    const todayAppointments = await pool.request()
      .input('doctor_id', sql.Int, doctorId)
      .query('SELECT COUNT(*) as total FROM Appointments WHERE doctor_id = @doctor_id AND date = CAST(GETDATE() AS DATE)');

    const pending = await pool.request()
      .input('doctor_id', sql.Int, doctorId)
      .query("SELECT COUNT(*) as total FROM Appointments WHERE doctor_id = @doctor_id AND status = 'pending'");

    const completed = await pool.request()
      .input('doctor_id', sql.Int, doctorId)
      .query("SELECT COUNT(*) as total FROM Appointments WHERE doctor_id = @doctor_id AND status = 'completed'");

    const recentAppointments = await pool.request()
      .input('doctor_id', sql.Int, doctorId)
      .query(`
        SELECT TOP 5
               a.id,
               u_patient.name AS patient_name,
               a.date, a.time, a.status
        FROM Appointments a
        JOIN Patients p ON a.patient_id = p.id
        JOIN Users u_patient ON p.user_id = u_patient.id
        WHERE a.doctor_id = @doctor_id
        ORDER BY a.date DESC, a.time DESC
      `);

    res.status(200).json({
      totalAppointments: totalAppointments.recordset[0].total,
      todayAppointments: todayAppointments.recordset[0].total,
      pendingAppointments: pending.recordset[0].total,
      completedAppointments: completed.recordset[0].total,
      recentAppointments: recentAppointments.recordset
    });

  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// PATIENT DASHBOARD STATS
const getPatientStats = async (req, res) => {
  try {
    const pool = await poolPromise;

    const patient = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT * FROM Patients WHERE user_id = @user_id');

    if (patient.recordset.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found.' });
    }

    const patientId = patient.recordset[0].id;

    const totalAppointments = await pool.request()
      .input('patient_id', sql.Int, patientId)
      .query('SELECT COUNT(*) as total FROM Appointments WHERE patient_id = @patient_id');

    const upcoming = await pool.request()
      .input('patient_id', sql.Int, patientId)
      .query("SELECT COUNT(*) as total FROM Appointments WHERE patient_id = @patient_id AND date >= CAST(GETDATE() AS DATE) AND status = 'pending'");

    const completed = await pool.request()
      .input('patient_id', sql.Int, patientId)
      .query("SELECT COUNT(*) as total FROM Appointments WHERE patient_id = @patient_id AND status = 'completed'");

    const appointmentHistory = await pool.request()
      .input('patient_id', sql.Int, patientId)
      .query(`
        SELECT TOP 5
               a.id,
               u_doctor.name AS doctor_name,
               dept.name AS department_name,
               a.date, a.time, a.status
        FROM Appointments a
        JOIN Doctors d ON a.doctor_id = d.id
        JOIN Users u_doctor ON d.user_id = u_doctor.id
        JOIN Departments dept ON d.department_id = dept.id
        WHERE a.patient_id = @patient_id
        ORDER BY a.date DESC, a.time DESC
      `);

    res.status(200).json({
      totalAppointments: totalAppointments.recordset[0].total,
      upcomingAppointments: upcoming.recordset[0].total,
      completedAppointments: completed.recordset[0].total,
      appointmentHistory: appointmentHistory.recordset
    });

  } catch (error) {
    console.error('Patient dashboard error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

module.exports = {
  getAdminStats,
  getDoctorStats,
  getPatientStats
};