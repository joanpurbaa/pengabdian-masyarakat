import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Questionnaire } from "../../../service/questionnaireService";
import { adminDesaService } from "../../../service/adminDesaService";

export default function AdminHome() {
	const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		fetchQuestionnaires();
	}, []);

	const role = JSON.parse(localStorage.getItem("userData") || "").fullname;

	const fetchQuestionnaires = async () => {
		try {
			setLoading(true);
			const data = await adminDesaService.getAllQuestionnaires();
			setQuestionnaires(data);
		} catch (err) {
			setError("Gagal memuat data kuisioner");
			console.error("Error fetching questionnaires:", err);
		} finally {
			setLoading(false);
		}
	};

	const handleCardClick = (questionnaireId: string) => {
		navigate(`/admin-medis/responden/${questionnaireId}`);
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

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#70B748]"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="text-center text-red-600">
					<p>{error}</p>
					<button
						onClick={fetchQuestionnaires}
						className="mt-4 bg-[#70B748] text-white px-4 py-2 rounded-md hover:bg-[#5E9B3A] transition-colors">
						Coba Lagi
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800">Daftar Kuisioner</h1>
				<p className="text-gray-600 mt-2">
					Pilih kuisioner untuk melihat data responden berdasarkan RW
				</p>
			</div>

			{questionnaires.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">Tidak ada kuisioner tersedia</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{questionnaires.map((questionnaire) => (
						<div
							key={questionnaire.id}
							className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white"
							onClick={() => handleCardClick(questionnaire.id)}>
							<div className="flex justify-between items-start mb-3">
								<h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
									{questionnaire.title}
								</h3>
								{getStatusBadge(questionnaire.status)}
							</div>

							<p className="text-gray-600 text-sm mb-4 line-clamp-3">
								{questionnaire.description || "Tidak ada deskripsi"}
							</p>

							<div className="flex justify-between items-center text-xs text-gray-500">
								<span>Dibuat: {formatDate(questionnaire.createdAt)}</span>
								<span>Diupdate: {formatDate(questionnaire.updatedAt)}</span>
							</div>

							<div className="mt-4 pt-4 border-t border-gray-100">
								{role == "Admin Desa" ? (
									<a
										href={`/admin/responden/${questionnaire.id}`}
										className="w-full bg-[#70B748] text-white py-2 px-4 rounded-md hover:bg-[#5E9B3A] transition-colors text-sm font-medium">
										Lihat Data Responden
									</a>
								) : (
									<a
										href={`/admin-medis/responden/${questionnaire.id}`}
										className="w-full bg-[#70B748] text-white py-2 px-4 rounded-md hover:bg-[#5E9B3A] transition-colors text-sm font-medium">
										Lihat Data Responden
									</a>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
