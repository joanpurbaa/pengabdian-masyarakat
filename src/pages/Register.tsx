import { AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
// import { getAllRw } from "../service/rw";

export default function Register() {
	const [activeTab, setActiveTab] = useState("warga");
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		alamat: "",
		rw: "",
		rt: "",
	});

	const [profileData, setProfileData] = useState({
		namaLengkap: "",
		tanggalLahir: "",
		statusPernikahan: "tidak_menikah",
		jumlahAnak: "",
		pendidikan: "sd",
		pekerjaan: "",
		gaji: "",
	});

	const handleInputChange = (e: { target: { name: string; value: string } }) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleProfileInputChange = (e: {
		target: { name: string; value: string };
	}) => {
		const { name, value } = e.target;
		setProfileData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = () => {
		if (activeTab === "warga") {
			if (
				!formData.email ||
				!formData.password ||
				!formData.alamat ||
				!formData.rw ||
				!formData.rt
			) {
				alert("Mohon lengkapi semua field yang diperlukan");
				return;
			}

			console.log("Register form submitted:", {
				...formData,
				userType: activeTab,
			});

			setShowModal(true);
		}
	};

	const handleCompleteProfile = () => {
		if (
			!profileData.namaLengkap ||
			!profileData.tanggalLahir ||
			!profileData.pekerjaan
		) {
			alert("Mohon lengkapi data yang diperlukan");
			return;
		}

		console.log("Complete profile submitted:", {
			registerData: formData,
			profileData: profileData,
		});

		setFormData({
			email: "",
			password: "",
			alamat: "",
			rw: "",
			rt: "",
		});
		setProfileData({
			namaLengkap: "",
			tanggalLahir: "",
			statusPernikahan: "tidak_menikah",
			jumlahAnak: "",
			pendidikan: "sd",
			pekerjaan: "",
			gaji: "",
		});

		window.location.href = "/masuk";
	};

	const handleBackToRegister = () => {
		setShowModal(false);
	};

	const renderContent = () => {
		if (activeTab === "admin" || activeTab === "medis") {
			return (
				<div className="space-y-6 text-center">
					<div className="bg-red-50 border border-red-200 rounded-lg p-6">
						<div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
							<AlertCircle className="text-red-400" />
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
		<>
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
						<a
							href="/masuk"
							className="text-[#70B748] hover:text-green-600 font-medium">
							masuk
						</a>
					</p>
				</div>
			</div>

			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gray-100 p-2 sm:p-4 z-50">
					<div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-[600px] space-y-4">
						<h1 className="text-lg sm:text-2xl font-bold text-center text-[#70B748] mb-8">
							Lengkapi data diri
						</h1>
						<div>
							<label className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
								Nama Lengkap
							</label>
							<input
								type="text"
								name="namaLengkap"
								value={profileData.namaLengkap}
								onChange={handleProfileInputChange}
								placeholder="Masukkan nama lengkap"
								className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
								required
							/>
						</div>

						<div>
							<label className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
								Tanggal lahir
							</label>
							<div className="relative">
								<input
									type="date"
									name="tanggalLahir"
									value={profileData.tanggalLahir}
									onChange={handleProfileInputChange}
									className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748]"
									required
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
								Status pernikahan
							</label>
							<div className="flex gap-3">
								<label className="flex items-center">
									<input
										type="radio"
										name="statusPernikahan"
										value="tidak_menikah"
										checked={profileData.statusPernikahan === "tidak_menikah"}
										onChange={handleProfileInputChange}
										className="mr-2 text-[#70B748] focus:ring-[#70B748]"
									/>
									<span className="text-xs sm:text-base text-gray-700">
										Tidak menikah
									</span>
								</label>
								<label className="flex items-center">
									<input
										type="radio"
										name="statusPernikahan"
										value="menikah"
										checked={profileData.statusPernikahan === "menikah"}
										onChange={handleProfileInputChange}
										className="mr-2 text-[#70B748] focus:ring-[#70B748]"
									/>
									<span className="text-xs sm:text-base text-gray-700">Menikah</span>
								</label>
								<label className="flex items-center">
									<input
										type="radio"
										name="statusPernikahan"
										value="bercerai"
										checked={profileData.statusPernikahan === "bercerai"}
										onChange={handleProfileInputChange}
										className="mr-2 text-[#70B748] focus:ring-[#70B748]"
									/>
									<span className="text-xs sm:text-base text-gray-700">Bercerai</span>
								</label>
							</div>
						</div>

						{profileData.statusPernikahan !== "tidak_menikah" && (
							<div>
								<label className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
									Jumlah anak
								</label>
								<input
									type="number"
									name="jumlahAnak"
									value={profileData.jumlahAnak}
									onChange={handleProfileInputChange}
									placeholder="Masukkan jumlah"
									min="0"
									className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
								/>
							</div>
						)}

						<div>
							<label className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
								Pendidikan
							</label>
							<div className="flex flex-wrap gap-3 text-sm">
								{[
									{ value: "sd", label: "SD/MI" },
									{ value: "smp", label: "SMP/MTS" },
									{ value: "sma", label: "SMA/MA" },
									{ value: "univ", label: "Univ" },
									{ value: "tidak_sekolah", label: "Tidak sekolah" },
								].map((option) => (
									<label key={option.value} className="flex items-center">
										<input
											type="radio"
											name="pendidikan"
											value={option.value}
											checked={profileData.pendidikan === option.value}
											onChange={handleProfileInputChange}
											className="mr-2 text-[#70B748] focus:ring-[#70B748]"
										/>
										<span className="text-xs sm:text-base text-gray-700">
											{option.label}
										</span>
									</label>
								))}
							</div>
						</div>

						<div>
							<label className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
								Pekerjaan
							</label>
							<input
								type="text"
								name="pekerjaan"
								value={profileData.pekerjaan}
								onChange={handleProfileInputChange}
								placeholder="Masukkan pekerjaan"
								className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
								required
							/>
						</div>
						<div>
							<label className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
								Gaji
							</label>
							<div className="relative">
								<select
									name="gaji"
									value={profileData.gaji}
									onChange={handleProfileInputChange}
									className="w-full px-3 py-2 border border-gray-300 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] appearance-none bg-white">
									<option value="">Pilih range gaji</option>
									<option value="<1jt">{"<"} 1 Juta</option>
									<option value="1-3jt">1 - 3 Juta</option>
									<option value="3-5jt">3 - 5 Juta</option>
									<option value="5-10jt">5 - 10 Juta</option>
									<option value=">10jt">{">"} 10 Juta</option>
								</select>
								<ChevronDown
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									size={16}
								/>
							</div>
						</div>
						<div className="flex gap-3">
							<button
								onClick={handleBackToRegister}
								className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors">
								Kembali
							</button>
							<button
								onClick={handleCompleteProfile}
								className="w-full px-4 py-2 text-sm bg-[#70B748] text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-[#70B748] transition-colors">
								Selanjutnya
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
