import { useState } from "react";
import { Link, useLocation } from "react-router";

export default function KeluargaSection({
	rwId,
	rtId,
}: {
	rwId: string;
	rtId: string;
}) {
	const location = useLocation();
	const currentSection = location.pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);

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
		},
	]);

	const overallDepressionRate = 60;

	return (
		<>
			<div className="space-y-6">
				<div className="bg-gray-100 rounded-xl p-6 text-white relative overflow-hidden shadow-sm">
					<div className="text-[#439017] text-6xl font-bold">
						{overallDepressionRate}%
						<p className="mt-2 text-lg">Warga Tidak Sehat Secara Mental</p>
					</div>

					<div className="absolute -right-10 -bottom-10">
						<img
							src="/berat.png"
							alt="Angry face"
							className="w-44 h-44 object-contain"
						/>
					</div>
				</div>
				<div className="bg-gray-100 rounded-xl p-6 shadow-sm">
					<div className="bg-white rounded-lg overflow-hidden shadow-lg">
						<div className="bg-[#70B748] text-white">
							<div className="grid grid-cols-12 text-sm sm:text-base py-4 px-6">
								<div className="col-span-2 font-semibold">Nama</div>
								<div className="col-span-2 font-semibold">NIK</div>
								<div className="col-span-1 font-semibold">Pernikahan</div>{" "}
								<div className="col-span-2 font-semibold">Kerja</div>{" "}
								<div className="col-span-1 font-semibold">Anak</div>{" "}
								<div className="col-span-1 font-semibold">Ulang</div>{" "}
								<div className="col-span-1 font-semibold">Terakhir</div>{" "}
								<div className="col-span-1 font-semibold">Mental</div>{" "}
								<div className="col-span-1 font-semibold text-center">Aksi</div>{" "}
							</div>
						</div>

						<div className="bg-white divide-y divide-gray-200">
							{keluargaData.map((keluarga) => (
								<div
									key={keluarga.id}
									className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
									<div className="col-span-2 text-gray-700 font-medium">
										{keluarga.nama}
									</div>
									<div className="col-span-2 text-gray-700">{keluarga.nik}</div>
									<div className="col-span-1 text-gray-700">
										{keluarga.statusPernikahan}
									</div>
									<div className="col-span-2 text-gray-700">{keluarga.pekerjaan}</div>
									<div className="col-span-1 text-gray-700">{keluarga.jumlahAnak}</div>
									<div className="col-span-1 text-gray-700">{keluarga.pengulangan}</div>
									<div className="col-span-1 text-gray-700">
										{keluarga.tanggalTerakhir}
									</div>
									<div className="col-span-1 font-medium">
										<span
											className={`px-2 py-1 rounded-full ${
												keluarga.statusMental === "Stabil"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}>
											{keluarga.statusMental}
										</span>
									</div>
									<div className="col-span-1 text-center">
										<Link
											to={
												pathSegments[0] === "admin"
													? `/admin/${currentSection}/${rwId}/${rtId}/keluarga${keluarga.id}`
													: `/admin-medis/${currentSection}/${rwId}/${rtId}/keluarga${keluarga.id}`
											}>
											<button className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors">
												Lihat
											</button>
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>

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
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
