import type { FormData } from "../Pages/Profil_maker";

interface Props {
  prevStep: () => void;
  formData: FormData;
  handleSubmit: () => Promise<void>;
}

const labelMap: Record<string, string> = {
  age: "Életkor",
  gender: "Nem",
  bio: "Bemutatkozás",
  city: "Város",
  preferred_gender: "Preferált nem",
  min_age: "Min. életkor",
  max_age: "Max. életkor",
  relationship_type: "Kapcsolat típusa",
};

const genderLabels: Record<string, string> = {
  male: "Férfi",
  female: "Nő",
  other: "Egyéb",
};

const relationshipLabels: Record<string, string> = {
  serious: "💍 Komoly kapcsolat",
  casual: "🎉 Laza kapcsolat",
  friendship: "🤝 Barátság",
};

const formatValue = (key: string, value: string): string => {
  if (!value) return "—";
  if (key === "gender" || key === "preferred_gender") return genderLabels[value] || value;
  if (key === "relationship_type") return relationshipLabels[value] || value;
  if (key === "age" || key === "min_age" || key === "max_age") return `${value} év`;
  return value;
};

export default function Review({ prevStep, formData, handleSubmit }: Props) {
  const displayKeys = Object.keys(formData).filter(key => key !== 'avatar_url');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30">
              ✓
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500" />
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
              ✓
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-emerald-500" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
            3
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Ellenőrzés</h2>
                <p className="text-slate-400 text-sm">Nézd át az adataidat</p>
              </div>
            </div>
          </div>

          {/* Data display */}
          <div className="space-y-3 mb-8">
            {displayKeys.map((key) => (
              <div 
                key={key} 
                className="flex justify-between items-start p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300"
              >
                <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  {labelMap[key] || key}
                </span>
                <span className="text-sm text-white text-right max-w-[60%] break-words font-medium">
                  {formatValue(key, formData[key as keyof FormData])}
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={prevStep}
              className="flex-1 py-4 bg-slate-800 text-slate-300 font-bold rounded-xl border border-slate-700 hover:bg-slate-700 hover:border-slate-600 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              <span>Vissza</span>
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Mentés</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Készen állsz az ismerkedésre! 🚀
        </p>
      </div>
    </div>
  );
}