import axios from "axios";

const API_BASE_URL = "https://zf9bwtsv-8000.asse.devtunnels.ms/v1";

export interface Questionnaire {
	id: string;
	createdAt: string;
	updatedAt: string;
	title: string;
	description: string;
	status: string;
}

export interface Question {
	id: string;
	question: string;
	options: string[];
	type: string;
}

export interface QuestionnaireDetail {
	id: string;
	title: string;
	description: string;
	status: string;
	questions: Question[];
}

export interface SubmissionResponseData {
	id: string;
	questionnaireId: string;
	userId: string;
	score?: number;
	result?: string;
	submittedAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
}

const getAuthToken = (): string | null => {
	return localStorage.getItem("authToken");
};

const api = axios.create({
	baseURL: API_BASE_URL,
});

api.interceptors.request.use(
	(config) => {
		const token = getAuthToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const questionnaireService = {
	async getAllQuestionnaires(): Promise<Questionnaire[]> {
		const response = await api.get<ApiResponse<Questionnaire[]>>(
			"/questionnaire/public"
		);
		return response.data.data;
	},

	async getQuestionnaireById(id: string): Promise<QuestionnaireDetail> {
		const response = await api.get<ApiResponse<QuestionnaireDetail>>(
			`/questionnaire/${id}`
		);
		return response.data.data;
	},

	async submitAnswers(
		questionnaireId: string,
		answers: Record<string, string>
	): Promise<ApiResponse<SubmissionResponseData>> {
		const response = await api.post<ApiResponse<SubmissionResponseData>>(
			"/v1/questionnaire/submission",
			{
				questionnaireId,
				answers,
			}
		);
		return response.data;
	},
};
