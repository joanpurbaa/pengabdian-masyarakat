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
			setQuestionnaires(data);
		} catch (err) {
			setError("Gagal memuat kuisioner");
			console.error("Error fetching questionnaires:", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchQuestionnaires();
	}, []);

	return {
		questionnaires,
		loading,
		error,
		refetch: fetchQuestionnaires,
	};
};
