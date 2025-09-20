import { useState } from "react";
import { Link, useLocation } from "react-router";

export default function DetailAnggotaKeluargaSection({
	rwId,
	rtId,
	keluargaId,
	anggotaName,
}: {
	rwId: string;
	rtId: string;
	keluargaId: string;
	anggotaName: string;
}) {
	const currentSection = useLocation().pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const lastSegment = pathSegments[pathSegments.length - 1];
	const anggotaId = lastSegment.split("-").pop();

	const [activeTab, setActiveTab] = useState("profil");

	const [keluargaData] = useState([
		{
			id: "1",
			nama: "Budi Santoso",
			nik: "1504851201230001",
			statusPernikahan: "Sudah",
			pekerjaan: "Petani",
			jumlahAnak: 2,
			pengulangan: 1,
			tanggalTerakhir: "2025-09-10",
			statusMental: "Stabil",
			penghasilan: 2500000,
		},
		{
			id: "2",
			nama: "Siti Aminah",
			nik: "2203880305230002",
			statusPernikahan: "Sudah",
			pekerjaan: "Ibu Rumah Tangga",
			jumlahAnak: 3,
			pengulangan: 2,
			tanggalTerakhir: "2025-09-11",
			statusMental: "Stabil",
			penghasilan: 0,
		},
		{
			id: "3",
			nama: "Ahmad Wijaya",
			nik: "0812851104230003",
			statusPernikahan: "Sudah",
			pekerjaan: "Guru",
			jumlahAnak: 1,
			pengulangan: 1,
			tanggalTerakhir: "2025-09-12",
			statusMental: "Stabil",
			penghasilan: 5000000,
		},
		{
			id: "4",
			nama: "Rini Susanti",
			nik: "1509890207230004",
			statusPernikahan: "Sudah",
			pekerjaan: "Pedagang",
			jumlahAnak: 4,
			pengulangan: 3,
			tanggalTerakhir: "2025-09-14",
			statusMental: "Tidak Stabil",
			penghasilan: 4000000,
		},
		{
			id: "5",
			nama: "Dewi Lestari",
			nik: "2401950308230005",
			statusPernikahan: "Belum",
			pekerjaan: "Mahasiswa",
			jumlahAnak: 0,
			pengulangan: 1,
			tanggalTerakhir: "2025-09-15",
			statusMental: "Tidak Stabil",
			penghasilan: 0,
		},
		{
			id: "6",
			nama: "Joko Prasetyo",
			nik: "1206821109230006",
			statusPernikahan: "Sudah",
			pekerjaan: "Karyawan",
			jumlahAnak: 2,
			pengulangan: 2,
			tanggalTerakhir: "2025-09-13",
			statusMental: "Stabil",
			penghasilan: 4500000,
		},
		{
			id: "7",
			nama: "Maya Sari",
			nik: "2708860410230007",
			statusPernikahan: "Sudah",
			pekerjaan: "Dokter",
			jumlahAnak: 1,
			pengulangan: 1,
			tanggalTerakhir: "2025-09-12",
			statusMental: "Stabil",
			penghasilan: 12000000,
		},
		{
			id: "8",
			nama: "Rahmat Hidayat",
			nik: "0511801205230008",
			statusPernikahan: "Sudah",
			pekerjaan: "Sopir",
			jumlahAnak: 3,
			pengulangan: 2,
			tanggalTerakhir: "2025-09-10",
			statusMental: "Stabil",
			penghasilan: 3500000,
		},
		{
			id: "9",
			nama: "Fitri Handayani",
			nik: "1812870306230009",
			statusPernikahan: "Sudah",
			pekerjaan: "Perawat",
			jumlahAnak: 2,
			pengulangan: 3,
			tanggalTerakhir: "2025-09-09",
			statusMental: "Tidak Stabil",
			penghasilan: 6000000,
		},
		{
			id: "10",
			nama: "Andi Saputra",
			nik: "2209961107230010",
			statusPernikahan: "Belum",
			pekerjaan: "Mahasiswa",
			jumlahAnak: 0,
			pengulangan: 1,
			tanggalTerakhir: "2025-09-08",
			statusMental: "Stabil",
			penghasilan: 0,
		},
		{
			id: "11",
			nama: "Nur Aisyah",
			nik: "1405900208230011",
			statusPernikahan: "Sudah",
			pekerjaan: "Guru",
			jumlahAnak: 2,
			pengulangan: 1,
			tanggalTerakhir: "2025-09-07",
			statusMental: "Stabil",
			penghasilan: 5000000,
		},
		{
			id: "12",
			nama: "Eko Setiawan",
			nik: "0903781309230012",
			statusPernikahan: "Sudah",
			pekerjaan: "Nelayan",
			jumlahAnak: 4,
			pengulangan: 2,
			tanggalTerakhir: "2025-09-06",
			statusMental: "Stabil",
			penghasilan: 3000000,
		},
		{
			id: "13",
			nama: "Lina Marlina",
			nik: "3110830410230013",
			statusPernikahan: "Janda",
			pekerjaan: "Pedagang",
			jumlahAnak: 2,
			pengulangan: 3,
			tanggalTerakhir: "2025-09-05",
			statusMental: "Stabil",
			penghasilan: 3500000,
		},
		{
			id: "14",
			nama: "Agus Kurniawan",
			nik: "1607791105230014",
			statusPernikahan: "Sudah",
			pekerjaan: "Karyawan",
			jumlahAnak: 3,
			pengulangan: 2,
			tanggalTerakhir: "2025-09-04",
			statusMental: "Tidak Stabil",
			penghasilan: 4500000,
		},
		{
			id: "15",
			nama: "Rosa Melati",
			nik: "2504980206230015",
			statusPernikahan: "Belum",
			pekerjaan: "Mahasiswa",
			jumlahAnak: 0,
			pengulangan: 1,
			tanggalTerakhir: "2025-09-03",
			statusMental: "Stabil",
			penghasilan: 0,
		},
		{
			id: "16",
			nama: "Hendra Gunawan",
			nik: "1302811307230016",
			statusPernikahan: "Sudah",
			pekerjaan: "Petani",
			jumlahAnak: 2,
			pengulangan: 2,
			tanggalTerakhir: "2025-09-02",
			statusMental: "Tidak Stabil",
			penghasilan: 2500000,
		},
		{
			id: "17",
			nama: "Yuni Kartika",
			nik: "2906880108230017",
			statusPernikahan: "Sudah",
			pekerjaan: "Perawat",
			jumlahAnak: 1,
			pengulangan: 1,
			tanggalTerakhir: "2025-09-01",
			statusMental: "Stabil",
			penghasilan: 6000000,
		},
		{
			id: "18",
			nama: "Doni Pratama",
			nik: "1108841209230018",
			statusPernikahan: "Sudah",
			pekerjaan: "Sopir",
			jumlahAnak: 3,
			pengulangan: 3,
			tanggalTerakhir: "2025-08-31",
			statusMental: "Stabil",
			penghasilan: 3500000,
		},
		{
			id: "19",
			nama: "Sari Indah",
			nik: "0712870310230019",
			statusPernikahan: "Sudah",
			pekerjaan: "Ibu Rumah Tangga",
			jumlahAnak: 4,
			pengulangan: 2,
			tanggalTerakhir: "2025-08-30",
			statusMental: "Stabil",
			penghasilan: 0,
		},
		{
			id: "20",
			nama: "Bayu Nugroho",
			nik: "2001851011230020",
			statusPernikahan: "Sudah",
			pekerjaan: "Karyawan",
			jumlahAnak: 2,
			pengulangan: 1,
			tanggalTerakhir: "2025-08-29",
			statusMental: "Stabil",
			penghasilan: 4500000,
		},
	]);

	const anggotaDetail = keluargaData.find((a) => a.id === anggotaId);

	const tabs = [
		{ id: "profil", label: "Profil" },
		{ id: "mental", label: "Mental" },
	];

	return (
		<>
			<div className="flex flex-col bg-gray-100 rounded-xl p-6 mt-4 shadow-sm gap-5">
				<div className="bg-white rounded-lg shadow-sm">
					<div className="flex border-b border-gray-200">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`px-6 py-3 text-sm font-medium transition-colors duration-200 border-b-2 ${
									activeTab === tab.id
										? "text-[#70B748] border-[#70B748] bg-green-50"
										: "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
								}`}>
								{tab.label}
							</button>
						))}
					</div>

					<div className="p-6">
						{activeTab === "profil" && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-800 mb-4">
									Informasi Profil
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Nama Lengkap
										</label>
										<p className="text-gray-800 font-semibold">
											{anggotaDetail?.nama || "-"}
										</p>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											NIK
										</label>
										<p className="text-gray-800 font-semibold">
											{anggotaDetail?.nik || "-"}
										</p>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Status Pernikahan
										</label>
										<p className="text-gray-800 font-semibold">
											{anggotaDetail?.statusPernikahan || "-"}
										</p>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Pekerjaan
										</label>
										<p className="text-gray-800 font-semibold">
											{anggotaDetail?.pekerjaan || "-"}
										</p>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Jumlah Anak
										</label>
										<p className="text-gray-800 font-semibold">
											{anggotaDetail?.jumlahAnak || "0"}
										</p>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Penghasilan
										</label>
										<p className="text-gray-800 font-semibold">
											{anggotaDetail?.penghasilan !== undefined
												? new Intl.NumberFormat("id-ID", {
														style: "currency",
														currency: "IDR",
												  }).format(anggotaDetail.penghasilan)
												: "-"}
										</p>
									</div>
								</div>
							</div>
						)}

						{activeTab === "mental" && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-gray-800 mb-4">
									Informasi Kesehatan Mental
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Status Mental
										</label>
										<div className="flex items-center gap-2">
											<span
												className={`inline-block w-3 h-3 rounded-full ${
													anggotaDetail?.statusMental === "Stabil"
														? "bg-green-500"
														: "bg-red-500"
												}`}></span>
											<p className="text-gray-800 font-semibold">
												{anggotaDetail?.statusMental || "-"}
											</p>
										</div>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Pengulangan Tes
										</label>
										<p className="text-gray-800 font-semibold">
											{anggotaDetail?.pengulangan || "0"} kali
										</p>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Tanggal Terakhir Tes
										</label>
										<p className="text-gray-800 font-semibold">
											{anggotaDetail?.tanggalTerakhir || "-"}
										</p>
									</div>
								</div>

								<div className="mt-6 p-4 rounded-lg border-l-4 border-[#70B748] bg-green-50">
									<h4 className="font-semibold text-gray-800 mb-2">
										Catatan Status Mental
									</h4>
									<p className="text-sm text-gray-600">
										{anggotaDetail?.statusMental === "Stabil"
											? "Kondisi kesehatan mental dalam keadaan baik dan stabil. Tidak memerlukan perhatian khusus saat ini."
											: "Memerlukan perhatian dan pemantauan lebih lanjut. Disarankan untuk konsultasi dengan tenaga kesehatan mental."}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex justify-between items-center">
					<div className="mt-4 text-gray-600 font-medium">
						<Link
							to={
								pathSegments[0] == "admin"
									? `/admin/responden`
									: `/admin-medis/responden`
							}
							className="hover:underline">
							Data RW
						</Link>{" "}
						/{" "}
						<Link
							to={
								pathSegments[0] == "admin"
									? `/admin/${currentSection}/${rwId}`
									: `/admin-medis/${currentSection}/${rwId}`
							}
							className="hover:underline">
							Data {rwId}
						</Link>{" "}
						/{" "}
						<Link
							to={
								pathSegments[0] == "admin"
									? `/admin/${currentSection}/${rwId}/${rtId}`
									: `/admin-medis/${currentSection}/${rwId}/${rtId}`
							}
							className="hover:underline">
							Data {rtId}
						</Link>{" "}
						/{" "}
						<Link
							to={
								pathSegments[0] == "admin"
									? `/admin/${currentSection}/${rwId}/${rtId}/${keluargaId}/${anggotaName}`
									: `/admin-medis/${currentSection}/${rwId}/${rtId}/${keluargaId}/${anggotaName}`
							}
							className="hover:underline">
							{anggotaDetail?.nama}
						</Link>
					</div>
					{pathSegments[0] !== "admin" && (
						<Link to={"/admin-medis/result"}>
							<div className="bg-[#439017] text-white p-3 rounded-md hover:bg-[#3a7a14] transition-colors">
								Lihat detail kuisioner
							</div>
						</Link>
					)}
				</div>
			</div>
		</>
	);
}
