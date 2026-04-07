import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorAPI } from '../services/api';
import '../styles/Doctor.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('queue');
  const [queue, setQueue] = useState([]);
  const [completedPatients, setCompletedPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getQueue();
      setQueue(response.data);
    } catch (error) {
      setErrorMessage('Failed to load patient queue');
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedPatients = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getCompletedPatients();
      setCompletedPatients(response.data);
    } catch (error) {
      setErrorMessage('Failed to load completed patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPatient = async (patientId) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await doctorAPI.assignPatient(patientId);
      setSelectedPatient(response.data);
      setSuccessMessage('Patient assigned to you');
      loadQueue();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to assign patient');
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePatient = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setLoading(true);
    setErrorMessage('');

    try {
      await doctorAPI.completePatient(selectedPatient.id, notes);
      setSuccessMessage('Patient marked as completed');
      setSelectedPatient(null);
      setNotes('');
      loadQueue();
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to complete patient');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotes = async () => {
    if (!selectedPatient) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await doctorAPI.updateNotes(selectedPatient.id, notes);
      setSelectedPatient(response.data);
      setSuccessMessage('Notes updated successfully');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'Failed to update notes');
    } finally {
      setLoading(false);
    }
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

  const getTriageLevelDescription = (level) => {
    const descriptions = {
      LEVEL_1: 'Critical',
      LEVEL_2: 'Emergency',
      LEVEL_3: 'Urgent',
      LEVEL_4: 'Semi-Urgent',
      LEVEL_5: 'Non-Urgent',
    };
    return descriptions[level] || level;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>👨‍⚕️ Doctor Dashboard</h1>
          <p>Welcome, Dr. {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'queue' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('queue');
              loadQueue();
            }}
          >
            Patient Queue ({queue.filter(p => p.status !== 'COMPLETED').length})
          </button>
          <button
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('completed');
              loadCompletedPatients();
            }}
          >
            Completed Patients
          </button>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {activeTab === 'queue' && (
          <div className="tab-content">
            <div className="queue-container">
              <div className="queue-list">
                <h2>Priority Queue</h2>
                {loading && <div className="loading">Loading...</div>}
                {queue.length === 0 ? (
                  <div className="empty-queue">No patients in queue</div>
                ) : (
                  <div className="patient-queue">
                    {queue
                      .filter((p) => p.status !== 'COMPLETED')
                      .map((patient, index) => (
                        <div
                          key={patient.id}
                          className={`queue-item ${
                            selectedPatient?.id === patient.id ? 'selected' : ''
                          }`}
                        >
                          <div className="queue-position">#{index + 1}</div>
                          <div className="queue-info">
                            <div className="patient-name">
                              {patient.name}
                            </div>
                            <div className="patient-details">
                              Age: {patient.age} | Status: {patient.status}
                            </div>
                          </div>
                          <div
                            className="queue-triage"
                            style={{
                              backgroundColor: getTriageLevelColor(patient.triageLevel),
                            }}
                          >
                            <div className="triage-level">{patient.triageLevel}</div>
                            <div className="triage-description">
                              {getTriageLevelDescription(patient.triageLevel)}
                            </div>
                          </div>
                          <div className="queue-actions">
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setNotes(patient.notes || '');
                              }}
                              className="btn btn-view"
                            >
                              View
                            </button>
                            {patient.status === 'WAITING' && (
                              <button
                                onClick={() => handleAssignPatient(patient.id)}
                                disabled={loading}
                                className="btn btn-assign"
                              >
                                Assign
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="patient-detail">
                  <h2>Patient Details</h2>
                  <div className="detail-section">
                    <h3>{selectedPatient.name}</h3>
                    <div className="detail-row">
                      <span className="label">Age:</span>
                      <span>{selectedPatient.age} years</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Status:</span>
                      <span>{selectedPatient.status}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Vital Signs</h4>
                    <div className="vitals-grid">
                      <div className="vital">
                        <span className="vital-label">Heart Rate</span>
                        <span className="vital-value">{selectedPatient.heartRate} bpm</span>
                      </div>
                      <div className="vital">
                        <span className="vital-label">Blood Pressure</span>
                        <span className="vital-value">{selectedPatient.bloodPressure}</span>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Triage Information</h4>
                    <div
                      className="triage-badge"
                      style={{
                        backgroundColor: getTriageLevelColor(
                          selectedPatient.triageLevel
                        ),
                      }}
                    >
                      {selectedPatient.triageLevel} -{' '}
                      {getTriageLevelDescription(selectedPatient.triageLevel)}
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Clinical Notes</h4>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add clinical notes..."
                      rows="4"
                    />
                    <div className="button-group">
                      <button
                        onClick={handleUpdateNotes}
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        Update Notes
                      </button>
                      {selectedPatient.status === 'IN_PROGRESS' && (
                        <button
                          onClick={handleCompletePatient}
                          disabled={loading}
                          className="btn btn-success"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="tab-content">
            <div className="completed-container">
              <h2>Completed Patients</h2>
              {loading && <div className="loading">Loading...</div>}
              {completedPatients.length === 0 ? (
                <div className="empty-queue">No completed patients</div>
              ) : (
                <div className="table-container">
                  <table className="patients-table">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Age</th>
                        <th>Triage Level</th>
                        <th>Registered</th>
                        <th>Completed</th>
                        <th>Doctor</th>
                        <th>Nurse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedPatients.map((patient) => (
                        <tr key={patient.id}>
                          <td>
                            {patient.name}
                          </td>
                          <td>{patient.age}</td>
                          <td>
                            <span
                              className="triage-badge"
                              style={{
                                backgroundColor: getTriageLevelColor(
                                  patient.triageLevel
                                ),
                              }}
                            >
                              {patient.triageLevel}
                            </span>
                          </td>
                          <td>{patient.registeredAt}</td>
                          <td>{patient.completedAt}</td>
                          <td>{patient.doctorName || 'N/A'}</td>
                          <td>{patient.nurseName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
