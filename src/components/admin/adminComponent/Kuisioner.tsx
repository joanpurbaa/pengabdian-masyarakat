import { useEffect, useState } from "react";
import {
	adminMedisService,
	type QuestionnaireQuestion,
	type CreateQuestionPayload,
	type Questionnaire,
	type CreateQuestionnairePayload,
} from "../../../service/adminMedisService";
import { GripVertical } from "lucide-react";
import type { AxiosError } from "axios";

export default function Kuisioner() {
	const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
	const [selectedQuestionnaire, setSelectedQuestionnaire] =
		useState<Questionnaire | null>(null);
	const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingQuestions, setLoadingQuestions] = useState(false);
	const [newQuestion, setNewQuestion] = useState<CreateQuestionPayload>({
		questionText: "",
		questionType: "radio",
		status: "draft",
		QuestionnaireId: "",
	});
	const [isAdding, setIsAdding] = useState(false);
	const [message, setMessage] = useState({ text: "", type: "" });
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [draggedItem, setDraggedItem] = useState<number | null>(null);
	const [isReordering, setIsReordering] = useState(false);
	const [createQuisionerPopUp, setCreateQuisionerPopUp] = useState(false);

	// State untuk form kuisioner baru
	const [newQuestionnaire, setNewQuestionnaire] =
		useState<CreateQuestionnairePayload>({
			title: "",
			description: "",
			riskThreshold: 0,
			status: "draft",
		});
	const [isCreatingQuestionnaire, setIsCreatingQuestionnaire] = useState(false);

	useEffect(() => {
		fetchQuestionnaires();
	}, []);

	const fetchQuestionnaires = async () => {
		try {
			setLoading(true);
			const data = await adminMedisService.getAllQuestionnaires();
			setQuestionnaires(data);
		} catch (error) {
			console.error("Error fetching questionnaires:", error);
			setMessage({
				text: "Gagal memuat daftar kuisioner",
				type: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleCreateQuestionnaire = async () => {
		console.log("🟡 Starting create questionnaire process...");

		if (!newQuestionnaire.title.trim()) {
			setMessage({
				text: "Judul kuisioner tidak boleh kosong",
				type: "error",
			});
			return;
		}

		setIsCreatingQuestionnaire(true);
		setMessage({ text: "", type: "" });

		try {
			console.log("📝 Payload to send:", newQuestionnaire);

			const createdQuestionnaire = await adminMedisService.createQuestionnaire(
				newQuestionnaire
			);

			console.log("🎉 Questionnaire created successfully:", createdQuestionnaire);

			setQuestionnaires((prev) => [...prev, createdQuestionnaire]);

			setNewQuestionnaire({
				title: "",
				description: "",
				riskThreshold: 0,
				status: "draft",
			});

			setCreateQuisionerPopUp(false);

			setMessage({
				text: "Kuisioner berhasil dibuat!",
				type: "success",
			});

			setTimeout(() => setMessage({ text: "", type: "" }), 3000);
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			console.error("❌ Error creating questionnaire:", error);

			const errorMessage =
				error.response?.data?.message || error.message || "Gagal membuat kuisioner";

			setMessage({
				text: errorMessage,
				type: "error",
			});
		} finally {
			setIsCreatingQuestionnaire(false);
		}
	};

	const handleSelectQuestionnaire = async (questionnaire: Questionnaire) => {
		setSelectedQuestionnaire(questionnaire);
		setNewQuestion((prev) => ({
			...prev,
			QuestionnaireId: questionnaire.id,
		}));
		await fetchQuestions(questionnaire.id);
	};

	const fetchQuestions = async (questionnaireId: string) => {
		try {
			setLoadingQuestions(true);
			const data = await adminMedisService.getQuestionnaireQuestions(
				questionnaireId
			);
			setQuestions(data);
		} catch (error) {
			console.error("Error fetching questions:", error);
			setMessage({
				text: "Gagal memuat daftar pertanyaan",
				type: "error",
			});
		} finally {
			setLoadingQuestions(false);
		}
	};

	const tambahPertanyaan = async () => {
		if (!newQuestion.questionText.trim()) {
			setMessage({
				text: "Teks pertanyaan tidak boleh kosong",
				type: "error",
			});
			return;
		}

		setIsAdding(true);
		setMessage({ text: "", type: "" });

		try {
			const createdQuestion = await adminMedisService.createQuestionnaireQuestion(
				newQuestion
			);

			setQuestions((prev) => [...prev, createdQuestion]);
			setNewQuestion({
				questionText: "",
				questionType: "radio",
				status: "draft",
				QuestionnaireId: selectedQuestionnaire!.id,
			});
			setMessage({
				text: "Pertanyaan berhasil ditambahkan!",
				type: "success",
			});

			setTimeout(() => setMessage({ text: "", type: "" }), 3000);
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			console.error("Error adding question:", error);
			setMessage({
				text: error.response?.data?.message || "Gagal menambahkan pertanyaan",
				type: "error",
			});
		} finally {
			setIsAdding(false);
		}
	};

	const handleToggle = async (questionId: string, currentStatus: string) => {
		const newStatus = currentStatus === "publish" ? "draft" : "publish";

		console.log("🎯 Handle toggle:", {
			questionId,
			currentStatus,
			newStatus,
			questionsLength: questions?.length,
		});

		try {
			// Pastikan questions ada dan valid
			if (!questions || questions.length === 0) {
				console.error("❌ Questions array is empty or undefined");
				setMessage({
					text: "Tidak ada pertanyaan untuk diupdate",
					type: "error",
				});
				return;
			}

			const updatedQuestions = await adminMedisService.toggleQuestionStatus(
				questionId,
				newStatus,
				questions
			);

			console.log("✅ Updated questions received:", updatedQuestions);

			// Pastikan response valid sebelum update state
			if (updatedQuestions && Array.isArray(updatedQuestions)) {
				setQuestions(updatedQuestions);

				setMessage({
					text: `Status berhasil diubah menjadi ${newStatus}`,
					type: "success",
				});

				setTimeout(() => setMessage({ text: "", type: "" }), 3000);
			} else {
				console.error("❌ Invalid response:", updatedQuestions);
				throw new Error("Invalid response from server");
			}
		} catch (err) {
			// ✅ PERBAIKAN: Cast err ke AxiosError
			const error = err as AxiosError<{ message?: string }>;
			console.error("❌ Error toggling status:", error);
			setMessage({
				text: error.response?.data?.message || "Gagal mengubah status",
				type: "error",
			});

			// Reload questions jika gagal untuk memastikan data konsisten
			if (selectedQuestionnaire) {
				console.log("🔄 Reloading questions...");
				await fetchQuestions(selectedQuestionnaire.id);
			}
		}
	};

	const handleDeleteQuestion = async (questionId: string) => {
		if (!confirm("Apakah Anda yakin ingin menghapus pertanyaan ini?")) {
			return;
		}

		try {
			await adminMedisService.deleteQuestionnaireQuestion(questionId);
			setQuestions((prev) => prev.filter((q) => q.id !== questionId));
			setMessage({
				text: "Pertanyaan berhasil dihapus",
				type: "success",
			});

			setTimeout(() => setMessage({ text: "", type: "" }), 3000);
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			console.error("Error deleting question:", error);
			setMessage({
				text: error.response?.data?.message || "Gagal menghapus pertanyaan",
				type: "error",
			});
		}
	};

	const handleAnswerChange = (questionId: string, value: string) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const handleBackToList = () => {
		setSelectedQuestionnaire(null);
		setQuestions([]);
		setAnswers({});
		setMessage({ text: "", type: "" });
	};

	const handleDragStart = (index: number) => {
		setDraggedItem(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		if (draggedItem === null || draggedItem === index) return;
		if (!questions || questions.length === 0) return; // ✅ Safe check

		const newQuestions = [...questions];
		const draggedQuestion = newQuestions[draggedItem];
		newQuestions.splice(draggedItem, 1);
		newQuestions.splice(index, 0, draggedQuestion);

		setQuestions(newQuestions);
		setDraggedItem(index);
	};

	const handleDragEnd = async () => {
		if (draggedItem === null) return;
		if (!questions || questions.length === 0) return;

		setIsReordering(true);
		try {
			const payload = questions.map((q, index) => ({
				id: q.id,
				questionText: q.questionText,
				questionType: q.questionType,
				status: q.status as "publish" | "draft",
				order: index + 1,
			}));

			console.log("📤 Reordering payload:", payload);

			const updatedQuestions = await adminMedisService.bulkUpdateQuestions(
				payload
			);

			console.log("✅ Reordered questions received:", updatedQuestions);

			if (updatedQuestions && Array.isArray(updatedQuestions)) {
				setQuestions(updatedQuestions);

				setMessage({
					text: "Urutan pertanyaan berhasil diperbarui",
					type: "success",
				});

				setTimeout(() => setMessage({ text: "", type: "" }), 3000);
			} else {
				throw new Error("Invalid response from server");
			}
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			console.error("❌ Error reordering questions:", error);
			setMessage({
				text: error.response?.data?.message || "Gagal mengubah urutan",
				type: "error",
			});
			if (selectedQuestionnaire) {
				console.log("🔄 Reloading questions after reorder error...");
				await fetchQuestions(selectedQuestionnaire.id);
			}
		} finally {
			setDraggedItem(null);
			setIsReordering(false);
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getStatusBadge = (status: string) => {
		const statusConfig = {
			publish: { color: "bg-green-100 text-green-800", label: "Published" },
			draft: { color: "bg-yellow-100 text-yellow-800", label: "Draft" },
			archived: { color: "bg-gray-100 text-gray-800", label: "Archived" },
		};

		const config =
			statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
				{config.label}
			</span>
		);
	};

	const handleToggleQuestionnaireStatus = async (
		questionnaireId: string,
		currentStatus: string
	) => {
		const newStatus = currentStatus === "publish" ? "draft" : "publish";

		try {
			setMessage({ text: "", type: "" });

			const updatedQuestionnaire = await adminMedisService.updateQuestionnaire(
				questionnaireId,
				{
					title: questionnaires.find((q) => q.id === questionnaireId)?.title || "",
					description:
						questionnaires.find((q) => q.id === questionnaireId)?.description || "",
					status: newStatus as "draft" | "publish",
				}
			);

			setQuestionnaires((prev) =>
				prev.map((q) => (q.id === questionnaireId ? updatedQuestionnaire : q))
			);

			setMessage({
				text: `Status kuisioner berhasil diubah menjadi ${newStatus}`,
				type: "success",
			});

			setTimeout(() => setMessage({ text: "", type: "" }), 3000);
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			console.error("Error updating questionnaire status:", error);
			setMessage({
				text: error.response?.data?.message || "Gagal mengubah status kuisioner",
				type: "error",
			});
		}
	};

	const publishedQuestions = Array.isArray(questions)
		? questions.filter((q) => q.status === "publish")
		: [];

	// Loading state untuk daftar kuisioner
	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B748]"></div>
				<p className="ml-3 text-gray-600">Memuat daftar kuisioner...</p>
			</div>
		);
	}

	// Jika belum memilih kuisioner, tampilkan daftar kuisioner
	if (!selectedQuestionnaire) {
		return (
			<div className="w-full h-auto bg-gray-100 p-6 shadow-sm rounded-lg">
				<div className="flex justify-between items-start">
					<div className="mb-6">
						<h1 className="font-semibold text-zinc-600 text-2xl mb-2">
							Pilih Kuisioner
						</h1>
						<p className="text-zinc-500 text-sm">
							Pilih kuisioner untuk mengelola pertanyaan
						</p>
					</div>
					<button
						onClick={() => setCreateQuisionerPopUp(true)}
						className="bg-[#70B748] text-white py-2 px-4 rounded-md hover:bg-[#5E9B3A] transition-colors text-sm font-medium">
						Buat Kuisioner
					</button>
				</div>

				{/* Global Message */}
				{message.text && (
					<div
						className={`mb-4 p-4 rounded-md text-sm ${
							message.type === "success"
								? "bg-green-100 text-green-800 border border-green-200"
								: "bg-red-100 text-red-800 border border-red-200"
						}`}>
						{message.text}
					</div>
				)}

				{questionnaires.length === 0 ? (
					<div className="bg-white rounded-lg p-12 text-center">
						<p className="text-gray-500 text-lg">Tidak ada kuisioner tersedia</p>
						<p className="text-gray-400 text-sm mt-2">
							Buat kuisioner terlebih dahulu
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{questionnaires.map((questionnaire) => (
							<div
								key={questionnaire.id}
								className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
								onClick={() => handleSelectQuestionnaire(questionnaire)}>
								<div className="flex justify-between items-start mb-3">
									<h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
										{questionnaire.title}
									</h3>
									<div className="flex items-center gap-3">
										{getStatusBadge(questionnaire.status)}

										{/* Toggle untuk ubah status kuisioner */}
										<div
											onClick={(e) => {
												e.stopPropagation(); // Prevent triggering the card click
												handleToggleQuestionnaireStatus(
													questionnaire.id,
													questionnaire.status
												);
											}}
											className={`w-12 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
												questionnaire.status === "publish" ? "bg-[#5a9639]" : "bg-gray-400"
											}`}>
											<div
												className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
													questionnaire.status === "publish"
														? "translate-x-6"
														: "translate-x-0"
												}`}></div>
										</div>
									</div>
								</div>

								<p className="text-gray-600 text-sm mb-4 line-clamp-3">
									{questionnaire.description || "Tidak ada deskripsi"}
								</p>

								<div className="flex flex-col gap-2 text-xs text-gray-500">
									<span>Dibuat: {formatDate(questionnaire.createdAt)}</span>
									<span>Diupdate: {formatDate(questionnaire.updatedAt)}</span>
								</div>

								<div className="mt-4 pt-4 border-t border-gray-100">
									<button className="w-full bg-[#70B748] text-white py-2 px-4 rounded-md hover:bg-[#5E9B3A] transition-colors text-sm font-medium">
										Kelola Pertanyaan
									</button>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Popup Form Buat Kuisioner */}
				{createQuisionerPopUp && (
					<>
						{/* Overlay */}
						<div
							className="fixed inset-0 bg-black/50 z-40"
							onClick={() => setCreateQuisionerPopUp(false)}></div>

						{/* Popup Content */}
						<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 w-full max-w-md p-6">
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-lg font-semibold text-gray-800">
									Buat Kuisioner Baru
								</h2>
								<button
									onClick={() => setCreateQuisionerPopUp(false)}
									className="text-gray-400 hover:text-gray-600 text-xl">
									×
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Judul Kuisioner
									</label>
									<input
										type="text"
										value={newQuestionnaire.title}
										onChange={(e) =>
											setNewQuestionnaire((prev) => ({
												...prev,
												title: e.target.value,
											}))
										}
										placeholder="Masukkan judul kuisioner..."
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9639] focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Deskripsi
									</label>
									<textarea
										value={newQuestionnaire.description}
										onChange={(e) =>
											setNewQuestionnaire((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
										placeholder="Masukkan deskripsi kuisioner..."
										rows={3}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9639] focus:border-transparent resize-none"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Total jawaban "Ya"
									</label>
									<input
										type="number"
										value={newQuestionnaire.riskThreshold}
										onChange={(e) =>
											setNewQuestionnaire((prev) => ({
												...prev,
												riskThreshold: Number(e.target.value),
											}))
										}
										placeholder="Masukkan threshold risiko..."
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9639] focus:border-transparent"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Status
									</label>
									<select
										value={newQuestionnaire.status}
										onChange={(e) =>
											setNewQuestionnaire((prev) => ({
												...prev,
												status: e.target.value as "draft" | "publish",
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9639] focus:border-transparent">
										<option value="draft">Draft</option>
										<option value="publish">Publish</option>
									</select>
								</div>

								<div className="flex gap-3 pt-2">
									<button
										onClick={() => setCreateQuisionerPopUp(false)}
										className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium">
										Batal
									</button>
									<button
										onClick={handleCreateQuestionnaire}
										disabled={isCreatingQuestionnaire || !newQuestionnaire.title.trim()}
										className={`flex-1 px-4 py-2 rounded-md text-white font-medium ${
											isCreatingQuestionnaire || !newQuestionnaire.title.trim()
												? "bg-gray-400 cursor-not-allowed"
												: "bg-[#5a9639] hover:bg-[#4a7c2f]"
										}`}>
										{isCreatingQuestionnaire ? "Membuat..." : "Buat Kuisioner"}
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		);
	}

	// Jika sudah memilih kuisioner, tampilkan form pertanyaan (kode yang sama seperti sebelumnya)
	return (
		<div className="w-full h-auto bg-gray-100 p-6 shadow-sm rounded-lg">
			{/* Header dengan tombol kembali */}
			<div className="mb-6 flex items-center justify-between">
				<div>
					<button
						onClick={handleBackToList}
						className="text-[#70B748] hover:text-[#5E9B3A] font-medium mb-2 flex items-center gap-2">
						← Kembali ke Daftar Kuisioner
					</button>
					<h1 className="font-semibold text-zinc-600 text-xl mb-1">
						Kelola Pertanyaan: {selectedQuestionnaire.title}
					</h1>
					<p className="text-zinc-500 text-sm">
						Toggle untuk menampilkan/menyembunyikan pertanyaan dari user
					</p>
				</div>
				{getStatusBadge(selectedQuestionnaire.status)}
			</div>

			{/* Global Message */}
			{message.text && (
				<div
					className={`mb-4 p-4 rounded-md text-sm ${
						message.type === "success"
							? "bg-green-100 text-green-800 border border-green-200"
							: "bg-red-100 text-red-800 border border-red-200"
					}`}>
					{message.text}
				</div>
			)}

			{/* Section untuk menambah pertanyaan baru */}
			<div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
				<h2 className="font-medium text-zinc-700 mb-3">Tambah Pertanyaan Baru</h2>
				<div className="space-y-3">
					<div>
						<label className="block text-sm font-medium text-zinc-700 mb-1">
							Teks Pertanyaan *
						</label>
						<input
							type="text"
							value={newQuestion.questionText}
							onChange={(e) =>
								setNewQuestion((prev) => ({
									...prev,
									questionText: e.target.value,
								}))
							}
							placeholder="Masukkan pertanyaan baru..."
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9639] focus:border-transparent"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-zinc-700 mb-1">
							Tipe Pertanyaan
						</label>
						<select
							value={newQuestion.questionType}
							onChange={(e) =>
								setNewQuestion((prev) => ({
									...prev,
									questionType: e.target.value as "radio" | "checkbox" | "text",
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9639] focus:border-transparent">
							<option value="radio">Radio (Ya/Tidak)</option>
							<option value="checkbox">Checkbox</option>
							<option value="text">Text</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-zinc-700 mb-1">
							Status
						</label>
						<select
							value={newQuestion.status}
							onChange={(e) =>
								setNewQuestion((prev) => ({
									...prev,
									status: e.target.value as "publish" | "draft",
								}))
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9639] focus:border-transparent">
							<option value="draft">Draft</option>
							<option value="publish">Publish</option>
						</select>
					</div>

					<button
						onClick={tambahPertanyaan}
						disabled={isAdding || !newQuestion.questionText.trim()}
						className={`px-4 py-2 rounded-md text-white font-medium ${
							isAdding || !newQuestion.questionText.trim()
								? "bg-gray-400 cursor-not-allowed"
								: "bg-[#5a9639] hover:bg-[#4a7c2f]"
						}`}>
						{isAdding ? "Menambahkan..." : "Tambah Pertanyaan"}
					</button>
				</div>
			</div>

			{/* Loading state untuk pertanyaan */}
			{loadingQuestions ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B748]"></div>
					<p className="ml-3 text-gray-600">Memuat pertanyaan...</p>
				</div>
			) : (
				<>
					{/* Section untuk mengelola toggle */}
					<div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
						<div className="flex justify-between items-center mb-3">
							<h2 className="font-medium text-zinc-700">
								Kelola Pertanyaan ({questions?.length || 0})
							</h2>
							<p className="text-xs text-zinc-500">
								💡 Drag untuk mengubah urutan pertanyaan
							</p>
						</div>
						{!questions || questions.length === 0 ? (
							<div className="text-center py-8 text-zinc-500">
								<p>Belum ada pertanyaan.</p>
								<p className="text-sm mt-1">Tambahkan pertanyaan baru di atas.</p>
							</div>
						) : (
							<div className="space-y-3">
								{questions.map((question, index) => (
									<div
										key={question.id}
										draggable
										onDragStart={() => handleDragStart(index)}
										onDragOver={(e) => handleDragOver(e, index)}
										onDragEnd={handleDragEnd}
										className={`flex items-center justify-between py-3 px-3 border rounded-md hover:bg-gray-50 cursor-move transition-all ${
											draggedItem === index
												? "border-[#70B748] bg-green-50 shadow-md"
												: "border-gray-100"
										} ${isReordering ? "opacity-50 cursor-not-allowed" : ""}`}>
										<div className="flex items-start space-x-3 flex-1">
											<GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
											<span className="text-sm text-zinc-600 w-6 mt-1">{index + 1}.</span>
											<div className="flex-1">
												<span className="text-zinc-700 text-sm block">
													{question.questionText}
												</span>
												<span className="text-zinc-400 text-xs block mt-1">
													Tipe: {question.questionType}
													{question.order && ` • Order: ${question.order}`}
												</span>
											</div>
										</div>

										<div className="flex items-center space-x-3">
											<span
												className={`text-xs px-2 py-1 rounded ${
													question.status === "publish"
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-600"
												}`}>
												{question.status === "publish" ? "Published" : "Draft"}
											</span>

											<div
												onClick={() =>
													!isReordering && handleToggle(question.id, question.status)
												}
												className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
													isReordering ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
												} ${
													question.status === "publish" ? "bg-[#5a9639]" : "bg-gray-400"
												}`}>
												<div
													className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-300 ${
														question.status === "publish" ? "translate-x-6" : "translate-x-0"
													}`}></div>
											</div>

											<button
												onClick={() => !isReordering && handleDeleteQuestion(question.id)}
												disabled={isReordering}
												className={`text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors ${
													isReordering ? "opacity-50 cursor-not-allowed" : ""
												}`}>
												Hapus
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Section untuk preview pertanyaan yang ditampilkan ke user */}
					<div className="bg-white rounded-lg p-6 border border-gray-200">
						<h2 className="font-medium text-zinc-700 mb-4">
							Preview: Pertanyaan yang Ditampilkan ke User ({publishedQuestions.length}{" "}
							dari {questions.length})
						</h2>

						{publishedQuestions.length === 0 ? (
							<div className="text-center py-8 text-zinc-500">
								<p>Tidak ada pertanyaan yang dipublish.</p>
								<p className="text-sm mt-1">
									Aktifkan beberapa pertanyaan menggunakan toggle di atas.
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{publishedQuestions.map((question, index) => (
									<div
										key={question.id}
										className="bg-gray-50 rounded-md p-4 border border-gray-200">
										<p className="text-zinc-700 font-medium mb-3">
											{index + 1}. {question.questionText}
										</p>

										{question.questionType === "radio" && (
											<div className="flex gap-6">
												<label className="flex items-center space-x-2 cursor-pointer">
													<input
														type="radio"
														name={`answer-${question.id}`}
														checked={answers[question.id] === "Ya"}
														onChange={() => handleAnswerChange(question.id, "Ya")}
														className="w-4 h-4 text-[#5a9639] focus:ring-[#5a9639]"
													/>
													<span className="text-zinc-700">Ya</span>
												</label>
												<label className="flex items-center space-x-2 cursor-pointer">
													<input
														type="radio"
														name={`answer-${question.id}`}
														checked={answers[question.id] === "Tidak"}
														onChange={() => handleAnswerChange(question.id, "Tidak")}
														className="w-4 h-4 text-[#5a9639] focus:ring-[#5a9639]"
													/>
													<span className="text-zinc-700">Tidak</span>
												</label>
											</div>
										)}

										{question.questionType === "checkbox" && (
											<label className="flex items-center space-x-2 cursor-pointer">
												<input
													type="checkbox"
													checked={answers[question.id] === "checked"}
													onChange={(e) =>
														handleAnswerChange(question.id, e.target.checked ? "checked" : "")
													}
													className="w-4 h-4 text-[#5a9639] focus:ring-[#5a9639] rounded"
												/>
												<span className="text-zinc-700">Ya</span>
											</label>
										)}

										{question.questionType === "text" && (
											<input
												type="text"
												value={answers[question.id] || ""}
												onChange={(e) => handleAnswerChange(question.id, e.target.value)}
												placeholder="Masukkan jawaban..."
												className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5a9639]"
											/>
										)}

										{answers[question.id] && (
											<div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
												Jawaban: <strong>{answers[question.id]}</strong>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Summary */}
					<div className="mt-4 text-sm text-zinc-500">
						<p>
							Total pertanyaan: {questions?.length || 0} | Published:{" "}
							{publishedQuestions.length} | Draft:{" "}
							{(questions?.length || 0) - publishedQuestions.length}
						</p>
					</div>
				</>
			)}
		</div>
	);
}
