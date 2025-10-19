import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
	questionnaireService,
	type QuestionnaireDetail,
} from "../service/questionnaireService";
import { Loader2 } from "lucide-react";

export default function Quiz() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [quiz, setQuiz] = useState<QuestionnaireDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [answers, setAnswers] = useState<Record<string, string>>({});

	useEffect(() => {
		const fetchQuiz = async () => {
			if (!id) return;

			try {
				setLoading(true);
				setError(null);
				const quizData = await questionnaireService.getQuestionnaireById(id);
				setQuiz(quizData);

				const initialAnswers: Record<string, string> = {};
				quizData.questions.forEach((question) => {
					initialAnswers[question.id] = "";
				});
				setAnswers(initialAnswers);
			} catch (err) {
				setError("Gagal memuat kuisioner");
				console.error("Error fetching quiz:", err);
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
		if (!id) return;

		try {
			const unanswered = Object.values(answers).some((answer) => answer === "");
			if (unanswered) {
				alert("Mohon jawab semua pertanyaan sebelum mengirim");
				return;
			}

			await questionnaireService.submitAnswers(id, answers);
			navigate("/result");
		} catch (err) {
			console.error("Error submitting answers:", err);
			alert("Gagal mengirim jawaban. Silakan coba lagi.");
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<Loader2 className="animate-spin text-[#70B748]" size={32} />
				<span className="ml-2 text-gray-600">Memuat kuisioner...</span>
			</div>
		);
	}

	if (error || !quiz) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-600 mb-4">{error || "Kuisioner tidak ditemukan"}</p>
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
					{quiz.title}
				</h1>
				<p className="text-gray-600 text-center mb-6">{quiz.description}</p>

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
					{quiz.questions.map((question, index) => (
						<div
							key={question.id}
							className="bg-gray-50 border border-gray-200 rounded-lg p-4">
							<p className="text-xs sm:text-base text-gray-800 mb-3">
								{index + 1}. {question.question}
							</p>
							<div className="flex gap-4 flex-wrap">
								{question.options.map((option, optionIndex) => (
									<label key={optionIndex} className="flex items-center cursor-pointer">
										<input
											type="radio"
											name={question.id}
											value={option}
											checked={answers[question.id] === option}
											onChange={(e) => handleAnswerChange(question.id, e.target.value)}
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
					))}
				</div>

				<button
					onClick={handleSubmit}
					className="cursor-pointer w-full bg-[#70B748] hover:bg-green-600 text-xs sm:text-base text-white font-medium py-3 px-4 rounded-lg mt-6 transition-colors">
					Selesai
				</button>
			</div>
		</div>
	);
}
