import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const Result = lazy(() => import("./pages/Result"));
const MedisResult = lazy(() => import("./pages/MedisResult"));
const HistorySection = lazy(() => import("./pages/HistorySection"));
const Quiz = lazy(() => import("./pages/Quiz"));

axios.defaults.withCredentials = true;

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/masuk",
		element: <Login />,
	},
	{
		path: "/daftar",
		element: <Register />,
	},
	{
		path: "/quiz/:id",
		element: (
			<ProtectedRoute>
				<Quiz />
			</ProtectedRoute>
		),
	},
	{
		path: "/result",
		element: (
			<ProtectedRoute>
				<Result />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/responden",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/responden/:rwId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/responden/:rwId/:rtId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/responden/:rwId/:rtId/:keluargaId/history",
		element: (
			<ProtectedRoute>
				<HistorySection />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/responden/:rwId/:rtId/:keluargaId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/responden/:rwId/:rtId/:keluargaId/:anggotaName",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/kelola-rw",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/kelola-rw/:rwId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin/kelola-rw/:rwId/:rtId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/kelola-rw/:rwId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/kelola-rw/:rwId/:rtId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/responden",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/responden/:rwId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history",
		element: (
			<ProtectedRoute>
				<HistorySection />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history/tes",
		element: (
			<ProtectedRoute>
				<Result />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/:anggotaName",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/kuisioner",
		element: (
			<ProtectedRoute>
				<Admin />
			</ProtectedRoute>
		),
	},
	{
		path: "/admin-medis/result",
		element: (
			<ProtectedRoute>
				<MedisResult />
			</ProtectedRoute>
		),
	},
	{
		path: "/history",
		element: (
			<ProtectedRoute>
				<HistorySection />
			</ProtectedRoute>
		),
	},
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</QueryClientProvider>
);
