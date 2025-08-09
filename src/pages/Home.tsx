import { useState } from "react";
import { useNavigate } from "react-router";

export default function Home() {
	const navigate = useNavigate();

	const [answers, setAnswers] = useState({
		q1: "",
		q2: "",
		q3: "",
		q4: "",
	});

	const handleAnswerChange = (questionId: string, value: string) => {
		setAnswers((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const handleSubmit = () => {
		console.log("Jawaban:", answers);

		navigate("/result");
	};

	return (
		<div className="min-h-screen bg-gray-100 p-2 sm:p-4">
			<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-3 sm:p-6">
				<h1 className="text-lg sm:text-2xl font-bold text-green-600 mb-6 text-center">
					Kuisioner
				</h1>

				<div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6">
					<div className="flex items-center mb-3">
						<div className="w-4 sm:w-5 h-4 sm:h-5 bg-[#70B748] rounded-full flex items-center justify-center mr-2">
							<span className="text-white text-xs">!</span>
						</div>
						<span className="text-xs sm:text-sm font-semibold text-green-700">
							Baca petunjuk
						</span>
					</div>
					<ul className="text-xs sm:text-base text-green-700 space-y-2">
						<li>
							• Pertanyaan menyangkut masalah yang Anda alami dalam 30 hari terakhir.
						</li>
						<li>• Untuk setiap pertanyaan:</li>
						<li className="ml-4">• Pilih Ya jika Anda mengalaminya.</li>
						<li className="ml-4">• Pilih Tidak jika Anda tidak mengalaminya.</li>
						<li>• Jika ragu, pilih jawaban yang paling mendekati kondisi Anda.</li>
						<li>
							• Jawaban bersifat rahasia dan hanya digunakan untuk membantu Anda.
						</li>
					</ul>
				</div>

				<div className="space-y-4">
					{[1, 2, 3, 4].map((num) => (
						<div
							key={num}
							className="bg-gray-50 border border-gray-200 rounded-lg p-4">
							<p className="text-xs sm:text-base text-gray-800 mb-3">
								{num}. Apakah Anda sering merasa sakit kepala?
							</p>
							<div className="flex gap-4">
								<label className="flex items-center cursor-pointer">
									<input
										type="radio"
										name={`q${num}`}
										value="ya"
										checked={answers[`q${num}` as keyof typeof answers] === "ya"}
										onChange={(e) => handleAnswerChange(`q${num}`, e.target.value)}
										className="sr-only"
									/>
									<div
										className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 mr-1 sm:mr-2 flex items-center justify-center ${
											answers[`q${num}` as keyof typeof answers] === "ya"
												? "bg-[#70B748] border-[#70B748]"
												: "border-gray-300"
										}`}>
										{answers[`q${num}` as keyof typeof answers] === "ya" && (
											<div className="w-2 h-2 bg-white rounded-full"></div>
										)}
									</div>
									<span className="text-xs sm:text-base text-gray-700">Ya</span>
								</label>
								<label className="flex items-center cursor-pointer">
									<input
										type="radio"
										name={`q${num}`}
										value="tidak"
										checked={answers[`q${num}` as keyof typeof answers] === "tidak"}
										onChange={(e) => handleAnswerChange(`q${num}`, e.target.value)}
										className="sr-only"
									/>
									<div
										className={`w-3 sm:w-4 h-3 sm:h-4 rounded-full border-2 mr-1 sm:mr-2 flex items-center justify-center ${
											answers[`q${num}` as keyof typeof answers] === "tidak"
												? "bg-[#70B748] border-[#70B748]"
												: "border-gray-300"
										}`}>
										{answers[`q${num}` as keyof typeof answers] === "tidak" && (
											<div className="w-2 h-2 bg-white rounded-full"></div>
										)}
									</div>
									<span className="text-xs sm:text-base text-gray-700">Tidak</span>
								</label>
							</div>
						</div>
					))}
				</div>

				<button
					onClick={handleSubmit}
					className="w-full bg-[#70B748] hover:bg-green-600 text-xs sm:text-base text-white font-medium py-3 px-4 rounded-lg mt-6 transition-colors">
					Selesai
				</button>
			</div>
		</div>
	);
}
