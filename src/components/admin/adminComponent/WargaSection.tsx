import { Filter, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import MentalHealthChart from "../../MentalHealthChart";
import {
	adminMedisService,
	type RTSummary,
} from "../../../service/adminMedisService";
import {
	adminDesaService,
	type WargaResponse,
} from "../../../service/adminDesaService";
import type { AxiosError } from "axios";

export default function WargaSection({
	questionnaireId,
	rwId,
	rtId,
}: {
	questionnaireId: string;
	rwId?: string;
	rtId?: string;
}) {
	const [filterPopUp, setFilterPopUp] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [rwName, setRwName] = useState<string>("");
	const [rtName, setRtName] = useState<string>("");
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);
	const panel = useLocation().pathname.split("/")[1];
	const isAdminMedis = panel === "admin-medis";
	const isAdminDesa = panel === "admin";
	const [loading, setLoading] = useState(true);
	const [summaryData, setSummaryData] = useState<RTSummary>({
		summarize: {
			userCount: 0,
			submitCount: 0,
			stableMentalCount: 0,
			unStableMentalCount: 0,
			unStableMentalPercentage: 0,
		},
		users: [],
	});
	const popupRef = useRef<HTMLDivElement>(null);
	const [warga, setWarga] = useState<WargaResponse | null>(null);
	const [questionnaireName, setQuestionnaireName] = useState<string>("");

	useEffect(() => {
		if (isAdminMedis) {
			const fetchRWAndRTNames = async () => {
				try {
					const questionnaireSummary =
						await adminMedisService.getQuestionnaireSummary(questionnaireId);
					const rwData = questionnaireSummary.perRw.find((rw) => rw.rwId === rwId);
					setRwName(rwData ? `RW ${rwData.rwName}` : `RW ${rwId}`);

					const rwSummary = await adminMedisService.summaryRw(
						questionnaireId,
						pathSegments[3],
						"",
						""
					);
					const rtData = rwSummary.perRt.find((rt) => rt.rtId === rtId);
					setRtName(rtData ? `RT ${rtData.rtName}` : `RT ${rtId}`);
				} catch (err) {
					console.error("Error fetching RW/RT names:", err);
					setRwName(`RW ${rwId}`);
					setRtName(`RT ${rtId}`);
				}
			};
			fetchRWAndRTNames();
		}
	}, []);

	useEffect(() => {
		if (isAdminDesa && pathSegments[2] && pathSegments[3]) {
			const fetchRWAndRTNamesForAdminDesa = async () => {
				try {
					const rwResponse = await adminDesaService.getRT(pathSegments[2]);
					setRwName(`RW ${rwResponse.data.name}`);

					const rtResponse = await adminDesaService.getWarga(pathSegments[3]);
					setRtName(`RT ${rtResponse.data.name}`);
				} catch (err) {
					console.error("Error fetching RW/RT names for Admin Desa:", err);
					setRwName(`RW ${pathSegments[2]}`);
					setRtName(`RT ${pathSegments[3]}`);
				}
			};
			fetchRWAndRTNamesForAdminDesa();
		}
	}, []);

	useEffect(() => {
		if (pathSegments[2]) {
			const getQuestionnaireById = async () => {
				const result = await adminDesaService.getQuestionnaireById(pathSegments[2]);
				setQuestionnaireName(result.data.title);
			};
			getQuestionnaireById();
		}
	}, []);

	useEffect(() => {
		if (isAdminMedis) {
			const fetchRTSummary = async () => {
				try {
					setLoading(true);
					const data = await adminMedisService.summaryRt(
						questionnaireId,
						pathSegments[3],
						pathSegments[4],
						startDate,
						endDate
					);
					setSummaryData(data);
				} catch (err) {
					const error = err as AxiosError<{ message?: string }>;
					console.error("❌ Error fetching RT summary:", error);
				} finally {
					setLoading(false);
				}
			};
			fetchRTSummary();
		}
	}, []);

	useEffect(() => {
		if (isAdminDesa && pathSegments[3]) {
			const summaryWarga = async () => {
				try {
					setLoading(true);
					const response = await adminDesaService.getWarga(
						pathSegments[1] === "kelola-rw" ? pathSegments[3] : pathSegments[4]
					);
					setWarga(response);
				} catch (err) {
					console.error("Error fetching warga:", err);
				} finally {
					setLoading(false);
				}
			};
			summaryWarga();
		}
	}, []);

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
	}, []);

	const handleApplyFilter = () => {
		setFilterPopUp(false);
	};

	const handleClearFilter = () => {
		setStartDate("");
		setEndDate("");
		setFilterPopUp(false);
	};

	const renderBreadcrumb = () => {
		const basePath = isAdminMedis ? "/admin-medis" : "/admin";

		if (isAdminMedis) {
			const breadcrumbs = [
				{ label: "Daftar Kuisioner", path: `${basePath}/responden` },
				{ label: questionnaireName, path: null },
				{ label: "Data RW", path: `${basePath}/responden/${questionnaireId}` },
				{
					label: rwName || `RW ${rwId}`,
					path: `${basePath}/responden/${questionnaireId}/${rwId}`,
				},
				{ label: rtName || `RT ${rtId}`, path: null },
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
		} else {
			const breadcrumbs = [
				{ label: "Data RW", path: `${basePath}/kelola-rw` },
				{
					label: rwName || `Loading...`,
					path: `${basePath}/kelola-rw/${pathSegments[2]}`,
				},
				{ label: rtName || `Loading...`, path: null },
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
		}
	};

	return (
		<div className="space-y-6">
			{isAdminMedis && (
				<MentalHealthChart
					overallDepressionRate={summaryData.summarize.unStableMentalPercentage}
					title="Statistik Kesehatan Mental Warga"
					subtitle={`Persentase Kondisi Mental Warga di ${rwName || rwId} ${
						rtName || rtId
					}`}
				/>
			)}

			<div className="relative flex flex-col items-end bg-gray-100 rounded-xl p-6 shadow-sm gap-3">
				<div className="w-full flex justify-between items-center pb-3">
					<div className="flex flex-col space-y-1">{renderBreadcrumb()}</div>

					{isAdminMedis && (
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
					)}
				</div>

				{filterPopUp && isAdminMedis && (
					<div
						ref={popupRef}
						className="w-[300px] absolute top-20 right-6 bg-white shadow-2xl p-5 rounded-md z-10">
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
							<div className="col-span-1 font-semibold">No</div>
							<div className="col-span-3 font-semibold">Nama</div>
							{isAdminDesa && <div className="col-span-3 font-semibold">NIK</div>}
							<div
								className={`${
									isAdminMedis ? "col-span-5" : "col-span-5"
								} font-semibold`}>
								{isAdminDesa ? "Alamat" : "Terakhir Submit"}
							</div>
							{isAdminMedis && (
								<div className="col-span-3 font-semibold text-center">Aksi</div>
							)}
						</div>
					</div>

					<div className="bg-white divide-y divide-gray-200">
						{loading ? (
							<div className="py-8 text-center text-gray-500">
								<p>Memuat data...</p>
							</div>
						) : isAdminDesa ? (
							!warga || warga.data.userDetails.length === 0 ? (
								<div className="py-8 text-center text-gray-500">
									<p>Tidak ada data warga di RT ini.</p>
									<p className="text-sm mt-2">Periksa kembali RW dan RT yang dipilih.</p>
								</div>
							) : (
								warga.data.userDetails.map((userDetail, index) => (
									<div
										key={userDetail.id}
										className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
										<div className="col-span-1 text-gray-700">{index + 1}</div>
										<div className="col-span-3 text-gray-700 font-medium">
											{userDetail.user.fullname}
										</div>
										<div className="col-span-3 text-gray-700">{userDetail.nik}</div>
										<div className="col-span-5 text-gray-700">
											{rwName} {rtName}
										</div>
									</div>
								))
							)
						) : summaryData.users.length === 0 ? (
							<div className="py-8 text-center text-gray-500">
								<p>
									Tidak ada data warga di {rwName || rwId} {rtName || rtId}.
								</p>
								<p className="text-sm mt-2">Periksa kembali RW dan RT yang dipilih.</p>
							</div>
						) : (
							summaryData.users.map((data, index) => (
								<div
									key={data.userId || index}
									className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
									<div className="col-span-1 text-gray-700">{index + 1}</div>
									<div className="col-span-3 text-gray-700 font-medium">
										{data.fullname}
									</div>
									<div className="col-span-5 text-gray-700">
										{new Date(data.lastSubmissionDate).toLocaleDateString("id-ID", {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}{" "}
										{new Date(data.lastSubmissionDate).toLocaleTimeString("id-ID", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</div>
									<div className="col-span-3 text-center">
										<Link to={`/admin-medis/result/${data.userId}`}>
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
					<div className="flex items-center gap-4">
						{isAdminDesa && warga && (
							<div className="text-sm text-gray-500">
								Total: {warga.metadata.userCount} warga
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
