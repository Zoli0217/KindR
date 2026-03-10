import { useState, useEffect } from 'react';
import SwipeCards from './Components/SwipeCards';
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profil_maker from "./Pages/Profil_maker"
import Profil_maker from "./Pages/Profil_maker";
import Chat from "./Pages/Chat";
import { Routes, Route, Navigate } from "react-router-dom";
import Logout from "./Pages/Logout";
import api from "./api/axios";

// Protected route component - checks if user is logged in
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("accessToken");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsAuthenticated(false);
        setProfileCompleted(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      try {
        const response = await api.get("profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileCompleted(response.data.is_completed || false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileCompleted(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();

    // Listen for custom auth change events so SPA can react without a full reload
    const onAuthChanged = () => {
      setLoading(true);
      checkAuthStatus();
    };

    window.addEventListener("authChanged", onAuthChanged);

    return () => {
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Betöltés...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isAuthenticated ? <Login /> : <Navigate to={profileCompleted ? "/swipe" : "/profile-maker"} replace />} 
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to={profileCompleted ? "/swipe" : "/profile-maker"} replace />}
      />
      <Route 
        path="/profile-maker" 
        element={<ProtectedRoute><Profil_maker /></ProtectedRoute>} 
      />
      <Route 
        path="/swipe" 
        element={<ProtectedRoute><SwipeCards /></ProtectedRoute>} 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? (profileCompleted ? "/swipe" : "/profile-maker") : "/login"} replace />} 
      />
      <Route path="/logout" element={<Logout />} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
    </Routes>
  );
}

export default App
