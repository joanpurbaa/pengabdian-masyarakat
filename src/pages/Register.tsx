import { CircleAlertIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function Register() {
	const [activeTab, setActiveTab] = useState("warga");
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		alamat: "",
		rw: "",
		rt: "",
	});

	const handleInputChange = (e: { target: { name: string; value: string } }) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = () => {
		if (activeTab === "warga") {
			console.log("Register form submitted:", {
				...formData,
				userType: activeTab,
			});
		}
	};

	const renderContent = () => {
		if (activeTab === "admin" || activeTab === "medis") {
			return (
				<div className="space-y-6 text-center">
					<div className="bg-red-50 border border-red-200 rounded-lg p-6">
						<div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
							<CircleAlertIcon className="text-red-400" />
						</div>
						<h3 className="text-sm sm:text-lg font-semibold text-red-800 mb-2">
							Akses Terbatas
						</h3>
						<p className="text-red-700 text-xs sm:text-base">
							{activeTab === "admin"
								? "Akun Admin Desa hanya dapat dibuat oleh administrator sistem."
								: "Akun Medis hanya dapat dibuat oleh administrator sistem."}
						</p>
					</div>
				</div>
			);
		}

		return (
			<>
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
				<div>
					<label
						htmlFor="alamat"
						className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
						Alamat
					</label>
					<input
						type="text"
						id="alamat"
						name="alamat"
						value={formData.alamat}
						onChange={handleInputChange}
						placeholder="Masukkan alamat"
						className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
						required
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="rw"
							className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
							RW
						</label>
						<input
							type="text"
							id="rw"
							name="rw"
							value={formData.rw}
							onChange={handleInputChange}
							placeholder="Masukkan RW"
							className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
							required
						/>
					</div>
					<div>
						<label
							htmlFor="rt"
							className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
							RT
						</label>
						<input
							type="text"
							id="rt"
							name="rt"
							value={formData.rt}
							onChange={handleInputChange}
							placeholder="Masukkan RT"
							className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
							required
						/>
					</div>
				</div>
				<button
					type="button"
					onClick={handleSubmit}
					className="cursor-pointer w-full bg-[#70B748] text-white text-xs sm:text-base py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:ring-offset-2 transition-colors font-medium">
					Daftar
				</button>
			</>
		);
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
			<div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-md">
				<h1 className="text-lg sm:text-2xl font-bold text-center text-[#70B748] mb-8">
					Daftarkan Diri Kamu!
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
				<div className="space-y-4">{renderContent()}</div>
				<p className="text-center text-xs sm:text-base text-gray-600 mt-4">
					Sudah punya akun?{" "}
					<Link
						to={"/masuk"}
						className="text-[#70B748] hover:text-green-600 font-medium">
						masuk
					</Link>
				</p>
			</div>
		</div>
	);
}
