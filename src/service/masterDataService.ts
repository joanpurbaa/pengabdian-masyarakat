import { api } from "./api";

export interface MasterData {
	id: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface SalaryRange extends MasterData {
	minRange: string;
	maxRange: string;
}

export interface RukunTetangga extends MasterData {
	RukunWargaId: string;
}

export const masterDataService = {
	getEducations: async (): Promise<MasterData[]> => {
		const response = await api.get("/v1/education");
		return response.data.data;
	},

	getMarriageStatuses: async (): Promise<MasterData[]> => {
		const response = await api.get("/v1/marriage-status");
		return response.data.data;
	},

	getRukunWarga: async (): Promise<MasterData[]> => {
		const response = await api.get("/v1/rukun-warga");
		return response.data.data;
	},

	getRukunTetangga: async (): Promise<RukunTetangga[]> => {
		const response = await api.get("/v1/rukun-tetangga");
		return response.data.data;
	},

	getSalaryRanges: async (): Promise<SalaryRange[]> => {
		const response = await api.get("/v1/salary-range");
		return response.data.data;
	},
};
