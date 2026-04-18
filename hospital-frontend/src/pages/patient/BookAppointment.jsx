import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import '../../styles/BookAppointment.css';

function BookAppointment() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) { navigate('/login'); return; }
    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'patient') { navigate('/login'); return; }
      setUser(parsedUser);
      fetchDepartments();
      fetchPatientId(parsedUser.id);
    } catch { navigate('/login'); }
  }, [navigate]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data);
    } catch {}
  };

  const fetchPatientId = async (userId) => {
    try {
      const res = await axios.get('http://localhost:5000/api/patients',
        { headers: { Authorization: `Bearer ${token}` } });
      const myProfile = res.data.find(p => p.email === JSON.parse(localStorage.getItem('user')).email);
      if (myProfile) setPatientId(myProfile.id);
    } catch {}
  };

  const handleDeptSelect = async (dept) => {
    setSelectedDept(dept);
    setSelectedDoctor(null);
    setSlots([]);
    setStep(2);
    try {
      const res = await axios.get('http://localhost:5000/api/doctors',
        { headers: { Authorization: `Bearer ${token}` } });
      const filtered = res.data.filter(d => d.department_name === dept.name);
      setDoctors(filtered);
    } catch {}
  };

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setStep(3);
    try {
      const res = await axios.get(`http://localhost:5000/api/availability/${doctor.id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setSlots(res.data);
    } catch {}
  };

  const handleBooking = async () => {
    setError('');
    if (!selectedSlot) { setError('Please select a time slot.'); return; }
    if (!patientId) { setError('Patient profile not found. Please complete your registration.'); return; }
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/appointments', {
        patient_id: patientId,
        doctor_id: selectedDoctor.id,
        availability_id: selectedSlot.id
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('✅ Appointment booked successfully!');
      setTimeout(() => navigate('/patient/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar role="patient" userName={user?.name} />
      <div className="dashboard-main">

        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Book Appointment</h1>
            <p className="dashboard-subtitle">Follow the steps to book your appointment</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="booking-steps">
          <div className={`booking-step ${step >= 1 ? 'step-active' : ''}`}>
            <div className="step-circle">1</div>
            <span>Department</span>
          </div>
          <div className="step-line"></div>
          <div className={`booking-step ${step >= 2 ? 'step-active' : ''}`}>
            <div className="step-circle">2</div>
            <span>Doctor</span>
          </div>
          <div className="step-line"></div>
          <div className={`booking-step ${step >= 3 ? 'step-active' : ''}`}>
            <div className="step-circle">3</div>
            <span>Time Slot</span>
          </div>
        </div>

        {error && <div className="booking-error">{error}</div>}
        {success && <div className="booking-success">{success}</div>}

        {/* Step 1 - Select Department */}
        {step === 1 && (
          <div className="booking-section">
            <h3 className="booking-section-title">🏢 Select a Department</h3>
            <div className="dept-grid">
              {departments.map(dept => (
                <div
                  key={dept.id}
                  className="dept-card-booking"
                  onClick={() => handleDeptSelect(dept)}>
                  <div className="dept-icon-booking">{dept.name[0]}</div>
                  <h4>{dept.name}</h4>
                  <p>{dept.description || 'Click to view doctors'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 - Select Doctor */}
        {step === 2 && (
          <div className="booking-section">
            <button className="booking-back-btn" onClick={() => setStep(1)}>← Back to Departments</button>
            <h3 className="booking-section-title">👨‍⚕️ Select a Doctor in {selectedDept?.name}</h3>
            {doctors.length > 0 ? (
              <div className="doctor-grid-booking">
                {doctors.map(doc => (
                  <div
                    key={doc.id}
                    className="doctor-card-booking"
                    onClick={() => handleDoctorSelect(doc)}>
                    <div className="doctor-avatar-booking">{doc.name[0]}</div>
                    <h4>{doc.name}</h4>
                    <p className="doctor-spec-booking">{doc.specialization}</p>
                    <p className="doctor-dept-booking">{doc.department_name}</p>
                    <button className="view-slots-btn">View Available Slots →</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No doctors available in this department.</p>
            )}
          </div>
        )}

        {/* Step 3 - Select Slot */}
        {step === 3 && (
          <div className="booking-section">
            <button className="booking-back-btn" onClick={() => setStep(2)}>← Back to Doctors</button>
            <h3 className="booking-section-title">📅 Select a Time Slot with {selectedDoctor?.name}</h3>

            {slots.length > 0 ? (
              <>
                <div className="slots-grid">
                  {slots.map(slot => (
                    <div
                      key={slot.id}
                      className={`slot-card ${selectedSlot?.id === slot.id ? 'slot-selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}>
                      <div className="slot-date">
                        📅 {new Date(slot.available_date).toLocaleDateString()}
                      </div>
                      <div className="slot-time">
                        ⏰ {slot.available_time}
                        {slot.available_end_time && ` - ${slot.available_end_time}`}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedSlot && (
                  <div className="booking-summary">
                    <h4>📋 Booking Summary</h4>
                    <p><strong>Doctor:</strong> {selectedDoctor?.name}</p>
                    <p><strong>Department:</strong> {selectedDept?.name}</p>
                    <p><strong>Date:</strong> {new Date(selectedSlot.available_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {selectedSlot.available_time}
                      {selectedSlot.available_end_time && ` - ${selectedSlot.available_end_time}`}
                    </p>
                    <button
                      className="confirm-booking-btn"
                      onClick={handleBooking}
                      disabled={loading}>
                      {loading ? 'Booking...' : '✅ Confirm Appointment'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-slots-msg">
                <p>😔 No available slots for this doctor yet.</p>
                <p>Please check back later or choose another doctor.</p>
                <button className="booking-back-btn" onClick={() => setStep(2)}>← Choose Another Doctor</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookAppointment;