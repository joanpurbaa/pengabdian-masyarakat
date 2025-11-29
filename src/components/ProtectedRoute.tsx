import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function ProtectedRoute() {
	const token = localStorage.getItem("authToken");
	const { user, isLoading, logout } = useAuth();

	const location = useLocation();
	const navigate = useNavigate()

	// Add new logic for multi-tab sync
	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === 'authToken' && !event.newValue) {
				logout()
				navigate("/masuk")
			}
		}

		window.addEventListener("storage", handleStorageChange)
		return () => window.removeEventListener("storage", handleStorageChange)
	}, [logout, navigate])

	// Check if token exists in localStorage
	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (user && !token) {
			logout()
		}
	}, [user, logout, location]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="animate-spin text-[#70B748]" size={32} />
				<span className="ml-2 text-gray-600">Memuat...</span>
			</div>
		);
	}

	if (!user || !token) {
		return <Navigate to="/masuk" state={{ from: location }} replace />;
	}

	return <Outlet />;
}
