import type { FormData } from "../Pages/Profil_maker";

interface Props {
  prevStep: () => void;
  formData: FormData;
  handleSubmit: () => Promise<void>;
}

const labelMap: Record<keyof FormData, string> = {
  életkor: "Életkor",
  nem: "Nem",
  bio: "Bemutatkozás",
  város: "Város",
  keresett_nem: "Preferált nem",
  min_életkor: "Min. életkor",
  max_életkor: "Max. életkor",
  kapcsolat_típusa: "Kapcsolat típusa",
};

export default function Review({ prevStep, formData, handleSubmit }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 px-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-1.5 rounded-full bg-rose-500" />
          <div className="w-10 h-1.5 rounded-full bg-rose-500" />
          <div className="w-10 h-1.5 rounded-full bg-rose-500" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Ellenőrzés</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Nézd át az adataidat mielőtt regisztrálsz</p>

          <div className="space-y-3">
            {(Object.keys(formData) as (keyof FormData)[]).map((key) => (
              <div key={key} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-500">{labelMap[key]}</span>
                <span className="text-sm text-gray-800 text-right max-w-[60%] break-words">
                 
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={prevStep}
              className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 active:scale-[0.98] transition"
            >
              ← Vissza
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] transition"
            >
              Regisztráció 🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}