import { useState } from "react";
import Profile from "../Components/Profile";
import Preferences from "../Components/Preferences";
import Review from "../Components/Review";

export interface FormData {
  email: string;
  password: string;
  age: string;
  gender: string;
  bio: string;
  city: string;
  preferred_gender: string;
  min_age: string;
  max_age: string;
  relationship_type: string;
}

export default function Profil_maker() {
  const [step, setStep] = useState<number>(1);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    age: "",
    gender: "",
    bio: "",
    city: "",
    preferred_gender: "",
    min_age: "",
    max_age: "",
    relationship_type: ""
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
      const response = await fetch("http://localhost:8000/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Hiba történt");

      alert("Sikeres regisztráció!");
    } catch (err) {
      console.error(err);
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