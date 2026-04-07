// Triage utility functions for priority queue management

// Check if vitals are within normal range
export const checkVitalsStatus = (heartRate, bloodPressure) => {
  const issues = [];

  // Normal Heart Rate: 60-100 bpm
  if (heartRate > 120) {
    issues.push("Heart rate too high (>120)");
  } else if (heartRate < 60) {
    issues.push("Heart rate too low (<60)");
  }

  // Parse blood pressure
  const [systolic, diastolic] = bloodPressure.split("/").map(Number);

  // Normal BP: < 120/80
  if (systolic > 160 || diastolic > 100) {
    issues.push("Blood pressure too high");
  } else if (systolic < 90 || diastolic < 60) {
    issues.push("Blood pressure too low");
  }

  return {
    isNormal: issues.length === 0,
    issues,
  };
};

// Calculate recommended triage level based on vitals
export const calculateTriageLevel = (initialLevel, heartRate, bloodPressure) => {
  let level = initialLevel;

  // If any vital is critical, upgrade to level 2 (Urgent)
  if (heartRate > 120 || heartRate < 60) {
    level = Math.min(level, 2);
  }

  const [systolic, diastolic] = bloodPressure.split("/").map(Number);
  if (systolic > 160 || diastolic > 100 || systolic < 90 || diastolic < 60) {
    level = Math.min(level, 2);
  }

  return level;
};

// Sort patients by triage level and return priority queue
export const sortPriorityQueue = (patients) => {
  // Sort by triage level (1 highest priority, 5 lowest)
  return [...patients].sort((a, b) => a.triageLevel - b.triageLevel);
};

// Get triage level description
export const getTriageLevelDescription = (level) => {
  const descriptions = {
    1: "Critical - Immediate attention required",
    2: "Urgent - Within 30 minutes",
    3: "Semi-Urgent - Within 1 hour",
    4: "Low - Within 2-3 hours",
    5: "Non-Urgent - Routine care",
  };
  return descriptions[level] || "Unknown";
};

// Validate patient form data
export const validatePatientForm = (name, age, triageLevel) => {
  const errors = {};

  if (!name || name.trim() === "") {
    errors.name = "Patient name is required";
  }

  if (!age || age < 1 || age > 150) {
    errors.age = "Valid age is required (1-150)";
  }

  if (!triageLevel || triageLevel < 1 || triageLevel > 5) {
    errors.triageLevel = "Triage level must be between 1-5";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate vital signs
export const validateVitals = (heartRate, bloodPressure) => {
  const errors = {};

  if (!heartRate || heartRate < 30 || heartRate > 200) {
    errors.heartRate = "Heart rate must be between 30-200 bpm";
  }

  if (!bloodPressure || !/^\d+\/\d+$/.test(bloodPressure)) {
    errors.bloodPressure = "Blood pressure must be in format XXX/XX";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
