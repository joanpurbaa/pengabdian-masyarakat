import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: "admin" | "medis" | "warga";
}

export default function ProtectedRoute({
	children,
}: ProtectedRouteProps) {
	const { user, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="animate-spin text-[#70B748]" size={32} />
				<span className="ml-2 text-gray-600">Memuat...</span>
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/masuk" state={{ from: location }} replace />;
	}

	// if (requiredRole && user.role !== requiredRole) {
	//   return <Navigate to="/unauthorized" replace />;
	// }

	return <>{children}</>;
}
