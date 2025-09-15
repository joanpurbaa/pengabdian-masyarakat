import { useState } from "react";
import { Link, useLocation } from "react-router";

export default function DetailKeluargaSection({
	rwId,
	rtId,
	keluargaId,
}: {
	rwId: string;
	rtId: string;
	keluargaId: string;
}) {
	const currentSection = useLocation().pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);

	const [keluargaData] = useState({
		id: keluargaId,
		kepalaKeluarga: "Asep Purnomo",
		tingkatDepresiKeluarga: 50,
		anggota: [
			{ id: "1", nama: "Asep Purnomo", tingkatDepresi: 10 },
			{ id: "2", nama: "Meilani Suciatri", tingkatDepresi: 25 },
			{ id: "3", nama: "Thomas Van Den Berg", tingkatDepresi: 90 },
		],
	});

	return (
		<>
			<div className="bg-[#70B748] rounded-xl p-6 text-white relative overflow-hidden">
				<h2 className="text-lg font-medium mb-2">
					Tingkat Depresi Keluarga {keluargaData.kepalaKeluarga}
				</h2>
				<div className="text-6xl font-bold mb-4">
					{keluargaData.tingkatDepresiKeluarga}%
				</div>

				<div className="absolute -right-10 -bottom-10">
					<img
						src="/berat.png"
						alt="Angry face"
						className="w-44 h-44 object-contain"
					/>
				</div>
			</div>

			<div className="bg-[#70B748] rounded-xl p-6 mt-4">
				<div className="bg-white rounded-lg overflow-hidden shadow-lg">
					<div className="bg-[#439017] text-white">
						<div className="grid grid-cols-12 text-sm sm:text-base py-4 px-6">
							<div className="col-span-6 font-semibold">Nama</div>
							<div className="col-span-3 text-center font-semibold">
								Tingkat Depresi
							</div>
							<div className="col-span-3 text-center font-semibold">Lihat</div>
						</div>
					</div>

					<div className="bg-white divide-y divide-gray-200">
						{keluargaData.anggota.map((anggota) => (
							<div
								key={anggota.id}
								className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
								<div className="col-span-6 text-gray-700 font-medium">
									{anggota.nama}
								</div>
								<div className="col-span-3 text-center text-gray-700 font-medium">
									<span
										className={`px-2 py-1 rounded-full ${
											anggota.tingkatDepresi >= 70
												? "bg-red-100 text-red-800"
												: anggota.tingkatDepresi >= 40
												? "bg-yellow-100 text-yellow-800"
												: "bg-green-100 text-green-800"
										}`}>
										{anggota.tingkatDepresi}%
									</span>
								</div>
								<div className="col-span-3 text-center">
									<Link
										to={
											pathSegments[0] == "admin"
												? `/admin/${currentSection}/${rwId}/${rtId}/${keluargaId}/${anggota.nama.replace(
														/\s+/g,"-"
												  )}-${anggota.id}`
												: `/admin-medis/${currentSection}/${rwId}/${rtId}/${keluargaId}/${anggota.nama.replace(
														/\s+/g,
														"-"
												  )}-${anggota.id}`
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
					</Link>
				</div>
			</div>
		</>
	);
}
