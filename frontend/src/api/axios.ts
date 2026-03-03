import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // backend URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Logout function
export const logout = async () => {
  try {
    await api.post("logout/");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear tokens regardless of response
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  }
};

export default api;