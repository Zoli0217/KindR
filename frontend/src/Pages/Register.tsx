import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
	const [form, setForm] = useState({ email: "", username: "", first_name: "", password: "", confirm_password: "" });
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!form.email || !form.username || !form.password || !form.first_name) {
			setError("Tölts ki minden mezőt!");
			return;
		}

		if (form.password !== form.confirm_password) {
			setError("A jelszavak nem egyeznek.");
			return;
		}

		setLoading(true);
		try {
			await api.post("register/", {
				email: form.email,
				username: form.username,
				first_name: form.first_name,
				password: form.password,
			});

			// Auto-login after successful registration so user doesn't need to refresh
			const tokenRes = await api.post("token/", {
				username: form.username,
				password: form.password,
			});

			const { access, refresh } = tokenRes.data;
			localStorage.setItem("accessToken", access);
			localStorage.setItem("refreshToken", refresh);

			// Notify App to re-check auth and navigate to root
			window.dispatchEvent(new Event("authChanged"));
			navigate("/");
		} catch (err: any) {
			console.error(err);
			if (err.response && err.response.data) {
				// Show backend validation errors if available
				const data = err.response.data;
				if (typeof data === "string") setError(data);
				else if (data.username) setError(String(data.username));
				else if (data.email) setError(String(data.email));
				else setError("Sikertelen regisztráció. Ellenőrizd az adatokat.");
			} else {
				setError("Sikertelen regisztráció. Ellenőrizd az adatokat.");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 px-4">
			<div className="w-full max-w-md">
				<div className="flex flex-col items-center mb-8">
					<div className="flex items-center gap-2 mb-2">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-rose-500">
							<path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
						</svg>
						<span className="text-4xl font-extrabold tracking-tight">
							<span className="text-gray-800">Kind</span>
							<span className="text-rose-500">R</span>
						</span>
					</div>
					<p className="text-gray-500 text-sm">Hozz létre fiókot és kezdd el a keresést</p>
				</div>

				<div className="bg-white rounded-2xl shadow-xl p-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Regisztráció</h2>

					<form onSubmit={handleSubmit} className="space-y-4">
						{error && <div className="text-sm text-red-600 text-center">{error}</div>}
						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1">Keresztnév</label>
							<input
								name="first_name"
								placeholder="Add meg a keresztneved"
								value={form.first_name}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1">Felhasználónév</label>
							<input
								name="username"
								placeholder="Válassz felhasználónevet"
								value={form.username}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
							<input
								name="email"
								type="email"
								placeholder="Email címed"
								value={form.email}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1">Jelszó</label>
							<input
								name="password"
								type="password"
								placeholder="••••••••"
								value={form.password}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 mb-1">Jelszó megerősítése</label>
							<input
								name="confirm_password"
								type="password"
								placeholder="Ismételd meg a jelszót"
								value={form.confirm_password}
								onChange={handleChange}
								className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Betöltés..." : "Regisztráció"}
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-gray-500 text-sm">
							Már van fiókod?{" "}
							<button
								onClick={() => navigate("/login")}
								className="text-rose-500 font-semibold hover:underline"
							>
								Jelentkezz be!
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;

