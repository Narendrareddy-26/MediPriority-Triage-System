// Login Page

import Login from "../features/auth/Login";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <Login />
      <div className="mt-4 text-center">
        <p className="text-white">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-bold text-yellow-300 hover:text-yellow-100 underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}
