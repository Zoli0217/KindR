import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";
import Preferences from "../components/Preferences";
import Review from "../components/Review";
import api from "../api/axios"

export interface FormData {
  életkor: string;
  nem: string;
  bio: string;
  város: string;
  keresett_nem: string;
  min_életkor: string;
  max_életkor: string;
  kapcsolat_típusa: string;
}

export default function Profil_maker() {
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    életkor: "",
    nem: "",
    bio: "",
    város: "",
    keresett_nem: "",
    min_életkor: "",
    max_életkor: "",
    kapcsolat_típusa: ""
  });

  const nextStep = (): void => setStep(prev => prev + 1);
  const prevStep = (): void => setStep(prev => prev - 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await api.put("profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profil frissítve:", response.data);
      alert("Sikeres profil frissítés!");
      navigate("/swipe");
    } catch (error: any) {
      if (error.response) {
        console.log("Backend hiba:", error.response.data);
        alert(JSON.stringify(error.response.data));
      } else {
        console.log("Network hiba:", error.message);
      }
    }
  };

  switch (step) {
    case 1:
      return (
        <Profile
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          formData={formData}
        />
      );
    case 2:
      return (
        <Preferences
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          formData={formData}
        />
      );
    case 3:
      return (
        <Review
          prevStep={prevStep}
          formData={formData}
          handleSubmit={handleSubmit}
        />
      );
    default:
      return null;
  }
}