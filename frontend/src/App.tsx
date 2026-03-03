import Login from "./Pages/Login";
import Profil_maker from "./Pages/Profil_maker"
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Profil_maker/>
      <Routes>
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  )
}

export default App
