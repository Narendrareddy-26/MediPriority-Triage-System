// Queue Card Component - Displays a single patient in the queue

export default function QueueCard({ patient }) {
  // Function to get triage level color and label
  const getTriageLevelInfo = (level) => {
    const levels = {
      1: { label: "Critical", color: "bg-red-100 border-red-500 text-red-800" },
      2: { label: "Urgent", color: "bg-orange-100 border-orange-500 text-orange-800" },
      3: { label: "Semi-Urgent", color: "bg-yellow-100 border-yellow-500 text-yellow-800" },
      4: { label: "Low", color: "bg-blue-100 border-blue-500 text-blue-800" },
      5: { label: "Non-Urgent", color: "bg-green-100 border-green-500 text-green-800" },
    };
    return levels[level] || levels[5];
  };

  const triageInfo = getTriageLevelInfo(patient.triageLevel);

  return (
    <div className={`border-l-4 p-4 rounded shadow mb-3 ${triageInfo.color}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{patient.name}</h3>
          <p className="text-sm">Age: {patient.age} years</p>
          {patient.heartRate && (
            <p className="text-sm">HR: {patient.heartRate} bpm</p>
          )}
          {patient.bloodPressure && (
            <p className="text-sm">BP: {patient.bloodPressure}</p>
          )}
        </div>
        <div className="text-right">
          <div className="inline-block bg-white px-3 py-1 rounded font-bold">
            Level {patient.triageLevel}
          </div>
          <p className="text-xs mt-1 font-semibold">{triageInfo.label}</p>
        </div>
      </div>
      {patient.status && (
        <p className="text-xs mt-2 capitalize">
          Status: <span className="font-semibold">{patient.status}</span>
        </p>
      )}
    </div>
  );
}
