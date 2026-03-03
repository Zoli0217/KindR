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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 px-4">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-1.5 rounded-full bg-rose-500" />
          <div className="w-10 h-1.5 rounded-full bg-rose-500" />
          <div className="w-10 h-1.5 rounded-full bg-gray-200" />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Preferenciák</h2>
          <p className="text-gray-400 text-sm text-center mb-6">Milyen partnert keresel?</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Preferált nem</label>
              <select
                name="preferred_gender"
                value={formData.preferred_gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition appearance-none"
              >
                <option value="">Válassz</option>
                <option value="male">Férfi</option>
                <option value="female">Nő</option>
                <option value="other">Egyéb</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Min. életkor</label>
                <input
                  type="number"
                  name="min_age"
                  placeholder="18"
                  value={formData.min_age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Max. életkor</label>
                <input
                  type="number"
                  name="max_age"
                  placeholder="35"
                  value={formData.max_age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Kapcsolat típusa</label>
              <select
                name="relationship_type"
                value={formData.relationship_type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition appearance-none"
              >
                <option value="">Válassz</option>
                <option value="serious">Komoly kapcsolat</option>
                <option value="casual">Laza kapcsolat</option>
                <option value="friendship">Barátság</option>
              </select>
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={prevStep}
                className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 active:scale-[0.98] transition"
              >
                ← Vissza
              </button>
              <button
                onClick={nextStep}
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] transition"
              >
                Tovább →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}