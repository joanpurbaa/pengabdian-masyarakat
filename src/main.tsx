import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Result from "./pages/Result";
import Admin from "./pages/Admin";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

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
	{ path: "/admin", element: <Admin /> },
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>
);
