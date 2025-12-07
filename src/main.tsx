import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router";
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
import KelolaWilayah from "./pages/Admin/AdminDesa/KelolaWilayah/KelolaWilayah";
import Submissions from "./pages/Admin/AdminMedis/Responden/Submissions/Submissions";
import Home from "./pages/Home/Home";
import KuisionerPreview from "./pages/Admin/AdminMedis/Kuisioner/KuisionerPreviews";
import { ConfigProvider } from "antd";
import idID from "antd/locale/id_ID";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const Result = lazy(() => import("./pages/Result/Result"));
const HistorySection = lazy(() => import("./pages/HistorySection"));
const Quiz = lazy(() => import("./pages/Quiz/Quiz"));

axios.defaults.withCredentials = true;

const antdTheme = {
  token: {
    colorPrimary: "#70B748",
    borderRadius: 6,
  },
  components: {
    Input: {
      activeBorderColor: "#70B748",
      hoverBorderColor: "#70B748",
    },
    Button: {
      colorPrimary: "#70B748",
      colorPrimaryHover: "#5a9639",
    }
  }
};

function ProtectedLayout() {
  const token = localStorage.getItem("authToken");
  const { user, isLoading, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  // Add new logic for multi-tab sync
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken" && !event.newValue) {
        logout();
        navigate("/masuk");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout, navigate]);

  // Check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (user && !token) {
      logout();
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
        element: <Home />,
      },
      {
        path: "/quiz/:id",
        element: <Quiz />,
      },
      {
        path: "/result/:id",
        element: <Result />,
      },
      // Admin routes - Home page
      {
        path: "admin",
        element: <AdminDesaLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="responden" replace />,
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
                ),
              },
              {
                path: ":questionnaireId",
                element: <DesaRwDashboard />,
              },
              {
                path: ":questionnaireId/:rwId",
                element: <DesaRtDashboard />,
              },
              {
                path: ":questionnaireId/:rwId/:rtId",
                element: <DesaWargaDashboard />,
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
            ],
          },
          // Kelola Wilayah Routes
          {
            path: "kelola-wilayah",
            children: [
              {
                index: true,
                element: (
                  <Suspense fallback={<Loading />}>
                    <KelolaWilayah />
                  </Suspense>
                ),
              },
              {
                path: "kelola-wilayah",
                element: (
                  <Suspense fallback={<Loading />}>
                    <KelolaWilayah />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // Admin Medis routes - Home page
      {
        path: "/admin-medis",
        element: <AdminMediLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="responden" replace />,
          },
          // Responden Routes
          {
            path: "responden",
            children: [
              {
                index: true,
                element: <AdminMedis />,
              },
              {
                path: ":questionnaireId",
                element: <RWDashboard />,
              },
              {
                path: ":questionnaireId/:rwId",
                element: <RTDashboard />,
              },
              {
                path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history",
                element: <HistorySection />,
              },
              {
                path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/history/tes",
                element: <Result />,
              },
              {
                path: ":questionnaireId/:rwId/:rtId",
                element: <WargaDashboard />,
              },
              {
                path: "submissions/:questionnaireId/:rwId/:rtId/:userId",
                element: <Submissions />,
              },
              {
                path: "result/:questionnaireId/:rwId/:rtId/:userId",
                element: <MedisResult />,
              },
              {
                path: "/admin-medis/responden/:rwId/:rtId/:keluargaId/:anggotaName",
                element: <Admin />,
              },
            ],
          },
          // Kelola RW Routes
          {
            path: "kelola-rw",
            children: [
              {
                path: "/admin-medis/kelola-rw/:rwId",
                element: <Admin />,
              },
              {
                path: "/admin-medis/kelola-rw/:rwId/:rtId",
                element: <Admin />,
              },
            ],
          },
          {
            path: "/admin-medis/kuisioner",
            element: <KuisionerDashboard />,
          },
          {
            path: "/admin-medis/kuisioner/:questionnaireId/preview",
            element: <KuisionerPreview />,
          },
        ],
      },
      {
        path: "/history",
        element: <HistorySection />,
      },
    ],
  },
  {
    path: "/masuk",
    element: <Login />,
  },
  {
    path: "/daftar",
    element: <Register />,
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConfigProvider theme={antdTheme} locale={idID}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);
