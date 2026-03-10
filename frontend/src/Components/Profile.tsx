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

export default function Profile({ nextStep, handleChange, formData }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 px-6 py-10">

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-rose-500 drop-shadow">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="text-4xl font-extrabold tracking-tight">
              <span className="text-gray-800">Kind</span>
              <span className="text-rose-500">R</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm">Hozd létre a profilodat</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 gap-0">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-rose-300">
              1
            </div>
            <span className="text-xs text-rose-500 font-semibold mt-1">Profil</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 mb-4 mx-1" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
              2
            </div>
            <span className="text-xs text-gray-400 mt-1">Preferencia</span>
          </div>
          <div className="w-16 h-1 bg-gray-200 mb-4 mx-1" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
              3
            </div>
            <span className="text-xs text-gray-400 mt-1">Ellenőrzés</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl px-10 py-12 ">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md shadow-rose-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Személyes adatok</h2>
              <p className="text-gray-400 text-sm">Mutatkozz be a közösségnek</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Age + Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">🎂 Életkor</label>
                <input
                  type="number"
                  name="életkor"
                  placeholder="25"
                  value={formData.életkor}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">👤 Nem</label>
                <select
                  name="nem"
                  value={formData.nem}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition appearance-none cursor-pointer"
                >
                  <option value="">Válassz</option>
                  <option value="férfi">Férfi</option>
                  <option value="nő">Nő</option>
                  <option value="egyéb">Egyéb</option>
                </select>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">📍 Város</label>
              <input
                type="text"
                name="város"
                placeholder="Budapest"
                value={formData.város}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">✏️ Bemutatkozás</label>
              <textarea
                name="bio"
                placeholder="Írj magadról pár sort... Mi az, amit szeretsz csinálni? 🎯"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition resize-none"
              />
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 mt-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-rose-600 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Tovább</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">Az adataid biztonságban vannak 🔒</p>
      </div>
    </div>
  );
}