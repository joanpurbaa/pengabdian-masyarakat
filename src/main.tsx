import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const Result = lazy(() => import("./pages/Result"));

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
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
