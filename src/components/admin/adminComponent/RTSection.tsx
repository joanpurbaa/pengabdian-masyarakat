import { useState } from "react";
import { Link, useLocation } from "react-router";

export default function RTSection({ rwId }: { rwId: string }) {
	const currentSection = useLocation().pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);

	const [rtData] = useState([
		{ id: "1", jumlahKeluarga: 10, tingkatDepresi: 50 },
		{ id: "2", jumlahKeluarga: 11, tingkatDepresi: 72 },
		{ id: "3", jumlahKeluarga: 8, tingkatDepresi: 45 },
		{ id: "4", jumlahKeluarga: 6, tingkatDepresi: 38 },
	]);

	const overallDepressionRate = 68;

	return (
		<>
			<div className="bg-gray-100 rounded-xl p-6 relative overflow-hidden shadow-sm">
				<div className="text-[#439017] text-6xl font-bold">
					{overallDepressionRate}%
					<p className="mt-2 text-lg">Warga Tidak Sehat Secara Mental Disemua RT</p>
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
							<div className="col-span-3 font-semibold">Nama RT</div>
							<div className="col-span-3 text-center font-semibold">Jumlah Warga</div>
							<div className="col-span-3 text-center font-semibold">
								Tingkat Depresi
							</div>
							<div className="col-span-3 text-center font-semibold">Lihat</div>
						</div>
					</div>

					<div className="bg-white divide-y divide-gray-200">
						{rtData.map((rt) => (
							<div
								key={rt.id}
								className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
								<div className="col-span-3 text-gray-700 font-medium">RT {rt.id}</div>
								<div className="col-span-3 text-center text-gray-700">
									{rt.jumlahKeluarga}
								</div>
								<div className="col-span-3 text-center text-gray-700 font-medium">
									<span
										className={`px-2 py-1 rounded-full ${
											rt.tingkatDepresi >= 70
												? "bg-red-100 text-red-800"
												: rt.tingkatDepresi >= 40
												? "bg-yellow-100 text-yellow-800"
												: "bg-green-100 text-green-800"
										}`}>
										{rt.tingkatDepresi}%
									</span>
								</div>
								<div className="col-span-3 text-center">
									<Link
										to={
											pathSegments[0] == "admin"
												? `/admin/${currentSection}/${rwId}/rt${rt.id}`
												: `/admin-medis/${currentSection}/${rwId}/rt${rt.id}`
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
					</Link>
				</div>
			</div>
		</>
	);
}
