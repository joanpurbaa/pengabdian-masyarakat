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

	const [keluargaData] = useState({
		id: keluargaId,
		kepalaKeluarga: "Asep Purnomo",
		anggota: [
			{
				id: "1",
				nama: "Asep Purnomo",
				tingkatDepresi: 10,
				statusPernikahan: "Menikah",
				pekerjaan: "PNS",
				penghasilan: "7.000.000",
				pendidikan: "SMA",
				jumlahAnak: 1,
			},
			{
				id: "2",
				nama: "Meilani Suciatri",
				tingkatDepresi: 50,
				statusPernikahan: "Menikah",
				pekerjaan: "PNS",
				penghasilan: "7.000.000",
				pendidikan: "SMA",
				jumlahAnak: 1,
			},
			{
				id: "3",
				nama: "Thomas Van Den Berg",
				tingkatDepresi: 78,
				statusPernikahan: "Belum menikah",
				pekerjaan: "Mahasiswa",
				penghasilan: "-",
				pendidikan: "SMA",
				jumlahAnak: "-",
			},
		],
	});

	const anggotaDetail = keluargaData.anggota.find((a) => a.id === anggotaId);

	return (
		<>
			<div className="bg-[#70B748] rounded-xl p-6 text-white relative overflow-hidden">
				<h2 className="text-lg font-medium mb-2">
					Tingkat Depresi {anggotaDetail?.nama}
				</h2>
				<div className="text-6xl font-bold mb-4">
					{anggotaDetail?.tingkatDepresi}%
				</div>

				<div className="absolute -right-10 -bottom-10">
					<img
						src="/berat.png"
						alt="Angry face"
						className="w-44 h-44 object-contain"
					/>
				</div>
			</div>

			<div className="flex flex-col bg-[#70B748] rounded-xl p-6 mt-4 gap-5">
				<div className="bg-white rounded-lg overflow-hidden shadow-lg">
					<div className="bg-[#439017] text-white">
						<div className="grid grid-cols-12 text-sm sm:text-base py-4 px-6">
							<div className="col-span-2 font-semibold">Nama</div>
							<div className="col-span-2 font-semibold">Status pernikahan</div>
							<div className="col-span-2 font-semibold">Pekerjaan</div>
							<div className="col-span-2 font-semibold">Penghasilan</div>
							<div className="col-span-2 font-semibold">Pendidikan</div>
							<div className="col-span-2 font-semibold">Jumlah anak</div>
						</div>
					</div>

					<div className="bg-white divide-y divide-gray-200">
						<div className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
							<div className="col-span-2 text-gray-700 font-bold">
								{anggotaDetail?.nama}
							</div>
							<div className="col-span-2 text-gray-700 font-medium">
								{anggotaDetail?.statusPernikahan}
							</div>
							<div className="col-span-2 text-gray-700 font-medium">
								{anggotaDetail?.pekerjaan}
							</div>
							<div className="col-span-2 text-gray-700 font-medium">
								{anggotaDetail?.penghasilan}
							</div>
							<div className="col-span-2 text-gray-700 font-medium">
								{anggotaDetail?.pendidikan}
							</div>
							<div className="col-span-2 text-gray-700 font-medium">
								{anggotaDetail?.jumlahAnak}
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-between items-center">
					<div className="mt-4 text-white font-medium">
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
									? `/admin/${currentSection}/${rwId}/${rtId}/${keluargaId}`
									: `/admin-medis/${currentSection}/${rwId}/${rtId}/${keluargaId}`
							}
							className="hover:underline">
							Keluarga {keluargaData.kepalaKeluarga}
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
							<div className="bg-[#439017] text-white p-3 rounded-md">
								Lihat detail kuisioner
							</div>
						</Link>
					)}
				</div>
			</div>
		</>
	);
}
