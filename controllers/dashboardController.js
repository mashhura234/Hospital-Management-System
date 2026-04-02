const db = require('../config/db');


// ADMIN DASHBOARD STATS
const getAdminStats = async (req, res) => {
  try {
    // Total doctors
    const [doctors] = await db.query('SELECT COUNT(*) as total FROM doctors');
    
    // Total patients
    const [patients] = await db.query('SELECT COUNT(*) as total FROM patients');
    
    // Total departments
    const [departments] = await db.query('SELECT COUNT(*) as total FROM departments');
    
    // Total appointments
    const [appointments] = await db.query('SELECT COUNT(*) as total FROM appointments');
    
    // Pending appointments
    const [pending] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE status = ?', ['pending']
    );
    
    // Completed appointments
    const [completed] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE status = ?', ['completed']
    );
    
    // Cancelled appointments
    const [cancelled] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE status = ?', ['cancelled']
    );

    // Recent appointments
    const [recentAppointments] = await db.query(`
      SELECT a.id,
             u_patient.name AS patient_name,
             u_doctor.name AS doctor_name,
             a.date, a.time, a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u_patient ON p.user_id = u_patient.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u_doctor ON d.user_id = u_doctor.id
      ORDER BY a.created_at DESC
      LIMIT 5
    `);

    res.status(200).json({
      totalDoctors: doctors[0].total,
      totalPatients: patients[0].total,
      totalDepartments: departments[0].total,
      totalAppointments: appointments[0].total,
      pendingAppointments: pending[0].total,
      completedAppointments: completed[0].total,
      cancelledAppointments: cancelled[0].total,
      recentAppointments
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// DOCTOR DASHBOARD STATS
const getDoctorStats = async (req, res) => {
  try {
    // Get doctor profile using logged in user id
    const [doctor] = await db.query(
      'SELECT * FROM doctors WHERE user_id = ?', [req.user.id]
    );

    if (doctor.length === 0) {
      return res.status(404).json({ message: 'Doctor profile not found.' });
    }

    const doctorId = doctor[0].id;

    // Total appointments for this doctor
    const [totalAppointments] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE doctor_id = ?', [doctorId]
    );

    // Today's appointments
    const [todayAppointments] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE doctor_id = ? AND date = CURDATE()',
      [doctorId]
    );

    // Pending appointments
    const [pending] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE doctor_id = ? AND status = ?',
      [doctorId, 'pending']
    );

    // Completed appointments
    const [completed] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE doctor_id = ? AND status = ?',
      [doctorId, 'completed']
    );

    // Recent appointments
    const [recentAppointments] = await db.query(`
      SELECT a.id,
             u_patient.name AS patient_name,
             a.date, a.time, a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u_patient ON p.user_id = u_patient.id
      WHERE a.doctor_id = ?
      ORDER BY a.date DESC
      LIMIT 5
    `, [doctorId]);

    res.status(200).json({
      totalAppointments: totalAppointments[0].total,
      todayAppointments: todayAppointments[0].total,
      pendingAppointments: pending[0].total,
      completedAppointments: completed[0].total,
      recentAppointments
    });

  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};


// PATIENT DASHBOARD STATS
const getPatientStats = async (req, res) => {
  try {
    // Get patient profile using logged in user id
    const [patient] = await db.query(
      'SELECT * FROM patients WHERE user_id = ?', [req.user.id]
    );

    if (patient.length === 0) {
      return res.status(404).json({ message: 'Patient profile not found.' });
    }

    const patientId = patient[0].id;

    // Total appointments
    const [totalAppointments] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE patient_id = ?', [patientId]
    );

    // Upcoming appointments
    const [upcoming] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE patient_id = ? AND date >= CURDATE() AND status = ?',
      [patientId, 'pending']
    );

    // Completed appointments
    const [completed] = await db.query(
      'SELECT COUNT(*) as total FROM appointments WHERE patient_id = ? AND status = ?',
      [patientId, 'completed']
    );

    // Appointment history
    const [appointmentHistory] = await db.query(`
      SELECT a.id,
             u_doctor.name AS doctor_name,
             dept.name AS department_name,
             a.date, a.time, a.status
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users u_doctor ON d.user_id = u_doctor.id
      JOIN departments dept ON d.department_id = dept.id
      WHERE a.patient_id = ?
      ORDER BY a.date DESC
      LIMIT 5
    `, [patientId]);

    res.status(200).json({
      totalAppointments: totalAppointments[0].total,
      upcomingAppointments: upcoming[0].total,
      completedAppointments: completed[0].total,
      appointmentHistory
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