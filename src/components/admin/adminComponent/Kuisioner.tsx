import { useState } from "react";

export default function Kuisioner() {
	const [kuisioner, setKuisioner] = useState([
		{
			id: 1,
			pertanyaan: "Apakah Anda sering merasa sakit kepala?",
			jawaban: "",
			statusToggle: true,
		},
		{
			id: 2,
			pertanyaan: "Apakah Anda sering merasa stres atau cemas?",
			jawaban: "",
			statusToggle: true,
		},
		{
			id: 3,
			pertanyaan: "Apakah Anda kesulitan tidur atau mengalami insomnia?",
			jawaban: "",
			statusToggle: false,
		},
		{
			id: 4,
			pertanyaan: "Apakah Anda merasa cepat lelah tanpa alasan yang jelas?",
			jawaban: "",
			statusToggle: true,
		},
	]);

	const handleToggle = (id: number) => {
		setKuisioner((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, statusToggle: !item.statusToggle } : item
			)
		);
	};

	const handleJawabanChange = (id: number, value: string) => {
		setKuisioner((prev) =>
			prev.map((item) => (item.id === id ? { ...item, jawaban: value } : item))
		);
	};

	return (
		<div className="w-full h-full bg-gray-100 p-6 shadow-sm rounded-lg">
			<h1 className="font-semibold text-zinc-600">Kuisioner</h1>

			<div className="mt-6 space-y-6">
				{kuisioner.map((item) => (
					<div
						key={item.id}
						className="bg-white rounded-md p-4 shadow-sm border border-gray-200">
						<div className="flex items-center justify-between">
							<p className="text-zinc-700 font-medium">
								{item.id}. {item.pertanyaan}
							</p>

							<div
								onClick={() => handleToggle(item.id)}
								className={`w-[55px] h-[28px] rounded-full p-[3px] cursor-pointer transition-all duration-300 ${
									item.statusToggle ? "bg-[#5a9639]" : "bg-gray-400"
								}`}>
								<div
									className={`w-[22px] h-[22px] bg-white rounded-full transform transition-transform duration-300 ${
										item.statusToggle ? "translate-x-[27px]" : "translate-x-0"
									}`}></div>
							</div>
						</div>

						{item.statusToggle && (
							<ul className="mt-4 flex gap-5">
								<li className="space-x-1">
									<input
										type="radio"
										id={`ya-${item.id}`}
										name={`answer-${item.id}`}
										checked={item.jawaban === "Ya"}
										onChange={() => handleJawabanChange(item.id, "Ya")}
									/>
									<label className="text-zinc-700" htmlFor={`ya-${item.id}`}>
										Ya
									</label>
								</li>
								<li className="space-x-1">
									<input
										type="radio"
										id={`tidak-${item.id}`}
										name={`answer-${item.id}`}
										checked={item.jawaban === "Tidak"}
										onChange={() => handleJawabanChange(item.id, "Tidak")}
									/>
									<label className="text-zinc-700" htmlFor={`tidak-${item.id}`}>
										Tidak
									</label>
								</li>
							</ul>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
