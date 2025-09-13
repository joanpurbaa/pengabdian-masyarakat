import { useState } from "react";
import { Link } from "react-router";

export default function KeluargaSection({
	rwId,
	rtId,
}: {
	rwId: string;
	rtId: string;
}) {
	const [keluargaData] = useState([
		{
			id: "1",
			kepalaKeluarga: "Budi Santoso",
			jumlahAnggota: 4,
			tingkatDepresi: 45,
		},
		{
			id: "2",
			kepalaKeluarga: "Siti Aminah",
			jumlahAnggota: 5,
			tingkatDepresi: 72,
		},
		{
			id: "3",
			kepalaKeluarga: "Ahmad Wijaya",
			jumlahAnggota: 3,
			tingkatDepresi: 38,
		},
		{
			id: "4",
			kepalaKeluarga: "Rini Susanti",
			jumlahAnggota: 6,
			tingkatDepresi: 85,
		},
	]);

	const overallDepressionRate = 60;

	return (
		<>
			<div className="bg-[#70B748] rounded-xl p-6 text-white relative overflow-hidden">
				<h2 className="text-lg font-medium mb-2">Tingkat Depresi RT {rtId}</h2>
				<div className="text-6xl font-bold mb-4">{overallDepressionRate}%</div>

				<div className="absolute -right-10 -bottom-10">
					<img
						src="/berat.png"
						alt="Angry face"
						className="w-44 h-44 object-contain"
					/>
				</div>
			</div>

			<div className="bg-[#70B748] rounded-xl p-6">
				<div className="bg-white rounded-lg overflow-hidden shadow-lg">
					<div className="bg-[#439017] text-white">
						<div className="grid grid-cols-12 text-sm sm:text-base py-4 px-6">
							<div className="col-span-4 font-semibold">Kepala Keluarga</div>
							<div className="col-span-2 text-center font-semibold">Jumlah</div>
							<div className="col-span-2 text-center font-semibold">
								Tingkat Depresi
							</div>
							<div className="col-span-4 text-center font-semibold">
								Lihat Keluarga
							</div>
						</div>
					</div>

					<div className="bg-white divide-y divide-gray-200">
						{keluargaData.map((keluarga) => (
							<div
								key={keluarga.id}
								className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
								<div className="col-span-4 text-gray-700 font-bod">
									{keluarga.kepalaKeluarga}
								</div>
								<div className="col-span-2 text-center text-gray-700">
									{keluarga.jumlahAnggota}
								</div>
								<div className="col-span-2 text-center text-gray-700 font-medium">
									<span
										className={`px-2 py-1 rounded-full ${
											keluarga.tingkatDepresi >= 70
												? "bg-red-100 text-red-800"
												: keluarga.tingkatDepresi >= 40
												? "bg-yellow-100 text-yellow-800"
												: "bg-green-100 text-green-800"
										}`}>
										{keluarga.tingkatDepresi}%
									</span>
								</div>
								<div className="col-span-4 text-center">
									<Link to={`/admin/${rwId}/${rtId}/keluarga${keluarga.id}`}>
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
					<Link to="/admin" className="hover:underline">
						Data RW
					</Link>{" "}
					/
					<Link to={`/admin/${rwId}`} className="hover:underline">
						{" "}
						Data {rwId}
					</Link>{" "}
					/ Data {rtId}
				</div>
			</div>
		</>
	);
}
