import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE;

export interface Region {
  id: string;
  name: number | string;
}

export interface GenericOption {
  id: string;
  name: string;
}

export interface SalaryRange {
  id: string;
  minRange: string;
  maxRange: string;
}

export interface UserDetail {
  id: string;
  profession: string;
  nik: string;
  phoneNumber: string;
  rukunWarga: Region;
  rukunTetangga: Region;
  marriageStatus: GenericOption;
  education: GenericOption;
  salaryRange: SalaryRange;
  createdAt: string;
}

export interface ResidentProfile {
  id: string;
  fullname: string;
  email: string;
  gender: "m" | "f";
  birthDate: string;
  profilePicture: string;
  userDetail: UserDetail;
}

export interface UpdateProfilePayload {
  phoneNumber: string;
  profession: string;
  SalaryRangeId: string;
  EducationId: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

interface ApiResponse<T> {
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

export const residentService = {
  getResidentProfile: async () => {
    const response = await api.get<ApiResponse<ResidentProfile>>("/v1/resident/me");
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    console.log(payload);
    
    const response = await api.put("/v1/resident/me", payload);
    return response.data;
  },

  updateProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("profilePicture", file); 

    const response = await api.put("/v1/user/update/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
