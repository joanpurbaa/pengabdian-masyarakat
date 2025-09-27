import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import dataRW from "../data/data";
import MentalHealthChart from "../components/MentalHealthChart";

export default function HistorySection() {
	const [filterPopUp, setFilterPopUp] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const params = useParams();

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

	const getWargaHistory = () => {
		const wargaId = params.keluargaId?.split("-").pop();
		const rwId = params.rwId?.replace(/[^0-9]/g, "");
		const rtId = params.rtId?.replace(/[^0-9]/g, "");

		console.log("Debug params:", {
			wargaId,
			rwId,
			rtId,
			keluargaId: params.keluargaId,
		});

		const currentRW = dataRW.find((rw) => rw.id === rwId);
		if (!currentRW) {
			console.log(
				"RW not found, available RWs:",
				dataRW.map((rw) => rw.id)
			);
			return { warga: null, history: [] };
		}

		const currentRT = currentRW.rt.find((rt) => rt.id === rtId);
		if (!currentRT) {
			console.log(
				"RT not found, available RTs:",
				currentRW.rt.map((rt) => rt.id)
			);
			return { warga: null, history: [] };
		}

		const warga = currentRT.warga.find((w) => w.id === wargaId);
		if (!warga) {
			console.log(
				"Warga not found, available warga:",
				currentRT.warga.map((w) => ({ id: w.id, nama: w.nama }))
			);
			return { warga: null, history: [] };
		}

		const history = warga.history
			? warga.history.sort(
					(a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
			  )
			: [];

		return { warga, history };
	};

	const { warga, history } = getWargaHistory();

	const filteredHistory = history.filter((entry) => {
		const tanggal = new Date(entry.tanggal);
		const start = startDate ? new Date(startDate) : null;
		const end = endDate ? new Date(endDate) : null;

		if (start && end) {
			return tanggal >= start && tanggal <= end;
		} else if (start) {
			return tanggal >= start;
		} else if (end) {
			return tanggal <= end;
		}
		return true;
	});

	const totalFiltered = filteredHistory.length;
	const tidakStabilCount = filteredHistory.filter(
		(entry) => entry.statusMental === "Tidak Stabil"
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

	if (!warga) {
		return (
			<div className="bg-gray-100 rounded-xl p-6 text-center">
				<p className="text-gray-500">Data warga tidak ditemukan.</p>
				<Link
					to={
						pathSegments[0] === "admin"
							? "/admin/responden"
							: "/admin-medis/responden"
					}>
					<button className="mt-4 bg-[#70B748] text-white px-4 py-2 rounded-md">
						Kembali ke Data RW
					</button>
				</Link>
			</div>
		);
	}

	return (
		<>
			<div className="w-full">
				<div className="px-30 pt-10">
					<MentalHealthChart
						overallDepressionRate={overallDepressionRate}
						title={`Riwayat Kesehatan Mental - ${warga.nama}`}
						subtitle={`Persentase tingkat depresi dari ${filteredHistory.length} pengerjaan kuisioner`}
					/>
				</div>
				<div className="rounded-xl p-6 relative px-30">
					<div className="flex justify-between items-center pb-3">
						<div className="text-gray-600 font-medium">
							<Link
								to={
									pathSegments[0] === "admin"
										? "/admin/responden"
										: "/admin-medis/responden"
								}
								className="hover:underline">
								Data RW
							</Link>{" "}
							/{" "}
							<Link
								to={
									pathSegments[0] === "admin"
										? `/admin/responden/${params.rwId}`
										: `/admin-medis/responden/${params.rwId}`
								}
								className="hover:underline">
								Data {params.rwId?.toUpperCase()}
							</Link>{" "}
							/{" "}
							<Link
								to={
									pathSegments[0] === "admin"
										? `/admin/responden/${params.rwId}/${params.rtId}`
										: `/admin-medis/responden/${params.rwId}/${params.rtId}`
								}
								className="hover:underline">
								Data {params.rtId?.toUpperCase()}
							</Link>{" "}
							/ Riwayat {warga.nama}
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
								Filter berdasarkan tanggal pengerjaan kuisioner
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

					<div className="bg-white rounded-lg overflow-hidden shadow-sm">
						<div className="bg-[#70B748] text-white">
							<div className="grid grid-cols-12 text-sm sm:text-base py-4 px-6">
								<div className="col-span-3 font-semibold">Tanggal Pengerjaan</div>
								<div className="col-span-2 text-center font-semibold">Waktu</div>
								<div className="col-span-2 text-center font-semibold">Skor</div>
								<div className="col-span-2 text-center font-semibold">
									Status Mental
								</div>
								<div className="col-span-3 text-center font-semibold">Aksi</div>
							</div>
						</div>

						<div className="bg-white divide-y divide-gray-200">
							{filteredHistory.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									<p>Tidak ada riwayat pengerjaan yang sesuai dengan filter tanggal.</p>
									<p className="text-sm mt-2">
										Total {history.length} riwayat pengerjaan tersedia.
									</p>
								</div>
							) : (
								filteredHistory.map((entry) => (
									<div
										key={entry.id}
										className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
										<div className="col-span-3 text-gray-700 font-medium">
											{entry.tanggalDisplay}
										</div>
										<div className="col-span-2 text-center text-gray-700">
											{entry.waktuPengerjaan}
										</div>
										<div className="col-span-2 text-center text-gray-700 font-bold">
											{entry.skor}
										</div>
										<div className="col-span-2 text-center text-gray-700 font-medium">
											<span
												className={`px-2 py-1 rounded-full ${
													entry.statusMental === "Stabil"
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}>
												{entry.statusMental}
											</span>
										</div>
										<div className="col-span-3 text-center">
											<button className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors">
												Lihat Detail
											</button>
										</div>
									</div>
								))
							)}
						</div>
					</div>

					<div className="mt-4 flex justify-between items-center">
						{(startDate || endDate) && (
							<div className="text-sm text-gray-500">
								Menampilkan {filteredHistory.length} dari {history.length} riwayat
								pengerjaan
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
