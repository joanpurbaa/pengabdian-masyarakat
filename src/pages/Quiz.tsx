import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
	questionnaireService,
	type QuestionnaireDetail,
	validateQuestionnaireData,
} from "../service/questionnaireService";
import { Loader2 } from "lucide-react";

export default function Quiz() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [quiz, setQuiz] = useState<QuestionnaireDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		const fetchQuiz = async () => {
			if (!id) {
				setError("ID kuisioner tidak valid");
				setLoading(false);
				return;
			}

			try {
				setLoading(true);
				setError(null);

				let quizData;

				try {
					quizData = await questionnaireService.getPublicQuestionnaireById(id);
				} catch (publicErr) {
					console.log("❌ Public API failed, trying regular endpoint...");
					quizData = await questionnaireService.getQuestionnaireById(id);
					console.log("✅ Regular API response:", quizData);
				}

				const validatedData = validateQuestionnaireData(quizData);

				if (!validatedData.questions || validatedData.questions.length === 0) {
					console.warn("⚠️ No questions found in questionnaire");
					throw new Error("Kuisioner tidak memiliki pertanyaan");
				}

				setQuiz(validatedData);

				const initialAnswers: Record<string, string> = {};
				validatedData.questions.forEach((question) => {
					if (question.id && question.questionText) {
						initialAnswers[question.id] = "";
					} else {
						console.warn("❌ Invalid question skipped:", question);
					}
				});

				setAnswers(initialAnswers);
			} catch (err: any) {
				console.error("❌ Error fetching quiz:", err);
				const errorMessage =
					err.response?.data?.message || err.message || "Gagal memuat kuisioner";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchQuiz();
	}, [id]);

	const handleAnswerChange = (questionId: string, value: string) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const handleSubmit = async () => {
		if (!id || !quiz) return;

		// Validasi semua pertanyaan terjawab
		const unansweredQuestions = Object.entries(answers).filter(
			([questionId, value]) => {
				const isUnanswered = value === "";
				if (isUnanswered) {
					console.log(`❌ Unanswered: ${questionId}`);
				}
				return isUnanswered;
			}
		);

		if (unansweredQuestions.length > 0) {
			alert(
				`Mohon jawab semua pertanyaan sebelum mengirim. Masih ada ${unansweredQuestions.length} pertanyaan yang belum dijawab.`
			);
			return;
		}

		try {
			setSubmitting(true);

			const response = await questionnaireService.submitAnswers(id, answers);

			// Navigate ke result page dengan data response
			navigate(`/result/${response.data?.id}`, {
				state: {
					submissionData: response.data,
					questionnaireTitle: quiz.title,
				},
			});
		} catch (err: any) {
			console.error("❌ Error submitting answers:", err);

			// Tampilkan error detail dari API
			const errorDetail = err.response?.data;
			console.log("🔍 Error details:", errorDetail);

			let errorMessage = "Gagal mengirim jawaban. Silakan coba lagi.";

			if (errorDetail?.message) {
				errorMessage = errorDetail.message;
			}

			if (errorDetail?.errors) {
				errorMessage += `\n\nDetail: ${JSON.stringify(errorDetail.errors)}`;
			}

			alert(errorMessage);
		} finally {
			setSubmitting(false);
		}
	};

	// Hitung progress - dengan validasi
	const totalQuestions = quiz?.questions?.length || 0;
	const answeredQuestions = Object.values(answers).filter(
		(answer) => answer !== ""
	).length;
	const progress =
		totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="animate-spin text-[#70B748] mx-auto mb-4" size={32} />
					<span className="ml-2 text-gray-600">Memuat kuisioner...</span>
					<p className="text-sm text-gray-500 mt-2">ID: {id}</p>
				</div>
			</div>
		);
	}

	if (error || !quiz) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center max-w-md">
					<p className="text-red-600 mb-4 text-lg font-semibold">
						Oops! Terjadi Kesalahan
					</p>
					<p className="text-gray-600 mb-6">
						{error || "Kuisioner tidak ditemukan"}
					</p>
					<div className="space-y-3">
						<button
							onClick={() => navigate("/")}
							className="w-full bg-[#70B748] text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors">
							Kembali ke Beranda
						</button>
						<button
							onClick={() => window.location.reload()}
							className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
							Muat Ulang Halaman
						</button>
					</div>
				</div>
			</div>
		);
	}

	// Validasi sebelum render questions
	if (!quiz.questions || quiz.questions.length === 0) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-4">Kuisioner tidak memiliki pertanyaan</p>
					<button
						onClick={() => navigate("/")}
						className="bg-[#70B748] text-white px-4 py-2 rounded-md">
						Kembali ke Beranda
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 p-2 sm:p-4">
			<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-3 sm:p-6">
				<h1 className="text-lg sm:text-2xl font-bold text-green-600 mb-2 text-center">
					{quiz.title || "Kuisioner"}
				</h1>
				<p className="text-gray-600 text-center mb-6">
					{quiz.description || "Deskripsi kuisioner"}
				</p>

				{/* Progress Bar */}
				<div className="mb-6">
					<div className="flex justify-between text-sm text-gray-600 mb-2">
						<span>
							Progress: {answeredQuestions}/{totalQuestions}
						</span>
						<span>{Math.round(progress)}%</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-[#70B748] h-2 rounded-full transition-all duration-300"
							style={{ width: `${progress}%` }}></div>
					</div>
				</div>

				<div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
					<div className="flex items-center mb-3">
						<div className="w-4 sm:w-5 h-4 sm:h-5 bg-[#70B748] rounded-full flex items-center justify-center mr-2">
							<span className="text-white text-xs">!</span>
						</div>
						<span className="text-xs sm:text-sm font-semibold text-green-700">
							Petunjuk Pengerjaan
						</span>
					</div>
					<ul className="text-xs sm:text-base text-green-700 space-y-2">
						<li>
							• Pertanyaan menyangkut masalah yang Anda alami dalam 30 hari terakhir.
						</li>
						<li>• Untuk setiap pertanyaan pilih jawaban yang sesuai.</li>
						<li>• Jika ragu, pilih jawaban yang paling mendekati kondisi Anda.</li>
						<li>
							• Jawaban bersifat rahasia dan hanya digunakan untuk membantu Anda.
						</li>
					</ul>
				</div>

				<div className="space-y-4">
					{quiz.questions.map((question, index) => {
						// Validasi setiap question sebelum render
						if (!question.id || !question.questionText) {
							console.warn("❌ Invalid question data:", question);
							return (
								<div
									key={`invalid-${index}`}
									className="bg-red-50 border border-red-200 rounded-lg p-4">
									<p className="text-red-700">Pertanyaan tidak valid (index {index})</p>
								</div>
							);
						}

						const safeOptions =
							Array.isArray(question.options) && question.options.length > 0
								? question.options
								: ["Ya", "Tidak"];

						return (
							<div
								key={question.id}
								className="bg-gray-50 border border-gray-200 rounded-lg p-4">
								<p className="text-xs sm:text-base text-gray-800 mb-3">
									{index + 1}. {question.questionText}
								</p>
								<div className="flex gap-4 flex-wrap">
									{safeOptions.map((option, optionIndex) => (
										<label key={optionIndex} className="flex items-center cursor-pointer">
											<input
												type="radio"
												name={question.id}
												value={option}
												checked={answers[question.id] === option}
												onChange={(e) => {
													handleAnswerChange(question.id, e.target.value);
												}}
												className="sr-only"
											/>
											<div
												className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 mr-1 sm:mr-2 flex items-center justify-center ${
													answers[question.id] === option
														? "bg-[#70B748] border-[#70B748]"
														: "border-gray-300"
												}`}>
												{answers[question.id] === option && (
													<div className="w-2 h-2 bg-white rounded-full"></div>
												)}
											</div>
											<span className="text-xs sm:text-base text-gray-700">{option}</span>
										</label>
									))}
								</div>
							</div>
						);
					})}
				</div>

				<button
					onClick={handleSubmit}
					disabled={submitting || answeredQuestions < totalQuestions}
					className="cursor-pointer w-full bg-[#70B748] hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs sm:text-base text-white font-medium py-3 px-4 rounded-lg mt-6 transition-colors flex items-center justify-center">
					{submitting ? (
						<>
							<Loader2 className="animate-spin mr-2" size={16} />
							Mengirim...
						</>
					) : (
						"Selesai"
					)}
				</button>
			</div>
		</div>
	);
}
