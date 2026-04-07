// App Routes

import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Register from "../features/auth/Register";
import NursePage from "../pages/NursePage";
import DoctorPage from "../pages/DoctorPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/nurse" element={<NursePage />} />
      <Route path="/doctor" element={<DoctorPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
