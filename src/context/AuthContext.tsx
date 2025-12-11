import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../service/authService";
import type { LoginData, RegisterData } from "../service/authService";
import type { APIError } from "../types/ErrorFallbackType";
import { useQueryClient } from "@tanstack/react-query";

interface User {
	uid: string;
	fullname: string;
	email: string;
	accessToken: string;
	role?: string;
}

interface AuthContextType {
	user: User | null;
	login: (data: LoginData) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	error: APIError | null
	isAdminDesa: boolean;
	isAdminMedis: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
	desa: {
		email: "admin.desa@example.com",
		password: "bluestar648",
		role: "admin_desa",
	},
	medis: {
		email: "admin.medis@example.com",
		password: "bluestar648",
		role: "admin_medis",
	},
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const queryClient = useQueryClient();

	const [user, setUser] = useState<User | null>(() => {
		const token = localStorage.getItem("authToken");
		const userData = localStorage.getItem("userData");

		if (token && userData) {
			try {
				return JSON.parse(userData);
			} catch (err) {
				console.error("Error parsing initial user data:", err);
				localStorage.removeItem("authToken");
				localStorage.removeItem("userData");
			}
		}
		return null;
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<APIError | null>(null);

	const isAdminDesa =
		user?.email === ADMIN_CREDENTIALS.desa.email || user?.role === "admin_desa";
	const isAdminMedis =
		user?.email === ADMIN_CREDENTIALS.medis.email || user?.role === "admin_medis";

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		const userData = localStorage.getItem("userData");

		if (token && userData) {
			try {
				const parsedUser: User = JSON.parse(userData);
				setUser(parsedUser);
				axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			} catch (err) {
				console.error("Error parsing user data:", err);
				localStorage.removeItem("authToken");
				localStorage.removeItem("userData");
			}
		}
	}, []);

	const login = async (loginData: LoginData): Promise<void> => {
		setIsLoading(true);
		setError(null);

		try {
			let userWithRole = { ...loginData };

			if (
				loginData.email === ADMIN_CREDENTIALS.desa.email &&
				loginData.password === ADMIN_CREDENTIALS.desa.password
			) {
				userWithRole = { ...loginData, role: ADMIN_CREDENTIALS.desa.role };
			} else if (
				loginData.email === ADMIN_CREDENTIALS.medis.email &&
				loginData.password === ADMIN_CREDENTIALS.medis.password
			) {
				userWithRole = { ...loginData, role: ADMIN_CREDENTIALS.medis.role };
			}

			const response = await authService.login(userWithRole);

			if (response.statusCode === 200 && response.data) {
				const userData: User = {
					uid: response.data.uid,
					fullname: response.data.fullname,
					email: response.data.email,
					accessToken: response.data.accessToken,
					role: userWithRole.role,
				};

				setUser(userData);
				localStorage.setItem("authToken", userData.accessToken);
				localStorage.setItem("userData", JSON.stringify(userData));

				axios.defaults.headers.common[
					"Authorization"
				] = `Bearer ${userData.accessToken}`;
			} else {
				throw new Error(response.message || "Login failed");
			}
		} catch (err: any) {
			console.log("Catch Error:", err)
			setError(err as APIError);

			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (registerData: RegisterData): Promise<void> => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await authService.register(registerData);

			if (response.statusCode === 200 || response.statusCode === 201) {
				await login({
					email: registerData.email,
					password: registerData.password,
				});
			} else {
				throw new Error(response.message || "Registration failed");
			}
		} catch (err: any) {
			console.log("Catch Error:", err)
			setError(err as APIError);

			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = (): void => {
		setUser(null);
		queryClient.removeQueries();
		localStorage.removeItem("authToken");
		localStorage.removeItem("userData");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				register,
				logout,
				isLoading,
				error,
				isAdminDesa,
				isAdminMedis,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
