// Mock API calls for authentication
// In a real app, these would call your backend

const API_BASE_URL = "http://localhost:5000/api";

// Simulate user database
let registeredUsers = [
  { id: 1, username: "nurse1", password: "nurse123", role: "nurse" },
  { id: 2, username: "doctor1", password: "doctor123", role: "doctor" },
];

// Login API
export const loginUser = async (username, password) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = registeredUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
        token: "fake-jwt-token-" + user.id,
      },
    };
  }

  return {
    success: false,
    error: "Invalid username or password",
  };
};

// Register API
export const registerUser = async (username, password, role) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Check if user already exists
  if (registeredUsers.find((u) => u.username === username)) {
    return {
      success: false,
      error: "User already exists",
    };
  }

  const newUser = {
    id: registeredUsers.length + 1,
    username,
    password,
    role,
  };

  registeredUsers.push(newUser);

  return {
    success: true,
    data: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      token: "fake-jwt-token-" + newUser.id,
    },
  };
};
