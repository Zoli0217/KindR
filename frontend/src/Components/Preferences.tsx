import type { FormData } from "../Pages/Profil_maker";

type InputEvent =
  React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  handleChange: (e: InputEvent) => void;
  formData: FormData;
}
export default function Preferences({ nextStep, prevStep, handleChange, formData }: Props) {
  return (
    <div>
      <h2>Milyen partnert keresel?</h2>

      <select
        name="preferred_gender"
        value={formData.preferred_gender}
        onChange={handleChange}
      >
        <option value="">Preferált nem</option>
        <option value="male">Férfi</option>
        <option value="female">Nő</option>
        <option value="other">Egyéb</option>
      </select>

      <input
        type="number"
        name="min_age"
        placeholder="Minimum életkor"
        value={formData.min_age}
        onChange={handleChange}
      />

      <input
        type="number"
        name="max_age"
        placeholder="Maximum életkor"
        value={formData.max_age}
        onChange={handleChange}
      />

      <select
        name="relationship_type"
        value={formData.relationship_type}
        onChange={handleChange}
      >
        <option value="">Kapcsolat típusa</option>
        <option value="serious">Komoly kapcsolat</option>
        <option value="casual">Laza kapcsolat</option>
        <option value="friendship">Barátság</option>
      </select>

      <button onClick={prevStep}>Vissza</button>
      <button onClick={nextStep}>Tovább</button>
    </div>
  );
}