import axios from "axios";
import type {
	ApiResponse,
	Questionnaire,
	QuestionnaireByIdResponse,
	SummarizeAllResponse,
	WargaResponse,
} from "../types/adminDesaService";

const API_BASE_URL = import.meta.env.VITE_API_BASE;

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

export const adminDesaService = {
	async getAllQuestionnaires(): Promise<Questionnaire[]> {
		const response = await api.get<ApiResponse<Questionnaire[]>>(
			"/v1/questionnaire/public"
		);
		return response.data.data;
	},

	async addRW(data: number) {
		const response = await api.post("/v1/rukun-warga", {
			count: data,
		});

		return response;
	},

	async addRT(data: number, rwId: string) {
		const response = await api.post("/v1/rukun-tetangga", {
			count: data,
			RukunWargaId: rwId,
		});

		return response;
	},

	async deleteRW(rwId: string) {
		const response = await api.delete(`/v1/rukun-warga/${rwId}`);

		return response;
	},

	async deleteRT(rtId: string) {
		const response = await api.delete(`/v1/rukun-tetangga/${rtId}`);

		return response;
	},

	async getRT(rwId: string) {
		const response = await api.get(`/v1/rukun-warga/${rwId}`);

		return response.data;
	},

	async getWarga(rtId: string) {
		const response = await api.get<WargaResponse>(`/v1/rukun-tetangga/${rtId}`);

		return response.data;
	},

	async summarizeAll(questionnaireId: string): Promise<SummarizeAllResponse> {
		const response = await api.get<SummarizeAllResponse>(
			`/v1/questionnaire-submission/summary/${questionnaireId}`
		);
		return response.data;
	},

	async getQuestionnaireById(
		questionnaireId: string
	): Promise<QuestionnaireByIdResponse> {
		const response = await api.get<QuestionnaireByIdResponse>(
			`/v1/questionnaire/${questionnaireId}/public`
		);
		return response.data;
	},

	async getWargaByRt(rtId: string) {
		const response = await api.get(`/v1/rukun-tetangga/${rtId}`);

		return response.data;
	},
};
