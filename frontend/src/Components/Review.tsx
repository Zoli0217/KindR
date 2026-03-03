import type { FormData } from "../Pages/Profil_maker";

interface Props {
  prevStep: () => void;
  formData: FormData;
  handleSubmit: () => Promise<void>;
}

export default function Review({ prevStep, formData, handleSubmit }: Props) {
  return (
    <div>
      <h2>Ellenőrzés</h2>

      <pre>{JSON.stringify(formData, null, 2)}</pre>

      <button onClick={prevStep}>Vissza</button>
      <button onClick={handleSubmit}>Regisztráció</button>
    </div>
  );
}