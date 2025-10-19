import { AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useMasterData } from "../hooks/useMasterData";
import type { RegisterData } from "../service/authService";

export default function Register() {
	const [activeTab, setActiveTab] = useState("warga");
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		alamat: "",
		rw: "",
		rt: "",
		nik: "",
	});

	const [profileData, setProfileData] = useState({
		namaLengkap: "",
		tanggalLahir: "",
		statusPernikahan: "",
		jumlahAnak: "",
		pendidikan: "",
		pekerjaan: "",
		gaji: "",
		gender: "m" as "m" | "f",
	});

	const { register, isLoading, error } = useAuth();
	const masterData = useMasterData();

	const [statusPernikahanMap, setStatusPernikahanMap] = useState<
		Record<string, string>
	>({});
	const [pendidikanMap, setPendidikanMap] = useState<Record<string, string>>({});
	const [gajiMap, setGajiMap] = useState<Record<string, string>>({});
	const [rwMap, setRwMap] = useState<Record<string, string>>({});
	const [rtMap, setRtMap] = useState<Record<string, string>>({});

	useEffect(() => {
		if (masterData.marriageStatuses.data) {
			const map: Record<string, string> = {};
			masterData.marriageStatuses.data.forEach((item) => {
				if (item.name.toLowerCase() === "tidak menikah")
					map["tidak_menikah"] = item.id;
				if (item.name.toLowerCase() === "menikah") map["menikah"] = item.id;
				if (item.name.toLowerCase() === "bercerai") map["bercerai"] = item.id;
			});
			setStatusPernikahanMap(map);
		}

		if (masterData.educations.data) {
			const map: Record<string, string> = {};
			masterData.educations.data.forEach((item) => {
				if (item.name.toLowerCase() === "s1") map["s1"] = item.id;
				if (item.name.toLowerCase() === "s2") map["s2"] = item.id;
				if (item.name.toLowerCase() === "s3") map["s3"] = item.id;
				if (item.name.toLowerCase() === "sma") map["sma"] = item.id;
				if (item.name.toLowerCase() === "smp") map["smp"] = item.id;
				if (item.name.toLowerCase() === "sd") map["sd"] = item.id;
			});
			setPendidikanMap(map);
		}

		if (masterData.salaryRanges.data) {
			const map: Record<string, string> = {};
			masterData.salaryRanges.data.forEach((item) => {
				const min = parseFloat(item.minRange);
				const max = parseFloat(item.maxRange);

				if (min === 500000 && max === 1000000) map["<1jt"] = item.id;
				else if (min === 1000000 && max === 1500000) map["1-3jt"] = item.id;
				else if (min === 1500000 && max === 2000000) map["1-3jt"] = item.id;
				else if (min === 2000000 && max === 2500000) map["3-5jt"] = item.id;
			});
			setGajiMap(map);
		}

		if (masterData.rukunWarga.data) {
			const map: Record<string, string> = {};
			masterData.rukunWarga.data.forEach((item) => {
				map[item.name.toString()] = item.id;
			});
			setRwMap(map);
		}

		if (masterData.rukunTetangga.data) {
			const map: Record<string, string> = {};
			masterData.rukunTetangga.data.forEach((item) => {
				map[item.name.toString()] = item.id;
			});
			setRtMap(map);
		}
	}, [
		masterData.marriageStatuses.data,
		masterData.educations.data,
		masterData.salaryRanges.data,
		masterData.rukunWarga.data,
		masterData.rukunTetangga.data,
	]);

	const isMasterDataLoading =
		masterData.educations.isLoading ||
		masterData.marriageStatuses.isLoading ||
		masterData.salaryRanges.isLoading ||
		masterData.rukunWarga.isLoading ||
		masterData.rukunTetangga.isLoading;

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
				!formData.rt ||
				!formData.nik
			) {
				alert("Mohon lengkapi semua field yang diperlukan");
				return;
			}

			const nikRegex = /^\d{16}$/;
			if (!nikRegex.test(formData.nik)) {
				alert("NIK harus berupa 16 digit angka");
				return;
			}

			setShowModal(true);
		}
	};

	const handleCompleteProfile = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!profileData.namaLengkap ||
			!profileData.tanggalLahir ||
			!profileData.pekerjaan ||
			!profileData.statusPernikahan ||
			!profileData.pendidikan ||
			!profileData.gaji
		) {
			alert("Mohon lengkapi semua data yang diperlukan");
			return;
		}

		const marriageStatusId = statusPernikahanMap[profileData.statusPernikahan];
		const educationId = pendidikanMap[profileData.pendidikan];
		const salaryRangeId = gajiMap[profileData.gaji];
		const rwId = rwMap[formData.rw];
		const rtId = rtMap[formData.rt];

		if (!marriageStatusId) {
			alert(`Status pernikahan tidak valid: ${profileData.statusPernikahan}`);
			return;
		}
		if (!educationId) {
			alert(`Pendidikan tidak valid: ${profileData.pendidikan}`);
			return;
		}
		if (!salaryRangeId) {
			alert(`Gaji tidak valid: ${profileData.gaji}`);
			return;
		}
		if (!rwId) {
			alert(`RW tidak valid: ${formData.rw}`);
			return;
		}
		if (!rtId) {
			alert(`RT tidak valid: ${formData.rt}`);
			return;
		}

		try {
			const birthDateISO = new Date(profileData.tanggalLahir)
				.toISOString()
				.split("T")[0];

			const registerData: RegisterData = {
				fullname: profileData.namaLengkap,
				email: formData.email,
				password: formData.password,
				gender: profileData.gender,
				profession: profileData.pekerjaan,
				birthDate: birthDateISO,
				MarriageStatusId: marriageStatusId,
				RukunWargaId: rwId,
				RukunTetanggaId: rtId,
				EducationId: educationId,
				SalaryRangeId: salaryRangeId,
				nik: formData.nik,
			};

			await register(registerData);

			setFormData({
				email: "",
				password: "",
				alamat: "",
				rw: "",
				rt: "",
				nik: "",
			});
			setProfileData({
				namaLengkap: "",
				tanggalLahir: "",
				statusPernikahan: "",
				jumlahAnak: "",
				pendidikan: "",
				pekerjaan: "",
				gaji: "",
				gender: "m",
			});
			setShowModal(false);
		} catch (err) {
			console.error("Registration error:", err);
		}
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
						<select
							id="rw"
							name="rw"
							value={formData.rw}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748]"
							required>
							<option value="">Pilih RW</option>
							{masterData.rukunWarga.data?.map((rw) => (
								<option key={rw.id} value={rw.name}>
									{rw.name}
								</option>
							))}
						</select>
					</div>
					<div>
						<label
							htmlFor="rt"
							className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
							RT
						</label>
						<select
							id="rt"
							name="rt"
							value={formData.rt}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748]"
							required>
							<option value="">Pilih RT</option>
							{masterData.rukunTetangga.data?.map((rt) => (
								<option key={rt.id} value={rt.name}>
									{rt.name}
								</option>
							))}
						</select>
					</div>
				</div>
				<div>
					<label
						htmlFor="nik"
						className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
						NIK (Nomor Induk Kependudukan)
					</label>
					<input
						type="text"
						id="nik"
						name="nik"
						value={formData.nik}
						onChange={handleInputChange}
						placeholder="Masukkan NIK 16 digit"
						className="w-full px-3 py-2 border border-gray-300 text-xs sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-[#70B748] placeholder-gray-400"
						required
						maxLength={16}
						minLength={16}
					/>
					<p className="text-xs text-gray-500 mt-1">NIK harus 16 digit angka</p>
				</div>
				<button
					type="button"
					onClick={handleSubmit}
					disabled={isLoading}
					className="cursor-pointer w-full bg-[#70B748] text-white text-xs sm:text-base py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
					{isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
					{isLoading ? "Memproses..." : "Daftar"}
				</button>
			</>
		);
	};

	if (isMasterDataLoading) {
		return (
			<div className="flex justify-center items-center py-8">
				<Loader2 className="animate-spin text-[#70B748]" size={32} />
				<span className="ml-2 text-gray-600">Memuat data...</span>
			</div>
		);
	}

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
				<form
					onSubmit={handleCompleteProfile}
					className="fixed inset-0 flex items-center justify-center min-h-screen bg-gray-100 p-2 sm:p-4 z-50">
					<div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto">
						<h1 className="text-lg sm:text-2xl font-bold text-center text-[#70B748] mb-8">
							Lengkapi data diri
						</h1>

						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4">
								<p className="text-red-700 text-sm">{error}</p>
							</div>
						)}

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
								Jenis Kelamin
							</label>
							<div className="flex gap-3">
								<label className="flex items-center">
									<input
										type="radio"
										name="gender"
										value="M"
										checked={profileData.gender === "m"}
										onChange={handleProfileInputChange}
										className="mr-2 text-[#70B748] focus:ring-[#70B748]"
									/>
									<span className="text-xs sm:text-base text-gray-700">Laki-laki</span>
								</label>
								<label className="flex items-center">
									<input
										type="radio"
										name="gender"
										value="F"
										checked={profileData.gender === "f"}
										onChange={handleProfileInputChange}
										className="mr-2 text-[#70B748] focus:ring-[#70B748]"
									/>
									<span className="text-xs sm:text-base text-gray-700">Perempuan</span>
								</label>
							</div>
						</div>

						<div>
							<label className="block text-xs sm:text-base font-medium text-gray-700 mb-1">
								Status pernikahan
							</label>
							<div className="flex gap-3">
								{masterData.marriageStatuses.data?.map((status) => (
									<label key={status.id} className="flex items-center">
										<input
											type="radio"
											name="statusPernikahan"
											value={
												status.name === "tidak menikah" ? "tidak_menikah" : status.name
											}
											checked={
												profileData.statusPernikahan ===
												(status.name === "tidak menikah" ? "tidak_menikah" : status.name)
											}
											onChange={handleProfileInputChange}
											className="mr-2 text-[#70B748] focus:ring-[#70B748]"
										/>
										<span className="text-xs sm:text-base text-gray-700 capitalize">
											{status.name}
										</span>
									</label>
								))}
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
								{masterData.educations.data?.map((edu) => (
									<label key={edu.id} className="flex items-center">
										<input
											type="radio"
											name="pendidikan"
											value={edu.name}
											checked={profileData.pendidikan === edu.name}
											onChange={handleProfileInputChange}
											className="mr-2 text-[#70B748] focus:ring-[#70B748]"
										/>
										<span className="text-xs sm:text-base text-gray-700 uppercase">
											{edu.name}
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
								type="button"
								onClick={handleBackToRegister}
								className="w-full px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors">
								Kembali
							</button>
							<button
								type="submit"
								disabled={isLoading}
								className="w-full px-4 py-2 text-sm bg-[#70B748] text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-[#70B748] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
								{isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
								{isLoading ? "Memproses..." : "Selanjutnya"}
							</button>
						</div>
					</div>
				</form>
			)}
		</>
	);
}
