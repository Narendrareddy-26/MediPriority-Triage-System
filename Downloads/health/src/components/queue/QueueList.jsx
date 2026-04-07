// Queue List Component - Displays all patients in priority order

import QueueCard from "./QueueCard";

export default function QueueList({ patients = [], loading = false, title = "Patient Queue" }) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading queue...</p>
      </div>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded">
        <p className="text-gray-600">No patients in queue</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="bg-gray-50 p-4 rounded">
        <p className="text-sm text-gray-600 mb-4">
          Total Patients: <span className="font-bold">{patients.length}</span>
        </p>
        {patients.map((patient) => (
          <QueueCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}
