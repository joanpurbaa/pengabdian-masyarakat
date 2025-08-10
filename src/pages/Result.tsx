import { useNavigate } from "react-router";
import FileHeart from "../icon/FileHeart";

export default function Result() {
	const navigate = useNavigate();

	const questions = [
		{ no: 1, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 2, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 3, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 4, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 5, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 6, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 7, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 8, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 9, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 10, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 11, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 12, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 13, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 14, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 15, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{ no: 16, question: "Apakah Anda sering merasa sakit kepala?", answer: "Ya" },
		{
			no: 17,
			question: "Apakah Anda sering merasa sakit kepala?",
			answer: "Tidak",
		},
		{
			no: 18,
			question: "Apakah Anda sering merasa sakit kepala?",
			answer: "Tidak",
		},
		{
			no: 19,
			question: "Apakah Anda sering merasa sakit kepala?",
			answer: "Tidak",
		},
		{
			no: 20,
			question: "Apakah Anda sering merasa sakit kepala?",
			answer: "Tidak",
		},
	];

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

		const yaAngle = (yaPercentage / 100) * 360;
		const tidakAngle = (tidakPercentage / 100) * 360;

		const radius = 140;
		const centerX = 150;
		const centerY = 150;

		const getCoordinatesForPercent = (percent: number) => {
			const x = Math.cos(2 * Math.PI * percent);
			const y = Math.sin(2 * Math.PI * percent);
			return [x, y];
		};

		const [yaStartX, yaStartY] = getCoordinatesForPercent(0);
		const [yaEndX, yaEndY] = getCoordinatesForPercent(yaPercentage / 100);

		const yaLargeArcFlag = yaPercentage > 50 ? 1 : 0;
		const yaPathData = [
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
		const tidakPathData = [
			`M ${centerX} ${centerY}`,
			`L ${centerX + tidakStartX * radius} ${centerY + tidakStartY * radius}`,
			`A ${radius} ${radius} 0 ${tidakLargeArcFlag} 1 ${
				centerX + tidakEndX * radius
			} ${centerY + tidakEndY * radius}`,
			"Z",
		].join(" ");

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
					{yaCount > 0 && (
						<path d={yaPathData} fill="#70B748" stroke="white" strokeWidth="2" />
					)}

					{tidakCount > 0 && (
						<path d={tidakPathData} fill="#439017" stroke="white" strokeWidth="2" />
					)}

					<circle cx={centerX} cy={centerY} r="8" fill="white" />
				</svg>

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

	const yaCount = questions.filter((q) => q.answer === "Ya").length;
	const tidakCount = questions.filter((q) => q.answer === "Tidak").length;

	const handleRepeatTheQuiz = () => {
		navigate("/");
	};

	return (
		<>
			<main className="relative">
				<img
					className="fixed -z-10 -bottom-10 sm:-bottom-20 -right-20 w-[250px] lg:w-[500px]"
					src="/berat.png"
					alt=""
				/>
				<img
					className="fixed -z-10 -bottom-5 sm:-bottom-10 -left-10 w-[150px] lg:w-[300px] scale-x-[-1]"
					src="/berat.png"
					alt=""
				/>

				<section className="relative z-10 flex flex-col lg:grid grid-cols-12 items-center px-5 sm:px-10 lg:px-0 py-10 sm:py-20 lg:py-56 gap-20 lg:gap-0">
					<div className="w-full flex flex-col items-start col-start-2 col-end-7 xl:col-end-6 2xl:col-start-3 2xl:col-end-6 space-y-3">
						<div className="flex items-center text-zinc-800 gap-2">
							<FileHeart className="w-6 sm:w-10 h-6 sm:h-10 text-zinc-800" />
							<p className="text-lg sm:text-2xl font-bold">Presentase depresi kamu</p>
						</div>
						<h1 className="text-5xl sm:text-8xl font-bold text-red-400">BERAT</h1>
						<p className="text-base sm:text-xl text-zinc-800">
							Kamu butuh bantuan dan itu nggak apa-apa. Coba hubungi tenaga profesional
							atau cerita ke orang yang kamu percaya.
						</p>
					</div>
					<div className="w-full col-start-10 col-end-12 2xl:col-start-9 2xl:col-end-11 flex justify-center items-center">
						<PieChart yaCount={yaCount} tidakCount={tidakCount} />
					</div>
				</section>

				<section className="relative z-10 px-4 pb-20">
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
								{questions.map((item, index) => (
									<div
										key={index}
										className="grid grid-cols-12 py-4 px-6 text-sm sm:text-base hover:bg-gray-50">
										<div className="col-span-1 text-center text-gray-700">{item.no}</div>
										<div className="col-span-8 text-gray-700 px-4">{item.question}</div>
										<div className="col-span-3 text-center">
											<button
												className={`px-4 py-2 rounded-md font-medium min-w-[80px] ${
													item.answer === "Ya"
														? "bg-[#70B748] text-white"
														: "bg-gray-500 text-white"
												}`}>
												{item.answer}
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
