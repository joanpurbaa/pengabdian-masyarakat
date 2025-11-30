import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation, useNavigate } from "react-router";
import { lazy, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from "axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import AdminDesaLayout from "./layouts/Admin/AdminDesa/AdminDesaLayout";
import Loading from "./pages/Loading";
import AdminDesa from "./pages/Admin/AdminDesa/Responden/AdminDesaResponden";
import AdminMedis from "./pages/Admin/AdminMedis/Responden/AdminMedisReponden";
import AdminMediLayout from "./layouts/Admin/AdminMedis/AdminMedisLayout";
import RWDashboard from "./pages/Admin/AdminMedis/Responden/RwDashboard/RwDashboard";
import RTDashboard from "./pages/Admin/AdminMedis/Responden/RtDashboard/RTDashboard";
import WargaDashboard from "./pages/Admin/AdminMedis/Responden/WargaDashboard/WargaDashboard";
import MedisResult from "./pages/Admin/AdminMedis/Responden/MedisResult/MedisResult";
import KuisionerDashboard from "./pages/Admin/AdminMedis/Kuisioner/KuisionerDashborad";
import DesaRwDashboard from "./pages/Admin/AdminDesa/Responden/DesaRwDashboard/DesaRwDashboard";
import DesaRtDashboard from "./pages/Admin/AdminDesa/Responden/DesaRtDashboard/DesaRtDashboard";
import DesaWargaDashboard from "./pages/Admin/AdminDesa/Responden/DesaWargaDashboard/DesaWargaDashboard";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const Result = lazy(() => import("./pages/Result"));
// const MedisResult = lazy(() => import("./pages/MedisResult"));
const HistorySection = lazy(() => import("./pages/HistorySection"));
const Quiz = lazy(() => import("./pages/Quiz"));

axios.defaults.withCredentials = true;

function ProtectedLayout() {
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

const router = createBrowserRouter([
	{
		path: "/",
		element: <ProtectedLayout />,
		children: [
			{
				path: "/",
				element: (
					<Home />
				),
			},
			{
				path: "/quiz/:id",
				element: (
					<Quiz />
				),
			},
			{
				path: "/result/:id",
				element: (
					<Result />
				),
			},
			// Admin routes - Home page
			{
				path: "admin",
				element: <AdminDesaLayout />,
				children: [
					{
						index: true,
						element: <Navigate to="responden" replace />
					},
					// Responden Routes
					{
						path: "responden",
						children: [
							{
								index: true,
								element: (
									<Suspense fallback={<Loading />}>
										<AdminDesa />
									</Suspense>
								)
							},
							{
								path: ":questionnaireId",
								element: (
									<DesaRwDashboard />
								),
							},
							{
								path: ":questionnaireId/:rwId",
								element: (
									<DesaRtDashboard />
								),
							},
							{
								path: ":questionnaireId/:rwId/:rtId",
								element: (
									<DesaWargaDashboard />
								),
							},
							{
								path: "/admin/responden/:rwId/:rtId",
								element: (
									<Admin />
								),
							},
							{
								path: "/admin/responden/:rwId/:rtId/:keluargaId/history",
								element: (
									<HistorySection />
								),
							},
							{
								path: "/admin/responden/:rwId/:rtId/:keluargaId",
								element: (
									<Admin />
								),
							},
							{
								path: "/admin/responden/:rwId/:rtId/:keluargaId/:anggotaName",
								element: (
									<Admin />
								),
							},
						]
					},
					// Kelola RW Routes
					{
						path: "kelola-rw",
						children: [
							{
								path: "/admin/kelola-rw/:rwId",
								element: (
									<Admin />
								),
							},
							{
								path: "/admin/kelola-rw/:rwId/:rtId",
								element: (
									<Admin />
								),
							}
						],
					},
				]
			},
			// Admin Medis routes - Home page
			{
				path: "/admin-medis",
				element: <AdminMediLayout />,
				children: [
					{
						index: true,
						element: <Navigate to="responden" replace />
					},
					// Responden Routes
					{
						path: "responden",
						children: [
							{
								index: true,
								element: (
									<AdminMedis />
								),
							},
							{
								path: ":questionnaireId",
								element: (
									<RWDashboard />
								),
							},
							{
								path: ":questionnaireId/:rwId",
								element: (
									<RTDashboard />
								),
							},
							{
								path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history",
								element: (
									<HistorySection />
								),
							},
							{
								path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history/tes",
								element: (
									<Result />
								),
							},
							{
								path: ":questionnaireId/:rwId/:rtId",
								element: (
									<WargaDashboard />
								),
							},
							{
								path: "result/:questionnaireId/:rwId/:rtId/:userId",
								element: (
									<MedisResult />
								),
							},
							{
								path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/:anggotaName",
								element: (
									<Admin />
								),
							},
						]
					},
					// Kelola RW Routes
					{
						path: "kelola-rw",
						children: [
							{
								path: "/admin-medis/kelola-rw/:rwId",
								element: (
									<Admin />
								),
							},
							{
								path: "/admin-medis/kelola-rw/:rwId/:rtId",
								element: (
									<Admin />
								),
							},
						]
					},
					{
						path: "/admin-medis/kuisioner",
						element: (
							<KuisionerDashboard />
						),
					},

				]
			},
			{
				path: "/history",
				element: (
					<HistorySection />
				),
			},
		]
	},
	{
		path: "/masuk",
		element: <Login />,
	},
	{
		path: "/daftar",
		element: <Register />,
	},
])

// const router = createBrowserRouter([
// 	{
// 		path: "/",
// 		element: (

// 			<Home />
// 		),
// 	},
// 	{
// 		path: "/masuk",
// 		element: <Login />,
// 	},
// 	{
// 		path: "/daftar",
// 		element: <Register />,
// 	},
// 	{
// 		path: "/quiz/:id",
// 		element: (
// 			<ProtectedRoute>
// 				<Quiz />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/result/:id",
// 		element: (
// 			<ProtectedRoute>
// 				<Result />
// 			</ProtectedRoute>
// 		),
// 	},
// 	// Admin routes - Home page
// 	{
// 		path: "/admin",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/responden",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/responden/:rwId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/responden/:rwId/:rtId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/responden/:rwId/:rtId/:keluargaId/history",
// 		element: (
// 			<ProtectedRoute>
// 				<HistorySection />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/responden/:rwId/:rtId/:keluargaId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/responden/:rwId/:rtId/:keluargaId/:anggotaName",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/kelola-rw",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/kelola-rw/:rwId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/kelola-rw/:rwId/:rtId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	// Admin Medis routes - Home page
// 	{
// 		path: "/admin-medis",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/kelola-rw/:rwId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/kelola-rw/:rwId/:rtId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:rwId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:rwId/:rtId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history",
// 		element: (
// 			<ProtectedRoute>
// 				<HistorySection />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history/tes",
// 		element: (
// 			<ProtectedRoute>
// 				<Result />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/:anggotaName",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/kuisioner",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/result",
// 		element: (
// 			<ProtectedRoute>
// 				<MedisResult />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/history",
// 		element: (
// 			<ProtectedRoute>
// 				<HistorySection />
// 			</ProtectedRoute>
// 		),
// 	},
// ]);

// const router = createBrowserRouter([
// 	{
// 		path: "/",
// 		element: (
// 			<ProtectedRoute>
// 				<Home />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/masuk",
// 		element: <Login />,
// 	},
// 	{
// 		path: "/daftar",
// 		element: <Register />,
// 	},
// 	{
// 		path: "/quiz/:id",
// 		element: (
// 			<ProtectedRoute>
// 				<Quiz />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/result",
// 		element: (
// 			<ProtectedRoute>
// 				<Result />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/responden",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/kelola-rw",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/kelola-rw/:rwId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin/kelola-rw/:rwId/:rtId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	// Admin Medis routes
// 	{
// 		path: "/admin-medis",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:questionnaireId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:questionnaireId/:rwId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:questionnaireId/:rwId/:rtId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/responden/:questionnaireId/:rwId/:rtId/:keluargaId",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path:
// 			"/admin-medis/responden/:questionnaireId/:rwId/:rtId/:keluargaId/:anggotaName",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path:
// 			"/admin-medis/responden/:questionnaireId/:rwId/:rtId/:keluargaId/history",
// 		element: (
// 			<ProtectedRoute>
// 				<HistorySection />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/kuisioner",
// 		element: (
// 			<ProtectedRoute>
// 				<Admin />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/admin-medis/result",
// 		element: (
// 			<ProtectedRoute>
// 				<MedisResult />
// 			</ProtectedRoute>
// 		),
// 	},
// 	{
// 		path: "/history",
// 		element: (
// 			<ProtectedRoute>
// 				<HistorySection />
// 			</ProtectedRoute>
// 		),
// 	},
// ]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</QueryClientProvider>
);
