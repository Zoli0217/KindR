import './App.css'
import Login from "./Pages/Login";
import Profil_maker from "./Pages/Profil_maker"
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  
  return (
    <Routes>
      {/* default to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile-maker" element={<Profil_maker />} />
    </Routes>
  )
}

export default App
