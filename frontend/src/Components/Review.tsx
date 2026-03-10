import type { FormData } from "../Pages/Profil_maker";

interface Props {
  prevStep: () => void;
  formData: FormData;
  handleSubmit: () => Promise<void>;
}

const labelMap: Record<string, string> = {
  életkor: "🎂 Életkor",
  nem: "👤 Nem",
  bio: "✏️ Bemutatkozás",
  város: "📍 Város",
  keresett_nem: "💑 Kit keresel",
  min_életkor: "📉 Min. életkor",
  max_életkor: "📈 Max. életkor",
  kapcsolat_típusa: "🤝 Kapcsolat típusa",
};

const genderLabels: Record<string, string> = {
  férfi: "Férfi",
  nő: "Nő",
  egyéb: "Egyéb",
  mindegy: "Mindegy",
};

const relationshipLabels: Record<string, string> = {
  serious: "💍 Komoly kapcsolat",
  casual: "🎉 Laza kapcsolat",
  friendship: "🤝 Barátság",
};

const formatValue = (key: string, value: string): string => {
  if (!value) return "—";
  if (key === "nem" || key === "keresett_nem") return genderLabels[value] || value;
  if (key === "kapcsolat_típusa") return relationshipLabels[value] || value;
  if (key === "életkor" || key === "min_életkor" || key === "max_életkor") return `${value} év`;
  return value;
};

export default function Review({ prevStep, formData, handleSubmit }: Props) {
  const displayKeys = Object.keys(formData) as (keyof FormData)[];

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
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-md shadow-rose-200">
              ✓
            </div>
            <span className="text-xs text-rose-400 font-semibold mt-1">Profil</span>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-rose-300 to-pink-300 mb-4 mx-1" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-md shadow-rose-200">
              ✓
            </div>
            <span className="text-xs text-rose-400 font-semibold mt-1">Preferencia</span>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-rose-300 to-pink-300 mb-4 mx-1" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-rose-300">
              3
            </div>
            <span className="text-xs text-rose-500 font-semibold mt-1">Ellenőrzés</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl px-10 py-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md shadow-rose-200">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Ellenőrzés</h2>
              <p className="text-gray-400 text-sm">Nézd át az adataidat</p>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            {displayKeys.map((key) => (
              <div
                key={key}
                className="flex justify-between items-start py-3.5 px-5 rounded-xl bg-rose-50 border border-rose-100"
              >
                <span className="text-sm font-medium text-gray-500">{labelMap[key] || key}</span>
                <span className="text-sm text-gray-800 font-semibold text-right max-w-[55%] break-words">
                  {formatValue(key, formData[key]?.toString() || "")}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={prevStep}
              className="flex-1 py-4 bg-gray-100 text-gray-600 font-semibold rounded-xl border border-gray-200 hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              <span>Vissza</span>
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-rose-600 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Befejezés</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">Készen állsz az ismerkedésre! 🚀</p>
      </div>
    </div>
  );
}