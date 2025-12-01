import { useNavigate } from "react-router";
import { useQuestionnaire } from "../hooks/useQuestionnaire";
import { useAuth } from "../context/AuthContext";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { questionnaireService } from "../service/questionnaireService";

export default function Home() {
	const navigate = useNavigate();
	const { questionnaires, loading, error, refetch } = useQuestionnaire();
	const { user, logout } = useAuth();
	const [history, setHistory] = useState([]);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	// Filter state untuk history
	const [selectedQuestionnaireFilter, setSelectedQuestionnaireFilter] =
		useState("all");

	// Modal states (tetap ada untuk keperluan lain)
	const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalHistory, setModalHistory] = useState([]);
	const [modalLoading, setModalLoading] = useState(false);

	const data = questionnaireService.getAllQuestionnaires();

	useEffect(() => {
		if (error && error.includes("Gagal memuat kuisioner")) {
			const timer = setTimeout(() => {
				refetch();
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [error, refetch]);

	// Fetch history untuk modal (masih ada untuk keperluan lain)
	useEffect(() => {
		if (isModalOpen && selectedQuestionnaire?.id) {
			fetchModalHistory();
		}
	}, [isModalOpen, selectedQuestionnaire?.id]);

	const fetchModalHistory = async () => {
		setModalLoading(true);
		try {
			const response = await questionnaireService.summarizeMe(
				selectedQuestionnaire?.id
			);
			setModalHistory(response.data.submissions || []);
		} catch (error) {
			console.error("Error fetching history:", error);
			setModalHistory([]);
		} finally {
			setModalLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/masuk");
	};

	const handleStartQuiz = (quizId: string) => {
		navigate(`/quiz/${quizId}`);
	};

	const handleHistoryQuiz = (quizId: string) => {
		navigate(`/result/${quizId}`);
	};

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			handleCloseModal();
		}
	};

	const handleStartQuizFromModal = () => {
		handleStartQuiz(selectedQuestionnaire.id);
		handleCloseModal();
	};

	const handleViewHistoryFromModal = (submissionId: string) => {
		handleHistoryQuiz(submissionId);
		handleCloseModal();
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedQuestionnaire(null);
		setModalHistory([]);
	};

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token && user) {
			logout();
		}
	}, [user, logout]);

	useEffect(() => {
		const fetchHistory = async () => {
			const result = await questionnaireService.getHistory();
			setHistory(result.data);
		};

		fetchHistory();
	}, []);

	const publishedQuestionnaires = questionnaires.filter(
		(quiz) => quiz.status === "publish"
	);

	// Filter history berdasarkan kuisioner yang dipilih
	const filteredHistory =
		selectedQuestionnaireFilter === "all"
			? history
			: history.filter(
					(item) => item.questionnaire.id === selectedQuestionnaireFilter
			  );

	const handleDateFilter = () => {
		fetchModalHistory(startDate, endDate);
	};

	// Fungsi untuk reset filter tanggal
	const handleResetDateFilter = () => {
		setStartDate("");
		setEndDate("");
		fetchModalHistory(); // Panggil tanpa parameter untuk reset
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<Loader2 className="animate-spin text-[#70B748]" size={32} />
				<span className="ml-2 text-gray-600">Memuat kuisioner...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-4">{error}</p>
					<div className="space-y-2">
						<button
							onClick={refetch}
							className="bg-[#70B748] text-white px-4 py-2 rounded-md block w-full">
							Coba Lagi
						</button>
						<button
							onClick={handleLogout}
							className="bg-gray-500 text-white px-4 py-2 rounded-md block w-full">
							Login Ulang
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<header className="w-full bg-[#70B748] flex justify-between items-center py-5 px-4 sm:px-8 lg:px-52">
				<div className="flex items-center gap-3">
					<img className="w-12 sm:w-20" src="/icon.png" alt="Desa Cibiru Wetan" />
					<h1 className="text-lg sm:text-2xl font-bold text-white">
						Desa Cibiru Wetan
					</h1>
				</div>
				<div className="flex items-center gap-4">
					<button
						onClick={handleLogout}
						className="bg-green-800 text-white font-medium rounded-md px-3 py-2 text-sm sm:text-base">
						Keluar
					</button>
				</div>
			</header>

			<main className="w-full px-4 sm:px-8 lg:px-52 py-10">
				<section className="mt-10 bg-gray-100 p-6 sm:p-10 rounded-md shadow-sm">
					<h2 className="text-xl sm:text-2xl font-bold">
						Selamat datang {user?.fullname || "User"} 👋
					</h2>
					<p className="mt-2 text-sm sm:text-base">Ayo kerjakan kuisioner mu!</p>
					{publishedQuestionnaires.length === 0 ? (
						<div className="mt-5 text-center py-8">
							<p className="text-gray-600">
								{questionnaires.length === 0
									? "Tidak ada kuisioner tersedia saat ini."
									: "Tidak ada kuisioner yang dipublikasikan."}
							</p>
						</div>
					) : (
						<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							{publishedQuestionnaires.map((quiz) => (
								<div
									key={quiz.id}
									className="flex flex-col items-start bg-[#70B748] p-4 sm:p-5 rounded-md">
									<h3 className="text-lg sm:text-xl text-white font-semibold">
										{quiz.title}
									</h3>
									<p className="mt-2 text-white text-sm sm:text-base">
										{quiz.description}
									</p>
									<button
										onClick={() => handleStartQuiz(quiz.id)}
										className="mt-10 w-full bg-white text-[#70B748] font-semibold rounded-md px-3 py-2 text-sm sm:text-base hover:bg-gray-100 transition-colors">
										Kerjakan
									</button>
								</div>
							))}
						</div>
					)}
				</section>

				<section className="mt-10 bg-gray-100 p-6 sm:p-10 rounded-md shadow-sm">
					<div className="flex justify-between items-start">
						<div>
							<h2 className="text-xl sm:text-2xl font-bold">Riwayat Pengerjaan</h2>
							<p className="mt-2 text-sm sm:text-base">
								Data kuisioner yang sudah kamu kerjakan
							</p>
						</div>

						{/* Filter Dropdown */}
						<div>
							<label
								htmlFor="questionnaire-filter"
								className="block text-sm font-medium text-gray-700 mb-2">
								Filter berdasarkan kuisioner:
							</label>
							<select
								id="questionnaire-filter"
								value={selectedQuestionnaireFilter}
								onChange={(e) => setSelectedQuestionnaireFilter(e.target.value)}
								className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748] focus:border-transparent bg-white text-gray-700">
								<option value="all">Semua Kuisioner</option>
								{questionnaires.map((quiz) => (
									<option key={quiz.id} value={quiz.id}>
										{quiz.title}
									</option>
								))}
							</select>
						</div>
					</div>

					{modalLoading ? (
						<div className="mt-5 flex items-center justify-center py-12">
							<Loader2 className="animate-spin text-[#70B748] mr-2" size={24} />
							<span className="text-gray-600">Memuat riwayat...</span>
						</div>
					) : filteredHistory.length === 0 ? (
						<div className="mt-5 bg-gray-50 rounded-lg py-12 text-center">
							<p className="text-gray-500">
								{selectedQuestionnaireFilter === "all"
									? "Anda belum pernah mengerjakan kuisioner apapun."
									: "Anda belum pernah mengerjakan kuisioner ini."}
							</p>
							<p className="text-gray-400 text-sm mt-2">
								Mulai kerjakan sekarang untuk melihat riwayat Anda!
							</p>
						</div>
					) : (
						<div className="mt-5 bg-white rounded-lg overflow-hidden border border-gray-200">
							{/* Table Header */}
							<div className="bg-[#70B748] text-white">
								<div className="grid grid-cols-12 text-sm py-3 px-4">
									<div className="col-span-1 font-semibold text-center">No</div>
									<div className="col-span-5 font-semibold">Kuisioner</div>
									<div className="col-span-4 font-semibold">Tanggal Submit</div>
									<div className="col-span-2 text-center font-semibold">Lihat</div>
								</div>
							</div>

							{/* Table Body */}
							<div className="divide-y divide-gray-200">
								{filteredHistory.map((submission, index) => (
									<div
										key={submission.id}
										className="grid grid-cols-12 py-3 px-4 text-sm hover:bg-gray-50 transition-colors">
										<div className="col-span-1 text-center text-gray-600 font-medium">
											{index + 1}
										</div>
										<div className="col-span-5">{submission.questionnaire.title}</div>
										<div className="col-span-4 text-gray-700">
											{new Date(submission.createdAt).toLocaleString("id-ID", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</div>
										<div className="col-span-2 text-center">
											<button
												onClick={() => handleHistoryQuiz(submission.id)}
												className="bg-[#70B748] hover:bg-[#5a9639] text-white px-3 py-1 rounded-md font-medium transition-colors text-xs">
												Lihat
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</section>
			</main>

			{/* MODAL (tetap ada untuk keperluan lain) */}
			{isModalOpen && (
				<div
					className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 px-4 animate-fadeIn"
					onClick={handleBackdropClick}>
					<div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
						{/* Modal Header */}
						<div className="bg-[#70B748] text-white p-6 flex justify-between items-start">
							<div className="flex-1 pr-4">
								<h2 className="text-2xl font-bold">{selectedQuestionnaire?.title}</h2>
								<p className="mt-2 text-white/90">
									{selectedQuestionnaire?.description}
								</p>
							</div>
							<button
								onClick={handleCloseModal}
								className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0">
								<X size={24} />
							</button>
						</div>
					</div>
				</div>
			)}

			{isModalOpen && (
				<div
					className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 px-4 animate-fadeIn"
					onClick={handleBackdropClick}>
					<div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
						{/* Modal Header */}
						<div className="bg-[#70B748] text-white p-6 flex justify-between items-start">
							<div className="flex-1 pr-4">
								<h2 className="text-2xl font-bold">{selectedQuestionnaire?.title}</h2>
								<p className="mt-2 text-white/90">
									{selectedQuestionnaire?.description}
								</p>
							</div>
							<button
								onClick={handleCloseModal}
								className="text-white hover:bg-white/20 rounded-full p-2 transition-colors flex-shrink-0">
								<X size={24} />
							</button>
						</div>

						{/* Filter Tanggal Section */}
						<div className="p-6 border-b border-gray-200">
							<h3 className="text-lg font-semibold mb-4">
								Filter Berdasarkan Tanggal
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Tanggal Mulai
									</label>
									<input
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748]"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Tanggal Selesai
									</label>
									<input
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#70B748]"
									/>
								</div>
								<div className="flex gap-2">
									<button
										onClick={handleDateFilter}
										className="bg-[#70B748] text-white px-4 py-2 rounded-md hover:bg-[#5a9639] transition-colors flex-1">
										Terapkan Filter
									</button>
									<button
										onClick={handleResetDateFilter}
										className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex-1">
										Reset
									</button>
								</div>
							</div>
						</div>

						{/* Modal Content - History List */}
						<div className="p-6 max-h-96 overflow-y-auto">
							<h3 className="text-lg font-semibold mb-4">Riwayat Pengerjaan</h3>

							{modalLoading ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="animate-spin text-[#70B748] mr-2" size={24} />
									<span className="text-gray-600">Memuat riwayat...</span>
								</div>
							) : modalHistory.length === 0 ? (
								<div className="text-center py-8 text-gray-500">
									Tidak ada riwayat pengerjaan untuk periode yang dipilih.
								</div>
							) : (
								<div className="space-y-3">
									{modalHistory.map((submission, index) => (
										<div
											key={submission.id}
											className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
											<div className="flex justify-between items-start">
												<div>
													<p className="font-medium">Submission #{index + 1}</p>
													<p className="text-sm text-gray-600 mt-1">
														Tanggal: {new Date(submission.createdAt).toLocaleString("id-ID")}
													</p>
													{submission.score && (
														<p className="text-sm text-gray-600">Skor: {submission.score}</p>
													)}
												</div>
												<button
													onClick={() => handleViewHistoryFromModal(submission.id)}
													className="bg-[#70B748] hover:bg-[#5a9639] text-white px-3 py-1 rounded-md text-sm transition-colors">
													Lihat Detail
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Modal Footer */}
						<div className="p-6 border-t border-gray-200 bg-gray-50">
							<button
								onClick={handleStartQuizFromModal}
								className="bg-[#70B748] hover:bg-[#5a9639] text-white px-6 py-2 rounded-md font-medium transition-colors">
								Kerjakan Kuisioner Ini
							</button>
						</div>
					</div>
				</div>
			)}

			<style>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slideUp {
					from { transform: translateY(20px); opacity: 0; }
					to { transform: translateY(0); opacity: 1; }
				}
				.animate-fadeIn { animation: fadeIn 0.2s ease-out; }
				.animate-slideUp { animation: slideUp 0.3s ease-out; }
			`}</style>
		</>
	);
}
