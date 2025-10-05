import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import dataRW from "../../../data/data";
import MentalHealthChart from "../../MentalHealthChart";

export default function WargaSection({
	rwId = "RW01",
	rtId = "RT01",
}: {
	rwId?: string;
	rtId?: string;
}) {
	const [filterPopUp, setFilterPopUp] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const currentSection = useLocation().pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const panel = useLocation().pathname.split("/")[1];

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

	const getWargaData = () => {
		const rwIdNum = rwId.replace(/[^0-9]/g, "");
		const rtIdNum = rtId.replace(/[^0-9]/g, "");

		const currentRW = dataRW.find((rw) => rw.id === rwIdNum);
		if (!currentRW) return [];

		const currentRT = currentRW.rt.find((rt) => rt.id === rtIdNum);
		if (!currentRT) return [];

		return currentRT.warga || [];
	};

	const keluargaData = getWargaData();

	const filteredData = keluargaData.filter((keluarga) => {
		const tanggalTerakhir = new Date(keluarga.tanggalTerakhir);
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;

		if (start && end) {
			return tanggalTerakhir >= start && tanggalTerakhir <= end;
		} else if (start) {
			return tanggalTerakhir >= start;
		} else if (end) {
			return tanggalTerakhir <= end;
		}
		return true;
	});

	const totalFiltered = filteredData.length;
	const tidakStabilCount = filteredData.filter(
		(keluarga) => keluarga.statusMental === "Tidak Stabil"
	).length;
	const overallDepressionRate =
		totalFiltered > 0 ? Math.round((tidakStabilCount / totalFiltered) * 100) : 0;

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
			<div className="space-y-6">
				<MentalHealthChart
					overallDepressionRate={overallDepressionRate}
					title="Statistik Kesehatan Mental Warga"
					subtitle={`Persentase Kondisi Mental Warga di ${rwId} ${rtId}`}
				/>
				<div className="relative flex flex-col items-end bg-gray-100 rounded-xl p-6 shadow-sm gap-3">
					<div className="w-full flex justify-between items-center pb-3">
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
						</div>
						<div className="flex gap-2">
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
							className="w-[300px] absolute top-20 bg-white shadow-2xl p-5 rounded-md z-10">
							<p className="font-semibold">
								Filter berdasarkan tanggal submit kuisioner
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
					<div className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
						<div className="bg-[#70B748] text-white">
							<div className="grid grid-cols-12 text-sm sm:text-base py-4 px-6">
								<div
									className={`${
										panel == "admin-medis" ? "col-span-3" : "col-span-4"
									} font-semibold`}>
									Nama
								</div>
								<div
									className={`${
										panel == "admin-medis" ? "col-span-3" : "col-span-4"
									} font-semibold`}>
									Terakhir Kali submit
								</div>
								<div
									className={`${
										panel == "admin-medis" ? "col-span-3" : "col-span-4"
									} font-semibold`}>
									Mental
								</div>
								{panel == "admin-medis" && (
									<div className="col-span-3 font-semibold text-center">Aksi</div>
								)}
							</div>
						</div>

						<div className="bg-white divide-y divide-gray-200">
							{filteredData.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									{keluargaData.length === 0 ? (
										<>
											<p>
												Tidak ada data warga di {rwId} {rtId}.
											</p>
											<p className="text-sm mt-2">
												Periksa kembali RW dan RT yang dipilih.
											</p>
										</>
									) : (
										<>
											<p>Tidak ada data yang sesuai dengan filter tanggal yang dipilih.</p>
											<p className="text-sm mt-2">
												Total {keluargaData.length} warga tersedia di {rwId} {rtId}.
											</p>
										</>
									)}
								</div>
							) : (
								filteredData.map((keluarga) => (
									<div
										key={keluarga.id}
										className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
										<div className={`${panel == "admin-medis" ? 'col-span-3' : 'col-span-4'} text-gray-700 font-medium`}>
											{keluarga.nama}
										</div>
										<div className={`${panel == "admin-medis" ? 'col-span-3' : 'col-span-4'} text-gray-700`}>
											{keluarga.tanggalDisplay}
										</div>
										<div className={`${panel == "admin-medis" ? 'col-span-3' : 'col-span-4'} font-medium`}>
											<span
												className={`px-2 py-1 rounded-full ${
													keluarga.statusMental === "Stabil"
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}>
												{keluarga.statusMental}
											</span>
										</div>
										{panel == "admin-medis" && (
											<div className="col-span-3 text-center">
												<Link
													to={
														pathSegments[0] == "admin"
															? `/admin/responden/${rwId}/${rtId}/${keluarga.nama.replace(
																	/\s+/g,
																	"-"
															  )}-${keluarga.id}/history`
															: `/admin-medis/responden/${rwId}/${rtId}/${keluarga.nama.replace(
																	/\s+/g,
																	"-"
															  )}-${keluarga.id}/history`
													}>
													<button className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors">
														Lihat Riwayat
													</button>
												</Link>
											</div>
										)}
									</div>
								))
							)}
						</div>
					</div>

					<div className="w-full flex justify-between items-center">
						<div className="flex items-center gap-4">
							{(startDate || endDate) && (
								<div className="text-sm text-gray-500">
									Menampilkan {filteredData.length} dari {keluargaData.length} warga
								</div>
							)}
							{pathSegments[0] !== "admin" && (
								<Link to={"/admin-medis/result"}>
									<div className="bg-[#439017] text-white p-3 rounded-md">
										Lihat detail kuisioner
									</div>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
