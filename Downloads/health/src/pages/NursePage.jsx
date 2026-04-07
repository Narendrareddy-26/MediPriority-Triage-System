// Nurse Page

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NurseDashboard from "../features/nurse/NurseDashboard";

export default function NursePage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and has nurse role
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "nurse") {
      navigate("/");
    }
  }, [navigate]);

  return <NurseDashboard />;
}
