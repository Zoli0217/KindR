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
export default function Profile({ nextStep, prevStep, handleChange, formData }: Props) {
  return (
    <div>
      <h2>Profil adatok</h2>

      <input
        type="email"
        name="email"
        placeholder="E-mail cím"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Jelszó"
        value={formData.password}
        onChange={handleChange}
      />

      <input
        type="number"
        name="age"
        placeholder="Életkor"
        value={formData.age}
        onChange={handleChange}
      />

      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Nem</option>
        <option value="male">Férfi</option>
        <option value="female">Nő</option>
        <option value="other">Egyéb</option>
      </select>

      <input
        type="text"
        name="city"
        placeholder="Város"
        value={formData.city}
        onChange={handleChange}
      />

      <textarea
        name="bio"
        placeholder="Írj magadról..."
        value={formData.bio}
        onChange={handleChange}
      />

      <button onClick={prevStep}>Vissza</button>
      <button onClick={nextStep}>Tovább</button>
    </div>
  );
}