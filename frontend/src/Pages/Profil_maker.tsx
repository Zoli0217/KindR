import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../Components/Profile";
import Preferences from "../Components/Preferences";
import Review from "../Components/Review";
import api, { logout } from "../api/axios"

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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      // Map Hungarian field names to backend API field names
      const payload = {
        age: formData.életkor,
        gender: formData.nem,
        bio: formData.bio,
        city: formData.város,
        preferred_gender: formData.keresett_nem,
        min_age: formData.min_életkor,
        max_age: formData.max_életkor,
        relationship_type: formData.kapcsolat_típusa,
      };
      const response = await api.put("profile/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Profil frissítve:", response.data);
      navigate("/swipe");
    } catch (err: any) {
      if (err.response) {
        console.log("Backend hiba:", err.response.data);
        setError(JSON.stringify(err.response.data));
      } else {
        console.log("Network hiba:", err.message);
        setError(err.message);
      }
    }
  };

  switch (step) {
    case 1:
      return (
        <div>
          <div className="flex justify-end p-4">
            <button
              onClick={() => logout()}
              className="px-3 py-2 rounded-md bg-rose-500 text-white hover:bg-rose-600"
            >
              Kijelentkezés
            </button>
          </div>
          <Profile
            nextStep={nextStep}
            prevStep={prevStep}
            handleChange={handleChange}
            formData={formData}
          />
        </div>
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
        <div>
          <div className="flex justify-end p-4">
            <button
              onClick={() => logout()}
              className="px-3 py-2 rounded-md bg-rose-500 text-white hover:bg-rose-600"
            >
              Kijelentkezés
            </button>
          </div>
          {error && <div className="text-sm text-red-600 text-center">{error}</div>}
          <Review
            prevStep={prevStep}
            formData={formData}
            handleSubmit={handleSubmit}
          />
        </div>
      );
    default:
      return null;
  }
}