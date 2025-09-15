import { useState } from "react";
import { Link, useLocation } from "react-router";

export default function RWSection() {
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);

	const [rwData] = useState([
		{ id: "1", jumlahRT: 2, tingkatDepresi: 68 },
		{ id: "2", jumlahRT: 2, tingkatDepresi: 30 },
		{ id: "3", jumlahRT: 2, tingkatDepresi: 98 },
		{ id: "4", jumlahRT: 2, tingkatDepresi: 17 },
		{ id: "5", jumlahRT: 2, tingkatDepresi: 45 },
	]);

	const overallDepressionRate = 75;

	return (
		<>
			<div className="bg-[#70B748] rounded-xl p-6 text-white relative overflow-hidden">
				<h2 className="text-lg font-medium mb-2">Tingkat Depresi Disemua RW</h2>
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
							<div className="col-span-3 font-semibold">Nama RW</div>
							<div className="col-span-3 text-center font-semibold">Jumlah RT</div>
							<div className="col-span-3 text-center font-semibold">
								Tingkat Depresi
							</div>
							<div className="col-span-3 text-center font-semibold">Lihat</div>
						</div>
					</div>

					<div className="bg-white divide-y divide-gray-200">
						{rwData.map((rw) => (
							<div
								key={rw.id}
								className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
								<div className="col-span-3 text-gray-700 font-medium">RW {rw.id}</div>
								<div className="col-span-3 text-center text-gray-700">
									{rw.jumlahRT}
								</div>
								<div className="col-span-3 text-center text-gray-700 font-medium">
									<div className="col-span-2 text-center text-gray-700 font-medium">
										<span
											className={`px-2 py-1 rounded-full ${
												rw.tingkatDepresi >= 70
													? "bg-red-100 text-red-800"
													: rw.tingkatDepresi >= 40
													? "bg-yellow-100 text-yellow-800"
													: "bg-green-100 text-green-800"
											}`}>
											{rw.tingkatDepresi}%
										</span>
									</div>
								</div>
								<div className="col-span-3 text-center">
									<Link
										to={
											pathSegments[0] == "admin"
												? `/admin/responden/rw${rw.id}`
												: `/admin-medis/responden/rw${rw.id}`
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
				</div>
			</div>
		</>
	);
}
