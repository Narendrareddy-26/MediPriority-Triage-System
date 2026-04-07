// Doctor Dashboard Component

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import QueueList from "../../components/queue/QueueList";
import {
  getPatientQueue,
  updatePatientStatus,
  assignPatientToDoctor,
} from "../../api/patientApi";

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
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

  const handleAssignToMe = async (patientId) => {
    setLoading(true);
    try {
      const result = await assignPatientToDoctor(
        patientId,
        currentUser.id
      );
      if (result.success) {
        await loadQueue();
      }
    } catch (err) {
      console.error("Error assigning patient:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (patientId) => {
    const status = selectedStatus[patientId];
    if (!status) {
      alert("Please select a status");
      return;
    }

    setLoading(true);
    try {
      const result = await updatePatientStatus(patientId, status);
      if (result.success) {
        await loadQueue();
        setSelectedStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[patientId];
          return newStatus;
        });
        setExpandedPatient(null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Get triage level color
  const getTriageLevelColor = (level) => {
    const colors = {
      1: "bg-red-200",
      2: "bg-orange-200",
      3: "bg-yellow-200",
      4: "bg-blue-200",
      5: "bg-green-200",
    };
    return colors[level] || "bg-gray-200";
  };

  const statusOptions = [
    { value: "examining", label: "Examining" },
    { value: "treated", label: "Treated" },
    { value: "discharged", label: "Discharged" },
    { value: "referred", label: "Referred" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">MediPriority - Doctor Portal</h1>
            <p className="text-green-100">Patient Queue & Status Management</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-100 p-4 rounded-lg border border-red-300">
            <p className="text-red-800 font-semibold text-sm">Critical</p>
            <p className="text-3xl font-bold text-red-600">
              {patients.filter((p) => p.triageLevel === 1).length}
            </p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg border border-orange-300">
            <p className="text-orange-800 font-semibold text-sm">Urgent</p>
            <p className="text-3xl font-bold text-orange-600">
              {patients.filter((p) => p.triageLevel === 2).length}
            </p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
            <p className="text-yellow-800 font-semibold text-sm">Semi-Urgent</p>
            <p className="text-3xl font-bold text-yellow-600">
              {patients.filter((p) => p.triageLevel === 3).length}
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
            <p className="text-blue-800 font-semibold text-sm">Total</p>
            <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
          </div>
        </div>

        {/* Queue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Patient Queue</h2>
            <Button
              variant="secondary"
              onClick={loadQueue}
              disabled={loading}
            >
              🔄 Refresh
            </Button>
          </div>

          {patients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No patients in queue</p>
            </div>
          ) : (
            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-4 rounded-lg border-l-4 border-green-500 ${getTriageLevelColor(
                    patient.triageLevel
                  )}`}
                >
                  {/* Patient Info */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{patient.name}</h3>
                      <p className="text-sm text-gray-700">
                        Age: {patient.age} | Heart Rate: {patient.heartRate || "N/A"} bpm
                      </p>
                      <p className="text-sm text-gray-700">
                        Blood Pressure: {patient.bloodPressure || "N/A"}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-800">
                        {patient.triageLevel}
                      </div>
                      <p className="text-xs font-semibold text-gray-600">
                        Level
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                        patient.status === "waiting"
                          ? "bg-yellow-200 text-yellow-800"
                          : patient.status === "examining"
                          ? "bg-blue-200 text-blue-800"
                          : patient.status === "treated"
                          ? "bg-green-200 text-green-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {patient.status?.charAt(0).toUpperCase() +
                        patient.status?.slice(1)}
                    </span>
                  </div>

                  {/* Expanded View */}
                  {expandedPatient === patient.id && (
                    <div className="mt-4 pt-4 border-t border-gray-400 bg-white bg-opacity-70 p-3 rounded">
                      <h4 className="font-semibold mb-3">Update Patient Status</h4>
                      <div className="mb-3">
                        <select
                          value={selectedStatus[patient.id] || ""}
                          onChange={(e) =>
                            setSelectedStatus((prev) => ({
                              ...prev,
                              [patient.id]: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-400 rounded"
                        >
                          <option value="">Select Status</option>
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          onClick={() => handleUpdateStatus(patient.id)}
                          disabled={loading}
                        >
                          Update Status
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

                  {/* Action Buttons */}
                  {expandedPatient !== patient.id && (
                    <div className="flex gap-2">
                      {!patient.assignedDoctor && (
                        <Button
                          variant="primary"
                          onClick={() => handleAssignToMe(patient.id)}
                          disabled={loading}
                          className="text-sm px-3 py-1"
                        >
                          Assign to Me
                        </Button>
                      )}
                      {patient.assignedDoctor === currentUser?.id && (
                        <Button
                          variant="success"
                          onClick={() => setExpandedPatient(patient.id)}
                          className="text-sm px-3 py-1"
                        >
                          Update Status →
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Doctor Instructions</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Patients are sorted by priority level (1 = highest)</li>
            <li>Click "Assign to Me" to take ownership of a patient</li>
            <li>Only patients assigned to you can be updated</li>
            <li>Update patient status after examination</li>
            <li>Status updates affect the nurse's dashboard in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
