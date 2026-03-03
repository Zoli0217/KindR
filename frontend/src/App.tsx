import './App.css'
import SwipeCards from './components/SwipeCards'
import Login from "./Pages/Login";
import Profil_maker from "./Pages/Profil_maker"
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SwipeCards />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Profil_maker />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
