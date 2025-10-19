import { api } from "./api";

export interface LoginData {
	email: string;
	password: string;
}

export interface RegisterData {
	fullname: string;
	email: string;
	password: string;
	gender: "m" | "f";
	profession: string;
	birthDate: string;
	MarriageStatusId: string;
	RukunWargaId: string;
	RukunTetanggaId: string;
	EducationId: string;
	SalaryRangeId: string;
	nik: string;
}

export interface AuthResponse {
  statusCode: number;
  message: string;
  data?: {
    uid: string;
    fullname: string;
    email: string;
    accessToken: string;
  };
}

export const authService = {
	login: async (loginData: LoginData): Promise<AuthResponse> => {
		const response = await api.post("/v1/auth/signin", loginData);
		return response.data;
	},

	register: async (registerData: RegisterData): Promise<AuthResponse> => {
		const response = await api.post("/v1/auth/signup", registerData);
		return response.data;
	},
};
