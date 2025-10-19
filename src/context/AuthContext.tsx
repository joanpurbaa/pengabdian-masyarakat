import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../service/authService";
import type { LoginData, RegisterData } from "../service/authService";

interface User {
	uid: string;
	fullname: string;
	email: string;
	accessToken: string;
}

interface AuthContextType {
	user: User | null;
	login: (data: LoginData) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
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
	const [error, setError] = useState<string | null>(null);

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
			const response = await authService.login(loginData);

			if (response.statusCode === 200 && response.data) {
				const userData: User = {
					uid: response.data.uid,
					fullname: response.data.fullname,
					email: response.data.email,
					accessToken: response.data.accessToken,
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
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : "Login failed";
			setError(errorMessage);
			throw new Error(errorMessage);
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
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error ? err.message : "Registration failed";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = (): void => {
		setUser(null);
		localStorage.removeItem("authToken");
		localStorage.removeItem("userData");
	};

	return (
		<AuthContext.Provider
			value={{ user, login, register, logout, isLoading, error }}>
			{children}
		</AuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
