// Doctor Page

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorDashboard from "../features/doctor/DoctorDashboard";

export default function DoctorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and has doctor role
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "doctor") {
      navigate("/");
    }
  }, [navigate]);

  return <DoctorDashboard />;
}
