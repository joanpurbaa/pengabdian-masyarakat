import { useState, useEffect } from "react";
import {
	questionnaireService,
	type Questionnaire,
} from "../service/questionnaireService";

export const useQuestionnaire = () => {
	const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchQuestionnaires = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await questionnaireService.getAllQuestionnaires();
			setQuestionnaires(data.data);
		} catch (err: any) {
			console.error("Error fetching questionnaires:", err);
			setError(err.response?.data?.message || "Gagal memuat kuisioner");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchQuestionnaires();
	}, []);

	const refetch = () => {
		fetchQuestionnaires();
	};

	return {
		questionnaires,
		loading,
		error,
		refetch,
	};
};
