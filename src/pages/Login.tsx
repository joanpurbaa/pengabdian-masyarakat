import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Login() {
	const [activeTab, setActiveTab] = useState("warga");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const { login, isLoading, error } = useAuth();
	const navigate = useNavigate();

	const handleInputChange = (e: { target: { name: string; value: string } }) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		try {
			await login(formData);

			if (activeTab === "warga") {
				navigate("/");
			} else if (activeTab === "admin") {
				navigate("/admin/responden");
			} else if (activeTab === "medis") {
				navigate("/admin-medis/responden");
			}
		} catch (err) {
			console.error("Login error:", err);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
			<div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md">
				<h1 className="text-lg sm:text-2xl font-bold text-center text-[#70B748] mb-8">
					Ayo masuk!
				</h1>
				<div className="flex mb-6 bg-gray-100 rounded-lg p-1">
					<button
						className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-xs sm:text-base font-medium transition-colors ${
							activeTab === "warga"
								? "bg-[#70B748] text-white"
								: "text-gray-600 hover:text-gray-800"
						}`}
						onClick={() => setActiveTab("warga")}>
						warga
					</button>
					<button
						className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-xs sm:text-base font-medium transition-colors ${
							activeTab === "admin"
								? "bg-[#70B748] text-white"
								: "text-gray-600 hover:text-gray-800"
						}`}
						onClick={() => setActiveTab("admin")}>
						Admin desa
					</button>
					<button
						className={`cursor-pointer flex-1 py-2 px-4 rounded-md text-xs sm:text-base font-medium transition-colors ${
							activeTab === "medis"
								? "bg-[#70B748] text-white"
								: "text-gray-600 hover:text-gray-800"
						}`}
						onClick={() => setActiveTab("medis")}>
						Medis
					</button>
				</div>
				<div className="space-y-4">
					{error && (
						<div className="bg-red-50 border border-red-200 rounded-lg p-4">
							<p className="text-red-700 text-sm">{error}</p>
						</div>
					)}

					<div>
						<label
							htmlFor="email"
							className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="Masukkan email"
							className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
							Password
						</label>
						<input
							type="password"
							id="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							placeholder="Masukkan password"
							className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
							required
						/>
					</div>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isLoading}
						className="cursor-pointer w-full bg-[#70B748] text-white text-xs sm:text-base py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
						{isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
						{isLoading ? "Memproses..." : "Masuk"}
					</button>
				</div>
				<p className="text-center text-xs sm:text-base text-gray-600 mt-4">
					Belum punya akun?{" "}
					<Link
						to={"/daftar"}
						className="text-[#70B748] hover:text-green-600 font-medium">
						daftar
					</Link>
				</p>
			</div>
		</div>
	);
}
