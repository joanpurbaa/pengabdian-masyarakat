import { useNavigate } from "react-router";
import { useQuestionnaire } from "../hooks/useQuestionnaire";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
	const navigate = useNavigate();
	const { questionnaires, loading, error, refetch } = useQuestionnaire();
	const { user, logout } = useAuth();

	useEffect(() => {
		if (error && error.includes("Gagal memuat kuisioner")) {
			const timer = setTimeout(() => {
				refetch();
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [error, refetch]);

	const handleLogout = () => {
		logout();
		navigate("/masuk");
	};

	const handleStartQuiz = (quizId: string) => {
		navigate(`/quiz/${quizId}`);
	};

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token && user) {
			logout();
		}
	}, [user, logout]);

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

			<main className="w-full px-4 sm:px-8 lg:px-52">
				<section className="mt-10 bg-gray-100 p-6 sm:p-10 rounded-md shadow-sm">
					<h2 className="text-xl sm:text-2xl font-bold">
						Selamat datang {user?.fullname || "User"} 👋
					</h2>
					<p className="mt-2 text-sm sm:text-base">Ayo kerjakan kuisioner mu!</p>

					{questionnaires.length === 0 ? (
						<div className="mt-5 text-center py-8">
							<p className="text-gray-600">Tidak ada kuisioner tersedia saat ini.</p>
						</div>
					) : (
						<div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
							{questionnaires.map((quiz) => (
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
			</main>
		</>
	);
}
