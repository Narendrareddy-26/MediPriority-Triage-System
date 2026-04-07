// Nurse Dashboard Component

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientForm from "./PatientForm";
import QueueList from "../../components/queue/QueueList";
import Button from "../../components/common/Button";
import {
  registerPatient,
  getPatientQueue,
  updatePatientVitals,
  markPatientEmergency,
} from "../../api/patientApi";
import { calculateTriageLevel } from "../../utils/triageUtils";

export default function NurseDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [vitalUpdates, setVitalUpdates] = useState({});
  const navigate = useNavigate();

  // Load patients on component mount
  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const result = await getPatientQueue();
      if (result.success) {
        setPatients(result.data);
      }
    } catch (err) {
      console.error("Error loading queue:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPatient = async (patientData) => {
    setLoading(true);
    try {
      const result = await registerPatient(patientData);
      if (result.success) {
        await loadQueue(); // Reload queue
      }
    } catch (err) {
      console.error("Error registering patient:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVitals = async (patientId) => {
    const vitals = vitalUpdates[patientId];
    if (!vitals || !vitals.heartRate || !vitals.bloodPressure) {
      alert("Please enter both heart rate and blood pressure");
      return;
    }

    setLoading(true);
    try {
      const result = await updatePatientVitals(
        patientId,
        parseInt(vitals.heartRate),
        vitals.bloodPressure
      );
      if (result.success) {
        await loadQueue();
        setVitalUpdates((prev) => {
          const newUpdates = { ...prev };
          delete newUpdates[patientId];
          return newUpdates;
        });
        setExpandedPatient(null);
      }
    } catch (err) {
      console.error("Error updating vitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergency = async (patientId) => {
    if (
      !window.confirm(
        "Mark this patient as Level 1 (Critical)? They will move to the front of the queue."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const result = await markPatientEmergency(patientId);
      if (result.success) {
        await loadQueue();
      }
    } catch (err) {
      console.error("Error marking emergency:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">MediPriority - Nurse Portal</h1>
            <p className="text-blue-100">Patient Registration & Vitals Tracking</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("register")}
            className={`px-6 py-3 rounded font-semibold transition ${
              activeTab === "register"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Register Patient
          </button>
          <button
            onClick={() => setActiveTab("queue")}
            className={`px-6 py-3 rounded font-semibold transition ${
              activeTab === "queue"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Patient Queue
          </button>
        </div>

        {/* Register Tab */}
        {activeTab === "register" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientForm onSubmit={handleRegisterPatient} loading={loading} />

            {/* Instructions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Guidelines</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-blue-600">Triage Levels</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1">
                    <li>1 = Critical (Immediate)</li>
                    <li>2 = Urgent (30 mins)</li>
                    <li>3 = Semi-Urgent (1 hour)</li>
                    <li>4 = Low (2-3 hours)</li>
                    <li>5 = Non-Urgent (Routine)</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-green-600">Normal Vitals</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1">
                    <li>Heart Rate: 60-100 bpm</li>
                    <li>Blood Pressure: &lt;120/80</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-red-600">Alert Thresholds</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mt-1">
                    <li>HR &gt;120 or &lt;60 = Upgrade to Level 2</li>
                    <li>BP &gt;160/100 or &lt;90/60 = Upgrade to Level 2</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Queue Tab */}
        {activeTab === "queue" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Current Patient Queue</h2>
              <Button variant="secondary" onClick={loadQueue} disabled={loading}>
                🔄 Refresh Queue
              </Button>
            </div>

            {patients.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">No patients in queue yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{patient.name}</h3>
                        <p className="text-sm text-gray-600">
                          Age: {patient.age} years | Level: {patient.triageLevel} |
                          Status: {patient.status}
                        </p>
                        <p className="text-sm text-gray-600">
                          HR: {patient.heartRate || "N/A"} bpm | BP:{" "}
                          {patient.bloodPressure || "N/A"}
                        </p>
                      </div>
                      <div className="px-4 py-2 bg-blue-100 rounded font-bold">
                        L{patient.triageLevel}
                      </div>
                    </div>

                    {/* Expanded View */}
                    {expandedPatient === patient.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 p-3 rounded">
                        <h4 className="font-semibold mb-3">Update Vitals</h4>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <input
                            type="number"
                            placeholder="Heart Rate (bpm)"
                            value={
                              vitalUpdates[patient.id]?.heartRate || ""
                            }
                            onChange={(e) =>
                              setVitalUpdates((prev) => ({
                                ...prev,
                                [patient.id]: {
                                  ...prev[patient.id],
                                  heartRate: e.target.value,
                                },
                              }))
                            }
                            className="px-3 py-2 border border-gray-300 rounded"
                          />
                          <input
                            type="text"
                            placeholder="BP (e.g., 120/80)"
                            value={
                              vitalUpdates[patient.id]?.bloodPressure || ""
                            }
                            onChange={(e) =>
                              setVitalUpdates((prev) => ({
                                ...prev,
                                [patient.id]: {
                                  ...prev[patient.id],
                                  bloodPressure: e.target.value,
                                },
                              }))
                            }
                            className="px-3 py-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            onClick={() => handleUpdateVitals(patient.id)}
                            disabled={loading}
                          >
                            Save Vitals
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleEmergency(patient.id)}
                            disabled={loading}
                          >
                            🚨 Mark Emergency
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setExpandedPatient(null)}
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    )}

                    {expandedPatient !== patient.id && (
                      <button
                        onClick={() => setExpandedPatient(patient.id)}
                        className="mt-3 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      >
                        Update Vitals →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
