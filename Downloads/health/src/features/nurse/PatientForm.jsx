// Patient Registration Form Component

import { useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { validatePatientForm } from "../../utils/triageUtils";

export default function PatientForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    triageLevel: "3",
    heartRate: "",
    bloodPressure: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate required fields
    const validation = validatePatientForm(
      formData.name,
      formData.age,
      formData.triageLevel
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Prepare patient data
    const patientData = {
      name: formData.name.trim(),
      age: parseInt(formData.age),
      triageLevel: parseInt(formData.triageLevel),
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
      bloodPressure: formData.bloodPressure || null,
      registeredBy: JSON.parse(localStorage.getItem("user")).username,
    };

    await onSubmit(patientData);
    setSubmitted(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        age: "",
        triageLevel: "3",
        heartRate: "",
        bloodPressure: "",
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md max-w-md"
    >
      <h2 className="text-2xl font-bold mb-4">Register New Patient</h2>

      {submitted && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          ✓ Patient registered successfully!
        </div>
      )}

      <Input
        label="Patient Name"
        type="text"
        name="name"
        placeholder="Enter patient name"
        value={formData.name}
        onChange={handleInputChange}
        required
        disabled={loading}
      />
      {errors.name && (
        <p className="text-red-500 text-sm mb-2 -mt-3">{errors.name}</p>
      )}

      <Input
        label="Age"
        type="number"
        name="age"
        placeholder="Enter patient age"
        value={formData.age}
        onChange={handleInputChange}
        required
        disabled={loading}
      />
      {errors.age && (
        <p className="text-red-500 text-sm mb-2 -mt-3">{errors.age}</p>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Initial Triage Level
          <span className="text-red-500">*</span>
        </label>
        <select
          name="triageLevel"
          value={formData.triageLevel}
          onChange={handleInputChange}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">1 - Critical</option>
          <option value="2">2 - Urgent</option>
          <option value="3">3 - Semi-Urgent</option>
          <option value="4">4 - Low</option>
          <option value="5">5 - Non-Urgent</option>
        </select>
      </div>

      <div className="bg-blue-50 p-4 rounded mb-4">
        <h3 className="font-semibold text-blue-900 mb-2">Vitals (Optional)</h3>
        <p className="text-blue-800 text-sm mb-3">
          Enter vitals if available. Heart rate and blood pressure outside normal
          ranges may upgrade the triage level.
        </p>

        <Input
          label="Heart Rate (bpm)"
          type="number"
          name="heartRate"
          placeholder="e.g., 72"
          value={formData.heartRate}
          onChange={handleInputChange}
          disabled={loading}
        />

        <Input
          label="Blood Pressure (Sys/Dia)"
          type="text"
          name="bloodPressure"
          placeholder="e.g., 120/80"
          value={formData.bloodPressure}
          onChange={handleInputChange}
          disabled={loading}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="w-full"
      >
        {loading ? "Registering..." : "Register Patient"}
      </Button>
    </form>
  );
}
