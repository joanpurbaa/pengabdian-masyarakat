import { Navigate, useLocation }   from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: "admin" | "medis" | "warga";
}

export default function ProtectedRoute({
	children,
}: ProtectedRouteProps) {
	const { user, isLoading } = useAuth();
	const location = useLocation();
	const [tokenValid, setTokenValid] = useState(true);

	// Check if token exists in localStorage
	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token) {
			setTokenValid(false);
		}
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="animate-spin text-[#70B748]" size={32} />
				<span className="ml-2 text-gray-600">Memuat...</span>
			</div>
		);
	}

	if (!user || !tokenValid) {
		return <Navigate to="/masuk" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
