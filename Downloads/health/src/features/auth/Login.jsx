// Login Component

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginUser(username, password);

      if (result.success) {
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(result.data));

        // Redirect based on role
        if (result.data.role === "nurse") {
          navigate("/nurse");
        } else if (result.data.role === "doctor") {
          navigate("/doctor");
        }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-600">
          MediPriority
        </h1>
        <p className="text-center text-gray-600 mb-6">Triage System</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Demo Credentials:</p>
          <div className="bg-blue-50 p-3 rounded text-sm space-y-2">
            <div>
              <p className="font-semibold">Nurse:</p>
              <p>Username: nurse1</p>
              <p>Password: nurse123</p>
            </div>
            <div>
              <p className="font-semibold">Doctor:</p>
              <p>Username: doctor1</p>
              <p>Password: doctor123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
