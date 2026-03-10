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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30">
              1
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-cyan-400/50 to-slate-700" />
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 font-bold">
              2
            </div>
            <div className="w-16 h-1 bg-slate-700" />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 font-bold">
            3
          </div>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 p-8 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Személyes adatok</h2>
                <p className="text-slate-400 text-sm">Mutatkozz be a közösségnek</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Age and Gender row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Életkor
                  </span>
                </label>
                <input
                  type="number"
                  name="életkor"
                  placeholder="25"
                  value={formData.életkor}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-slate-600"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Nem
                  </span>
                </label>
                <select
                  name="nem"
                  value={formData.nem}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-slate-600 appearance-none cursor-pointer"
                >
                  <option value="">Válassz</option>
                  <option value="férfi">Férfi</option>
                  <option value="nő">Nő</option>
                  <option value="egyéb">Egyéb</option>
                  <option value="" className="bg-slate-800">Válassz</option>
                  <option value="male" className="bg-slate-800">Férfi</option>
                  <option value="female" className="bg-slate-800">Nő</option>
                  <option value="other" className="bg-slate-800">Egyéb</option>
                </select>
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Város
                </span>
              </label>
              <input
                type="text"
                name="város"
                placeholder="Budapest"
                value={formData.város}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-slate-600"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Bemutatkozás
                </span>
              </label>
              <textarea
                name="bio"
                placeholder="Írj magadról pár sort... Mi az, amit szeretsz csinálni? 🎯"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-slate-600 resize-none"
              />
            </div>

            {/* Next button */}
            <button
              onClick={nextStep}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              <span>Tovább</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer hint */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Az adataid biztonságban vannak 🔒
        </p>
      </div>
    </div>
  );
}