import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { nurseAPI } from '../services/api';
import '../styles/Nurse.css';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('register');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    triageLevel: 'LEVEL_3',
  });

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vitalsData, setVitalsData] = useState({
    heartRate: '',
    bloodPressure: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const response = await nurseAPI.getNursePatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVitalsChange = (e) => {
    const { name, value } = e.target;
    setVitalsData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const patientData = {
        name: formData.name,
        age: parseInt(formData.age),
        triageLevel: formData.triageLevel,
      };

      const response = await nurseAPI.registerPatient(patientData);
      setSuccessMessage(`Patient ${response.data.name} registered successfully!`);
      setFormData({
        name: '',
        age: '',
        triageLevel: 'LEVEL_3',
      });
      loadPatients();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to register patient');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVitals = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await nurseAPI.updateVitals(selectedPatient.id, {
        heartRate: parseInt(vitalsData.heartRate),
        bloodPressure: vitalsData.bloodPressure,
      });

      setSuccessMessage('Vitals updated successfully! Triage level recalculated.');
      setSelectedPatient(null);
      setVitalsData({
        heartRate: '',
        bloodPressure: '',
      });
      loadPatients();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to update vitals');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setVitalsData({
      heartRate: patient.heartRate || '',
      bloodPressure: patient.bloodPressure || '',
    });
  };

  const getTriageLevelColor = (level) => {
    const colors = {
      LEVEL_1: '#d32f2f',
      LEVEL_2: '#f57c00',
      LEVEL_3: '#fbc02d',
      LEVEL_4: '#7cb342',
      LEVEL_5: '#1976d2',
    };
    return colors[level] || '#999';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="nurse-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>👨‍⚕️ Nurse Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register Patient
          </button>
          <button
            className={`tab ${activeTab === 'vitals' ? 'active' : ''}`}
            onClick={() => setActiveTab('vitals')}
          >
            Update Vitals
          </button>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {activeTab === 'register' && (
          <div className="tab-content">
            <div className="form-container">
              <h2>Register New Patient</h2>
              <form onSubmit={handleRegisterPatient}>
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Initial Triage Level *</label>
                    <select name="triageLevel" value={formData.triageLevel} onChange={handleFormChange}>
                      <option value="LEVEL_1">Level 1 - Critical</option>
                      <option value="LEVEL_2">Level 2 - Emergency</option>
                      <option value="LEVEL_3">Level 3 - Urgent</option>
                      <option value="LEVEL_4">Level 4 - Semi-Urgent</option>
                      <option value="LEVEL_5">Level 5 - Non-Urgent</option>
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? 'Registering...' : 'Register Patient'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="tab-content">
            <div className="vitals-container">
              <h2>Update Patient Vitals</h2>

              <div className="patients-list">
                <h3>Patients</h3>
                {patients.length === 0 ? (
                  <p>No patients available</p>
                ) : (
                  <div className="patient-cards">
                    {patients.map((patient) => (
                      <div
                        key={patient.id}
                        className={`patient-card ${
                          selectedPatient?.id === patient.id ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectPatient(patient)}
                      >
                        <div className="patient-name">
                          {patient.name}
                        </div>
                        <div className="patient-info">Age: {patient.age}</div>
                        <div className="patient-triage" style={{ color: getTriageLevelColor(patient.triageLevel) }}>
                          Triage: {patient.triageLevel}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="vitals-form-container">
                  <h3>Update Vitals: {selectedPatient.name}</h3>
                  <form onSubmit={handleUpdateVitals}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Heart Rate (bpm) *</label>
                        <input
                          type="number"
                          name="heartRate"
                          value={vitalsData.heartRate}
                          onChange={handleVitalsChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Blood Pressure (SBP/DBP) *</label>
                        <input
                          type="text"
                          name="bloodPressure"
                          placeholder="e.g., 120/80"
                          value={vitalsData.bloodPressure}
                          onChange={handleVitalsChange}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="submit-button">
                      {loading ? 'Updating...' : 'Update Vitals'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseDashboard;
