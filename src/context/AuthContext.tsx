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
	RoleId: string;
}

interface AuthContextType {
	user: User | null;
	login: (data: LoginData) => Promise<any>;
	register: (data: RegisterData) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
	error: APIError | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

	useEffect(() => {
        if (user?.accessToken) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${user.accessToken}`;
        }
    }, [user]);

	const login = async (loginData: LoginData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(loginData);

            // Validasi Response
            if (response?.statusCode === 200 && response?.data) {
                const { data } = response;

                const userData: User = {
                    uid: data.uid,
                    fullname: data.fullname,
                    email: data.email,
                    accessToken: data.accessToken,
                    RoleId: data.RoleId,
                };

                setUser(userData);
                localStorage.setItem("authToken", userData.accessToken);
                localStorage.setItem("userData", JSON.stringify(userData));

                axios.defaults.headers.common["Authorization"] = `Bearer ${userData.accessToken}`;
                
                return response; 
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (err: any) {
            console.error("Login Error Catch:", err);
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
		delete axios.defaults.headers.common["Authorization"];
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
