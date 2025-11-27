import { Filter, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import MentalHealthChart from "../../MentalHealthChart";
import {
	adminMedisService,
	type RWSummary,
	type RTData,
} from "../../../service/adminMedisService";
import { adminDesaService } from "../../../service/adminDesaService";
import type { AxiosError } from "axios";

interface RTSectionProps {
	questionnaireId: string;
	rwId: string;
}

export default function RTSection({ questionnaireId, rwId }: RTSectionProps) {
	const [filterPopUp, setFilterPopUp] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [summaryData, setSummaryData] = useState<RWSummary | null>(null);
	const [rwName, setRwName] = useState<string>("");
	const [questionnaireName, setQuestionnaireName] = useState<string>("");

	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchRWSummary();
		fetchRWName();
	}, []);

	useEffect(() => {
		if (pathSegments[2]) {
			fetchQuestionnaireName();
		}
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				setFilterPopUp(false);
			}
		};

		if (filterPopUp) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const fetchQuestionnaireName = async () => {
		const result = await adminDesaService.getQuestionnaireById(pathSegments[2]);
		setQuestionnaireName(result.data.title);
	};

	const fetchRWName = async () => {
		try {
			const questionnaireSummary = await adminMedisService.getQuestionnaireSummary(
				questionnaireId
			);
			const rwData = questionnaireSummary.perRw.find((rw) => rw.rwId === rwId);
			setRwName(rwData ? `RW ${rwData.rwName}` : `RW ${rwId}`);
		} catch (err) {
			console.error("Error fetching RW name:", err);
			setRwName(`RW ${rwId}`);
		}
	};

	const fetchRWSummary = async () => {
		try {
			setLoading(true);
			setError("");

			const data = await adminMedisService.summaryRw(
				questionnaireId,
				rwId,
				startDate,
				endDate
			);

			setSummaryData(data);
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			console.error("❌ Error fetching RW summary:", error);
			setError(error.response?.data?.message || "Gagal memuat data RT");
		} finally {
			setLoading(false);
		}
	};

	const handleApplyFilter = () => {
		setFilterPopUp(false);
	};

	const handleClearFilter = () => {
		setStartDate("");
		setEndDate("");
		setFilterPopUp(false);
	};

	const getMentalHealthStatus = (percentage: number) => {
		if (percentage >= 70) {
			return { color: "bg-red-100 text-red-800", label: "Tinggi" };
		}
		if (percentage >= 40) {
			return { color: "bg-yellow-100 text-yellow-800", label: "Sedang" };
		}
		return { color: "bg-green-100 text-green-800", label: "Rendah" };
	};

	const renderBreadcrumb = () => {
		const isAdminMedis = pathSegments[0] === "admin-medis";
		const basePath = isAdminMedis ? "/admin-medis" : "/admin";

		const breadcrumbs = [
			{
				label: "Daftar Kuisioner",
				path: `${basePath}/responden`,
			},
			{
				label: questionnaireName,
				path: null,
			},
			{
				label: `Data RW`,
				path: `${basePath}/responden/${questionnaireId}`,
			},
			{
				label: rwName,
				path: null,
			},
		];

		return (
			<nav className="flex items-center space-x-2 text-sm text-gray-600">
				{breadcrumbs.map((breadcrumb, index) => (
					<div key={index} className="flex items-center space-x-2">
						{breadcrumb.path ? (
							<Link
								to={breadcrumb.path}
								className="hover:text-[#70B748] hover:underline transition-colors">
								{breadcrumb.label}
							</Link>
						) : (
							<span className="text-gray-800 font-medium">{breadcrumb.label}</span>
						)}
						{index < breadcrumbs.length - 1 && (
							<ChevronRight className="w-4 h-4 text-gray-400" />
						)}
					</div>
				))}
			</nav>
		);
	};

	const renderFilterPopup = () => (
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
	);

	const renderTableHeader = () => (
		<div className="bg-[#70B748] text-white">
			<div className="grid grid-cols-12 text-sm sm:text-base py-4 px-6">
				<div className="col-span-3 font-semibold">Nama RT</div>
				<div className="col-span-2 text-center font-semibold">Total Warga</div>
				<div className="col-span-2 text-center font-semibold">Submit Kuisioner</div>
				<div className="col-span-2 text-center font-semibold">Gangguan Mental</div>
				<div className="col-span-3 text-center font-semibold">Lihat</div>
			</div>
		</div>
	);

	const renderTableRow = (rt: RTData) => {
		const status = getMentalHealthStatus(rt.unStableMentalPercentage);
		const basePath = pathSegments[0] === "admin" ? "/admin" : "/admin-medis";

		return (
			<div
				key={rt.rtId}
				className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
				<div className="col-span-3 text-gray-700 font-medium">RT {rt.rtName}</div>
				<div className="col-span-2 text-center text-gray-700">{rt.userCount}</div>
				<div className="col-span-2 text-center text-gray-700">{rt.submitCount}</div>
				<div className="col-span-2 text-center text-gray-700 font-medium">
					<span className={`px-2 py-1 rounded-full ${status.color}`}>
						{rt.unStableMentalPercentage}%
					</span>
				</div>
				<div className="col-span-3 text-center">
					<Link to={`${basePath}/responden/${questionnaireId}/${rwId}/${rt.rtId}`}>
						<button className="cursor-pointer bg-[#70B748] hover:bg-[#5a9639] text-white px-4 py-2 rounded-md font-medium min-w-[80px] transition-colors">
							Lihat
						</button>
					</Link>
				</div>
			</div>
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B748]"></div>
				<p className="ml-3 text-gray-600">Memuat data RT...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="text-center text-red-600">
					<p className="text-lg font-medium">{error}</p>
					<button
						onClick={fetchRWSummary}
						className="mt-4 bg-[#70B748] text-white px-4 py-2 rounded-md hover:bg-[#5E9B3A] transition-colors">
						Coba Lagi
					</button>
				</div>
			</div>
		);
	}

	if (!summaryData) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6 text-center">
				<p className="text-gray-500">Tidak ada data yang tersedia</p>
			</div>
		);
	}

	const filteredRTData = summaryData.perRt || [];

	return (
		<>
			<MentalHealthChart
				overallDepressionRate={summaryData.summarize.unStableMentalPercentage}
				title={`Statistik Kesehatan Mental RT - ${rwName}`}
				subtitle={`Persentase Kondisi Mental Warga di Semua RT - ${rwName}`}
			/>

			<div className="bg-gray-100 rounded-xl p-6 shadow-sm relative">
				<div className="flex justify-between items-center pb-3">
					<div className="flex flex-col space-y-1">{renderBreadcrumb()}</div>

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

				{filterPopUp && renderFilterPopup()}

				<div className="bg-white rounded-lg overflow-hidden shadow-lg">
					{renderTableHeader()}

					<div className="bg-white divide-y divide-gray-200">
						{filteredRTData.length === 0 ? (
							<div className="py-8 text-center text-gray-500">
								<p>Tidak ada data RT yang sesuai dengan filter yang dipilih.</p>
								<p className="text-sm mt-2">
									Data RT akan muncul ketika ada warga yang mengisi kuisioner.
								</p>
							</div>
						) : (
							filteredRTData.map((rt: RTData) => renderTableRow(rt))
						)}
					</div>
				</div>
			</div>
		</>
	);
}
