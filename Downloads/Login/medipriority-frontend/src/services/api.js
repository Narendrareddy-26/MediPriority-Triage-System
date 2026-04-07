import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  validateToken: () => apiClient.post('/auth/validate'),
};

// Nurse API
export const nurseAPI = {
  registerPatient: (patientData) => apiClient.post('/nurse/patient/register', patientData),
  updateVitals: (patientId, vitalsData) =>
    apiClient.post(`/nurse/patient/${patientId}/vitals`, vitalsData),
  getNursePatients: () => apiClient.get('/nurse/patients'),
};

// Doctor API
export const doctorAPI = {
  getQueue: () => apiClient.get('/doctor/queue'),
  assignPatient: (patientId) => apiClient.post(`/doctor/patient/${patientId}/assign`),
  completePatient: (patientId, notes) =>
    apiClient.post(`/doctor/patient/${patientId}/complete`, { notes }),
  updateNotes: (patientId, notes) =>
    apiClient.post(`/doctor/patient/${patientId}/notes`, { notes }),
  getCompletedPatients: () => apiClient.get('/doctor/completed-patients'),
};

export default apiClient;
