import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

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

	const [keluargaData] = useState([
		{
			id: "1",
			nama: "Budi Santoso",
			tanggalTerakhir: "2025-09-10",
			tanggalDisplay: "10 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "2",
			nama: "Siti Aminah",
			tanggalTerakhir: "2025-09-11",
			tanggalDisplay: "11 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "3",
			nama: "Ahmad Wijaya",
			tanggalTerakhir: "2025-09-12",
			tanggalDisplay: "12 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "4",
			nama: "Rini Susanti",
			tanggalTerakhir: "2025-09-14",
			tanggalDisplay: "14 September 2025",
			statusMental: "Tidak Stabil",
		},
		{
			id: "5",
			nama: "Dewi Lestari",
			tanggalTerakhir: "2025-09-15",
			tanggalDisplay: "15 September 2025",
			statusMental: "Tidak Stabil",
		},
		{
			id: "6",
			nama: "Joko Prasetyo",
			tanggalTerakhir: "2025-09-13",
			tanggalDisplay: "13 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "7",
			nama: "Maya Sari",
			tanggalTerakhir: "2025-09-12",
			tanggalDisplay: "12 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "8",
			nama: "Rahmat Hidayat",
			tanggalTerakhir: "2025-09-10",
			tanggalDisplay: "10 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "9",
			nama: "Fitri Handayani",
			tanggalTerakhir: "2025-09-09",
			tanggalDisplay: "9 September 2025",
			statusMental: "Tidak Stabil",
		},
		{
			id: "10",
			nama: "Andi Saputra",
			tanggalTerakhir: "2025-09-08",
			tanggalDisplay: "8 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "11",
			nama: "Nur Aisyah",
			tanggalTerakhir: "2025-09-07",
			tanggalDisplay: "7 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "12",
			nama: "Eko Setiawan",
			tanggalTerakhir: "2025-09-06",
			tanggalDisplay: "6 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "13",
			nama: "Lina Marlina",
			tanggalTerakhir: "2025-09-05",
			tanggalDisplay: "5 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "14",
			nama: "Agus Kurniawan",
			tanggalTerakhir: "2025-09-04",
			tanggalDisplay: "4 September 2025",
			statusMental: "Tidak Stabil",
		},
		{
			id: "15",
			nama: "Rosa Melati",
			tanggalTerakhir: "2025-09-03",
			tanggalDisplay: "3 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "16",
			nama: "Hendra Gunawan",
			tanggalTerakhir: "2025-09-02",
			tanggalDisplay: "2 September 2025",
			statusMental: "Tidak Stabil",
		},
		{
			id: "17",
			nama: "Yuni Kartika",
			tanggalTerakhir: "2025-09-01",
			tanggalDisplay: "1 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "18",
			nama: "Doni Pratama",
			tanggalTerakhir: "2025-09-16",
			tanggalDisplay: "16 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "19",
			nama: "Sari Indah",
			tanggalTerakhir: "2025-09-17",
			tanggalDisplay: "17 September 2025",
			statusMental: "Stabil",
		},
		{
			id: "20",
			nama: "Bayu Nugroho",
			tanggalTerakhir: "2025-09-11",
			tanggalDisplay: "11 September 2025",
			statusMental: "Stabil",
		},
	]);

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
				<div className="bg-gray-100 rounded-xl p-6 relative overflow-hidden shadow-sm">
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
				<div className="relative flex flex-col items-end bg-gray-100 rounded-xl p-6 shadow-sm gap-3">
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
					{filterPopUp && (
						<div
							ref={popupRef}
							className="w-[300px] absolute top-20 bg-white shadow-2xl p-5 rounded-md z-10">
							<p className="font-semibold">Filter periode tanggal</p>
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
								<div className="col-span-3 font-semibold">Nama</div>
								<div className="col-span-3 font-semibold">Terakhir Kali submit</div>
								<div className="col-span-3 font-semibold">Mental</div>
								<div className="col-span-3 font-semibold text-center">Aksi</div>
							</div>
						</div>

						<div className="bg-white divide-y divide-gray-200">
							{filteredData.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									<p>Tidak ada data yang sesuai dengan filter tanggal yang dipilih.</p>
								</div>
							) : (
								filteredData.map((keluarga) => (
									<div
										key={keluarga.id}
										className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
										<div className="col-span-3 text-gray-700 font-medium">
											{keluarga.nama}
										</div>
										<div className="col-span-3 text-gray-700">
											{keluarga.tanggalDisplay}
										</div>
										<div className="col-span-3 font-medium">
											<span
												className={`px-2 py-1 rounded-full ${
													keluarga.statusMental === "Stabil"
														? "bg-green-100 text-green-800"
														: "bg-yellow-100 text-yellow-800"
												}`}>
												{keluarga.statusMental}
											</span>
										</div>
										<div className="col-span-3 text-center">
											<Link
												to={
													pathSegments[0] == "admin"
														? `/admin/${currentSection}/${rwId}/${rtId}/${keluarga.nama.replace(
																/\s+/g,
																"-"
														  )}-${keluarga.id}`
														: `/admin-medis/${currentSection}/${rwId}/${rtId}/${keluarga.nama.replace(
																/\s+/g,
																"-"
														  )}-${keluarga.id}`
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

					<div className="w-full flex justify-between items-center">
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
			</div>
		</>
	);
}
