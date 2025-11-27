import { useNavigate, useParams } from "react-router";
import FileHeart from "../icon/FileHeart";
import { useEffect, useState } from "react";
import { questionnaireService } from "../service/questionnaireService";

interface QuestionnaireQuestion {
	questionText: string;
	questionType: string;
}

interface QuestionnaireAnswerItem {
	answerValue: string;
	questionnaireQuestion: QuestionnaireQuestion;
}

export default function Result() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [questionnaireAnswer, setQuestionnaireAnswer] = useState<
		QuestionnaireAnswerItem[]
	>([]);
	const [questionnaireId, setQuestionnaireId] = useState();
  const [questionnaireResult, setQuestionnaireResult] = useState();

	useEffect(() => {
		if (id) {
			const fetchResult = async () => {
				try {
					const response = await questionnaireService.getDetailAnswer(id);

					if (response?.data?.questionnaireAnswer) {
						const transformed = response.data.questionnaireAnswer.map(
							(item: { answerValue: string }) => ({
								...item,
								answerValue: item.answerValue === "true" ? "Ya" : "Tidak",
							})
						);

						setQuestionnaireId(response.data.QuestionnaireId);
						setQuestionnaireAnswer(transformed);
					}
				} catch (error) {
					console.error("Error fetching questionnaire:", error);
				}
			};

			fetchResult();
		}
	}, [id]);

	useEffect(() => {
		if (questionnaireId) {
			const summarizeMe = async () => {
				await questionnaireService
					.summarizeMe(questionnaireId)
					.then((data) =>
						setQuestionnaireResult(
							data.data.submissions.find((data) => data.submissionId == id)
						)
					);
			};

			summarizeMe();
		}
	}, [questionnaireId]);

	const PieChart = ({
		yaCount,
		tidakCount,
	}: {
		yaCount: number;
		tidakCount: number;
	}) => {
		const total = yaCount + tidakCount;
		const yaPercentage = total > 0 ? (yaCount / total) * 100 : 0;
		const tidakPercentage = total > 0 ? (tidakCount / total) * 100 : 0;

		const radius = 140;
		const centerX = 150;
		const centerY = 150;

		const getCoordinatesForPercent = (percent: number) => {
			const x = Math.cos(2 * Math.PI * percent);
			const y = Math.sin(2 * Math.PI * percent);
			return [x, y];
		};

		if (total === 0) {
			return (
				<div className="relative w-[300px] h-[300px] z-10 flex items-center justify-center">
					<div className="text-gray-500 text-center">
						<p>Tidak ada data</p>
					</div>
				</div>
			);
		}

		let yaPathData = "";
		let tidakPathData = "";

		if (yaCount === total) {
			const [startX, startY] = getCoordinatesForPercent(0);
			const [endX, endY] = getCoordinatesForPercent(0.999);
			yaPathData = [
				`M ${centerX} ${centerY}`,
				`L ${centerX + startX * radius} ${centerY + startY * radius}`,
				`A ${radius} ${radius} 0 1 1 ${centerX + endX * radius} ${
					centerY + endY * radius
				}`,
				"Z",
			].join(" ");
		} else if (tidakCount === total) {
			// All answers are "Tidak" - full circle
			const [startX, startY] = getCoordinatesForPercent(0);
			const [endX, endY] = getCoordinatesForPercent(0.999); // Almost full circle
			tidakPathData = [
				`M ${centerX} ${centerY}`,
				`L ${centerX + startX * radius} ${centerY + startY * radius}`,
				`A ${radius} ${radius} 0 1 1 ${centerX + endX * radius} ${
					centerY + endY * radius
				}`,
				"Z",
			].join(" ");
		} else {
			// Mixed answers
			const [yaStartX, yaStartY] = getCoordinatesForPercent(0);
			const [yaEndX, yaEndY] = getCoordinatesForPercent(yaPercentage / 100);

			const yaLargeArcFlag = yaPercentage > 50 ? 1 : 0;
			yaPathData = [
				`M ${centerX} ${centerY}`,
				`L ${centerX + yaStartX * radius} ${centerY + yaStartY * radius}`,
				`A ${radius} ${radius} 0 ${yaLargeArcFlag} 1 ${centerX + yaEndX * radius} ${
					centerY + yaEndY * radius
				}`,
				"Z",
			].join(" ");

			const [tidakStartX, tidakStartY] = getCoordinatesForPercent(
				yaPercentage / 100
			);
			const [tidakEndX, tidakEndY] = getCoordinatesForPercent(1);

			const tidakLargeArcFlag = tidakPercentage > 50 ? 1 : 0;
			tidakPathData = [
				`M ${centerX} ${centerY}`,
				`L ${centerX + tidakStartX * radius} ${centerY + tidakStartY * radius}`,
				`A ${radius} ${radius} 0 ${tidakLargeArcFlag} 1 ${
					centerX + tidakEndX * radius
				} ${centerY + tidakEndY * radius}`,
				"Z",
			].join(" ");
		}

		// Calculate label positions
		const yaAngle = (yaPercentage / 100) * 360;
		const tidakAngle = (tidakPercentage / 100) * 360;

		const yaLabelAngle = (yaAngle / 2) * (Math.PI / 180) - Math.PI / 2;
		const tidakLabelAngle =
			(yaAngle + tidakAngle / 2) * (Math.PI / 180) - Math.PI / 2;

		const yaLabelX = centerX + Math.cos(yaLabelAngle) * (radius + 50);
		const yaLabelY = centerY + Math.sin(yaLabelAngle) * (radius + 50);

		const tidakLabelX = centerX + Math.cos(tidakLabelAngle) * (radius + 50);
		const tidakLabelY = centerY + Math.sin(tidakLabelAngle) * (radius + 50);

		return (
			<div className="relative w-[300px] h-[300px] z-10">
				<svg width="300" height="300" className="transform -rotate-90">
					{/* Always show Ya path if there are Ya answers */}
					{yaCount > 0 && (
						<path d={yaPathData} fill="#70B748" stroke="white" strokeWidth="2" />
					)}

					{/* Always show Tidak path if there are Tidak answers */}
					{tidakCount > 0 && (
						<path d={tidakPathData} fill="#439017" stroke="white" strokeWidth="2" />
					)}

					<circle cx={centerX} cy={centerY} r="8" fill="white" />
				</svg>

				{/* Always show Ya label if there are Ya answers */}
				{yaCount > 0 && (
					<div
						className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold z-20"
						style={{
							left: `${yaLabelX - 25}px`,
							top: `${yaLabelY - 20}px`,
						}}>
						<div className="text-center">
							<div>Ya</div>
							<div className="text-lg">{yaCount}</div>
						</div>
						<div
							className="absolute w-2 h-2 bg-gray-800 transform rotate-45"
							style={{
								left: yaLabelX < centerX ? "100%" : "-4px",
								top: "50%",
								marginTop: "-4px",
							}}
						/>
					</div>
				)}

				{/* Always show Tidak label if there are Tidak answers */}
				{tidakCount > 0 && (
					<div
						className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-semibold z-20"
						style={{
							left: `${tidakLabelX - 45}px`,
							top: `${tidakLabelY - 20}px`,
						}}>
						<div className="text-center">
							<div>Tidak</div>
							<div className="text-lg">{tidakCount}</div>
						</div>
						<div
							className="absolute w-2 h-2 bg-gray-800 transform rotate-45"
							style={{
								left: tidakLabelX < centerX ? "94%" : "-4px",
								top: "50%",
								marginTop: "-4px",
							}}
						/>
					</div>
				)}
			</div>
		);
	};

	// Calculate counts - ensure data is loaded before filtering
	const yaCount = questionnaireAnswer.filter(
		(q) => q.answerValue === "Ya"
	).length;
	const tidakCount = questionnaireAnswer.filter(
		(q) => q.answerValue === "Tidak"
	).length;

	const handleRepeatTheQuiz = () => {
		navigate("/");
	};

	// Show loading state
	if (!questionnaireAnswer || questionnaireAnswer.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-lg text-gray-600">Memuat data...</p>
			</div>
		);
	}

	return (
		<>
			<main className="relative">
				<img
					className="fixed -z-10 -bottom-10 sm:-bottom-20 -right-20 w-[250px] lg:w-[500px]"
					src={`${questionnaireResult?.isMentalUnStable == 1 ? "/berat.png" : "/ringan.png"}`}
					alt=""
				/>
				<img
					className="fixed -z-10 -bottom-5 sm:-bottom-10 -left-10 w-[150px] lg:w-[300px] scale-x-[-1]"
					src={`${questionnaireResult?.isMentalUnStable == 1 ? "/berat.png" : "/ringan.png"}`}
					alt=""
				/>

				<section className="relative z-10 flex flex-col lg:grid grid-cols-12 items-center px-5 sm:px-10 lg:px-0 py-10 sm:py-20 lg:py-15 gap-20 lg:gap-0">
					<div className="w-full flex flex-col items-start col-start-2 col-end-7 xl:col-end-6 2xl:col-start-3 2xl:col-end-6 space-y-3">
						<div className="flex items-center text-zinc-800 gap-2">
							<FileHeart className="w-6 sm:w-10 h-6 sm:h-10 text-zinc-800" />
							<p className="text-lg sm:text-2xl font-bold">Presentase depresi kamu</p>
						</div>
						<h1
							className={`text-5xl sm:text-8xl font-bold ${
								questionnaireResult?.isMentalUnStable == 1
									? "text-red-400"
									: "text-[#439017]"
							}`}>
							{questionnaireResult?.isMentalUnStable == 1 ? "BERAT" : "RINGAN"}
						</h1>
						<p className="text-base sm:text-xl text-zinc-800">
							Kamu butuh bantuan dan itu nggak apa-apa. Coba hubungi tenaga profesional
							atau cerita ke orang yang kamu percaya.
						</p>
						{/* Debug info - remove after fixing */}
						<div className="text-xs text-gray-500 mt-2">
							<p>
								Ya: {yaCount} | Tidak: {tidakCount} | Total:{" "}
								{questionnaireAnswer.length}
							</p>
						</div>
					</div>
					<div className="w-full col-start-10 col-end-12 2xl:col-start-9 2xl:col-end-11 flex justify-center items-center">
						<PieChart yaCount={yaCount} tidakCount={tidakCount} />
					</div>
				</section>

				<section className="mt-10 relative z-10 px-4 pb-20">
					<div className="max-w-6xl mx-auto">
						<div className="bg-white rounded-lg overflow-hidden shadow-lg">
							<div className="bg-[#439017] text-white">
								<div className="grid grid-cols-12 text-sm sm:text-base py-4 px-6">
									<div className="col-span-1 text-center font-semibold">No</div>
									<div className="col-span-8 text-center font-semibold">Pertanyaan</div>
									<div className="col-span-3 text-center font-semibold">Jawaban</div>
								</div>
							</div>

							<div className="bg-white divide-y divide-gray-200">
								{questionnaireAnswer.map((item, index) => (
									<div
										key={index}
										className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
										<div className="col-span-1 text-center text-gray-700">
											{index + 1}
										</div>
										<div className="col-span-8 text-gray-700 px-4">
											{item.questionnaireQuestion.questionText}
										</div>
										<div className="col-span-3 text-center">
											<button
												className={`px-4 py-2 rounded-md font-medium min-w-[80px] ${
													item.answerValue === "Ya"
														? "bg-[#70B748] text-white"
														: "bg-gray-500 text-white"
												}`}>
												{item.answerValue}
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="flex justify-end mt-8">
							<button
								onClick={() => handleRepeatTheQuiz()}
								className="cursor-pointer bg-[#439017] hover:bg-green-600 text-white text-sm sm:text-base font-semibold px-8 py-3 rounded-lg transition-colors duration-200">
								Ulangi kuesioner
							</button>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
