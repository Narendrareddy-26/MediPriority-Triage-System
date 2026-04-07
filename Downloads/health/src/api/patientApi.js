// Mock API calls for patient data
// In a real app, these would call your backend

// Simulate patient database
let patients = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    triageLevel: 2,
    heartRate: 95,
    bloodPressure: "120/80",
    status: "waiting",
    assignedDoctor: null,
    registeredBy: "nurse1",
  },
  {
    id: 2,
    name: "Emma Johnson",
    age: 32,
    triageLevel: 4,
    heartRate: 72,
    bloodPressure: "110/70",
    status: "waiting",
    assignedDoctor: null,
    registeredBy: "nurse1",
  },
];

let nextPatientId = 3;

// Register a new patient
export const registerPatient = async (patientData) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newPatient = {
    id: nextPatientId++,
    ...patientData,
    status: "waiting",
    assignedDoctor: null,
  };

  patients.push(newPatient);

  return {
    success: true,
    data: newPatient,
  };
};

// Update patient vitals
export const updatePatientVitals = async (patientId, heartRate, bloodPressure) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return {
      success: false,
      error: "Patient not found",
    };
  }

  patient.heartRate = heartRate;
  patient.bloodPressure = bloodPressure;

  // Check if vitals warrant a level upgrade
  let newLevel = patient.triageLevel;

  // Heart Rate > 120 or < 60 indicates critical
  if (heartRate > 120 || heartRate < 60) {
    newLevel = Math.min(newLevel, 2); // Upgrade to at least level 2
  }

  // Blood Pressure > 160/100 or < 90/60 indicates urgent
  const [systolic, diastolic] = bloodPressure.split("/").map(Number);
  if (systolic > 160 || diastolic > 100 || systolic < 90 || diastolic < 60) {
    newLevel = Math.min(newLevel, 2);
  }

  patient.triageLevel = newLevel;

  return {
    success: true,
    data: patient,
  };
};

// Mark patient as emergency (Level 1)
export const markPatientEmergency = async (patientId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return {
      success: false,
      error: "Patient not found",
    };
  }

  patient.triageLevel = 1; // Critical priority

  return {
    success: true,
    data: patient,
  };
};

// Get all patients in queue (sorted by triage level)
export const getPatientQueue = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Sort patients by triage level (1 is highest priority)
  const sortedPatients = [...patients].sort(
    (a, b) => a.triageLevel - b.triageLevel
  );

  return {
    success: true,
    data: sortedPatients,
  };
};

// Get single patient details
export const getPatientDetails = async (patientId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return {
      success: false,
      error: "Patient not found",
    };
  }

  return {
    success: true,
    data: patient,
  };
};

// Get patient history
export const getPatientHistory = async (patientId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return {
      success: false,
      error: "Patient not found",
    };
  }

  // Return mock history
  return {
    success: true,
    data: {
      patientId,
      visits: [
        {
          date: "2024-01-15",
          diagnosis: "Common Cold",
          treatment: "Rest and fluids",
        },
      ],
    },
  };
};

// Assign patient to doctor
export const assignPatientToDoctor = async (patientId, doctorId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return {
      success: false,
      error: "Patient not found",
    };
  }

  patient.assignedDoctor = doctorId;
  patient.status = "assigned";

  return {
    success: true,
    data: patient,
  };
};

// Update patient status
export const updatePatientStatus = async (patientId, status) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    return {
      success: false,
      error: "Patient not found",
    };
  }

  patient.status = status; // "examined", "treated", "discharged"

  return {
    success: true,
    data: patient,
  };
};

// Get patients assigned to a doctor
export const getDoctorPatients = async (doctorId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const doctorPatients = patients.filter((p) => p.assignedDoctor === doctorId);

  return {
    success: true,
    data: doctorPatients,
  };
};

// Get all users (mock)
export const getAllUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    data: [
      { id: 1, username: "nurse1", role: "nurse" },
      { id: 2, username: "doctor1", role: "doctor" },
    ],
  };
};
