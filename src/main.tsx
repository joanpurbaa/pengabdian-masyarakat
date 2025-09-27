import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from "axios";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const Result = lazy(() => import("./pages/Result"));
const MedisResult = lazy(() => import("./pages/MedisResult"));
const HistorySection = lazy(() => import("./pages/HistorySection"));

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
		path: "/result",
		element: <Result />,
	},
	{
		path: "/admin/responden",
		element: <Admin />,
	},
	{
		path: "/admin/responden/:rwId",
		element: <Admin />,
	},
	{
		path: "/admin/responden/:rwId/:rtId",
		element: <Admin />,
	},
	{
		path: "/admin/responden/:rwId/:rtId/:keluargaId/history",
		element: <HistorySection />,
	},
	{
		path: "/admin/responden/:rwId/:rtId/:keluargaId",
		element: <Admin />,
	},
	{
		path: "/admin/responden/:rwId/:rtId/:keluargaId/:anggotaName",
		element: <Admin />,
	},
	{
		path: "/admin/kelola-rw",
		element: <Admin />,
	},
	{
		path: "/admin/kelola-rw/:rwId",
		element: <Admin />,
	},
	{
		path: "/admin/kelola-rw/:rwId/:rtId",
		element: <Admin />,
	},
	{
		path: "/admin-medis/responden",
		element: <Admin />,
	},
	{
		path: "/admin-medis/responden/:rwId",
		element: <Admin />,
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId",
		element: <Admin />,
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history",
		element: <HistorySection />,
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId",
		element: <Admin />,
	},
	{
		path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/:anggotaName",
		element: <Admin />,
	},
	{
		path: "/admin-medis/kuisioner",
		element: <Admin />,
	},
	{
		path: "/admin-medis/result",
		element: <MedisResult />,
	},
	{
		path: "/history",
		element: <HistorySection />,
	},
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<AuthProvider>
			<StrictMode>
				<RouterProvider router={router} />
			</StrictMode>
		</AuthProvider>
	</QueryClientProvider>
);
