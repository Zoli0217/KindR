import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("token/", form);
      const { access, refresh } = res.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      alert("Sikeres bejelentkezés!");
      // redirect to profile maker
      navigate("/profile-maker");
    } catch (err) {
      console.error(err);
      alert("Hibás felhasználónév vagy jelszó");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Felhasználónév"
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Jelszó"
        onChange={handleChange}
      />
      <button type="submit">Bejelentkezés</button>
    </form>
  );
}

export default Login;