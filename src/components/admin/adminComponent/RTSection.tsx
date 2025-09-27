import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import dataRW from "../../../data/data";
import { calculateRTStats, filterRTByDate } from "../../../utils/filterUtils";
import type { RTStatsType, RTType } from "../../../types/types";
import MentalHealthChart from "../../MentalHealthChart";

export default function RTSection({ rwId }: { rwId: string }) {
	const [filterPopUp, setFilterPopUp] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const currentSection = useLocation().pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);

	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				setFilterPopUp(false);
			}
		}
		if (filterPopUp) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [filterPopUp]);

	const currentRW = dataRW.find((rw) => rw.id === rwId.replace("rw", ""));

	const filteredRTData = currentRW
		? filterRTByDate(currentRW.rt, startDate, endDate)
		: [];
	const rtStats = filteredRTData.map(calculateRTStats);

	const allWarga = filteredRTData.flatMap((rt: RTType) => rt.warga);
	const totalWarga = allWarga.length;
	const tidakStabilCount = allWarga.filter(
		(warga: { statusMental: string }) => warga.statusMental === "Tidak Stabil"
	).length;
	const overallDepressionRate =
		totalWarga > 0 ? Math.round((tidakStabilCount / totalWarga) * 100) : 0;

	const handleApplyFilter = () => {
		setFilterPopUp(false);
	};

	const handleClearFilter = () => {
		setStartDate("");
		setEndDate("");
		setFilterPopUp(false);
	};

	return (
		<>
			<MentalHealthChart
				overallDepressionRate={overallDepressionRate}
				title="Statistik Kesehatan Mental RT"
				subtitle={`Persentase Kondisi Mental Warga di Semua RT ${rwId.toUpperCase()}`}
			/>
			<div className="bg-gray-100 rounded-xl p-6 shadow-sm relative">
				<div className="flex justify-between items-center pb-3">
					<div className="text-gray-600 font-medium">
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
							Data {rwId.toUpperCase()}
						</Link>
					</div>
					<div className="flex justify-end gap-2">
						{(startDate || endDate) && (
							<button
								onClick={handleClearFilter}
								className="cursor-pointer bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2 p-3 rounded-md transition-colors">
								<p className="font-medium">Clear Filter</p>
							</button>
						)}
						<button
							onClick={() => setFilterPopUp(!filterPopUp)}
							className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white flex items-center gap-2 p-3 rounded-md transition-colors">
							<p className="font-medium">Filter</p>
							<Filter />
						</button>
					</div>
				</div>

				{filterPopUp && (
					<div
						ref={popupRef}
						className="w-[300px] absolute top-20 right-6 bg-white shadow-2xl p-5 rounded-md z-10">
						<p className="font-semibold">
							Filter berdasarkan tanggal submit kuisioner warga
						</p>
						<ul className="mt-5 flex flex-col gap-5">
							<li className="flex flex-col gap-3">
								<label htmlFor="start">Dari Tanggal</label>
								<input
									className="border border-gray-400 p-2 rounded-md"
									type="date"
									id="start"
									value={startDate}
									onChange={(e) => {
										setStartDate(e.target.value);
										if (endDate && e.target.value > endDate) {
											setEndDate("");
										}
									}}
								/>
							</li>
							<li className="flex flex-col gap-3">
								<label htmlFor="end">Sampai Tanggal</label>
								<input
									className="border border-gray-400 p-2 rounded-md"
									type="date"
									id="end"
									value={endDate}
									min={startDate}
									onChange={(e) => setEndDate(e.target.value)}
								/>
							</li>
							<li className="flex gap-2">
								<button
									type="button"
									onClick={handleClearFilter}
									className="cursor-pointer flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold p-2 rounded-md transition-colors">
									Clear
								</button>
								<button
									type="button"
									onClick={handleApplyFilter}
									className="cursor-pointer flex-1 bg-[#70B748] hover:bg-[#5a9639] text-white font-semibold p-2 rounded-md transition-colors">
									Terapkan
								</button>
							</li>
						</ul>
					</div>
				)}

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
						{rtStats.length === 0 ? (
							<div className="py-8 text-center text-gray-500">
								<p>Tidak ada data RT yang sesuai dengan filter tanggal yang dipilih.</p>
								<p className="text-sm mt-2">
									RT hanya ditampilkan jika ada warga yang submit kuisioner dalam rentang
									tanggal tersebut.
								</p>
							</div>
						) : (
							rtStats.map((rt: RTStatsType) => (
								<div
									key={rt.id}
									className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
									<div className="col-span-3 text-gray-700 font-medium">{rt.nama}</div>
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
							))
						)}
					</div>
				</div>

				<div className="mt-4 flex justify-between items-center">
					{(startDate || endDate) && (
						<div className="text-sm text-gray-500">
							Menampilkan {rtStats.length} RT dengan warga yang submit kuisioner dalam
							periode ini
						</div>
					)}
				</div>
			</div>
		</>
	);
}
