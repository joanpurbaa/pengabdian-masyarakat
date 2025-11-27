import { useLocation } from "react-router";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { DoubleArrowIcon } from "../icon/doubleArrowIcon";
import { RightArrowIcon } from "../icon/rightArrowIcon";
import RWSection from "../components/admin/adminComponent/RWSection";
import { Heart, UserIcon } from "lucide-react";
import RTSection from "../components/admin/adminComponent/RTSection";
import KeluargaSection from "../components/admin/adminComponent/WargaSection";
import Kuisioner from "../components/admin/adminComponent/Kuisioner";
import KelolaRwSection from "../components/admin/adminComponent/KelolaRwSection";
import KelolaRtSection from "../components/admin/adminComponent/KelolaRtSection";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import AdminHome from "../components/admin/adminComponent/AdminHome";
import WargaSection from "../components/admin/adminComponent/WargaSection";

export default function Admin() {
	const location = useLocation().pathname;
	const pathSegments = location.split("/").filter(Boolean);
	const { user, logout, isAdminDesa, isAdminMedis } = useAuth();
	const navigate = useNavigate();

	const [responsiveSidebar, setResponsiveSidebar] = useState(false);
	const [showLogoutText, setShowLogoutText] = useState(!responsiveSidebar);
	const [showMinimizeText, setShowMinimizeText] = useState(!responsiveSidebar);

	useEffect(() => {
		const isAdminRoute = pathSegments[0] === "admin";
		const isAdminMedisRoute = pathSegments[0] === "admin-medis";

		if (
			isAdminRoute &&
			!isAdminDesa &&
			user?.email !== "admin.desa@example.com"
		) {
			navigate("/masuk");
		}

		if (
			isAdminMedisRoute &&
			!isAdminMedis &&
			user?.email !== "admin.medis@example.com"
		) {
			navigate("/masuk");
		}
	}, [pathSegments, isAdminDesa, isAdminMedis, user, navigate]);

	function handleMobileResponsive() {
		setResponsiveSidebar(!responsiveSidebar);
	}

	useEffect(() => {
		let delay: ReturnType<typeof setTimeout> | undefined;

		if (responsiveSidebar) {
			setShowLogoutText(false);
			setShowMinimizeText(false);
		} else {
			delay = setTimeout(() => {
				setShowLogoutText(true);
				setShowMinimizeText(true);
			}, 100);
		}

		return () => clearTimeout(delay);
	}, [responsiveSidebar]);

	const handleLogout = () => {
		logout();
		navigate("/masuk");
	};

	const renderMainContent = () => {
		const currentSection = pathSegments[1];

		if (currentSection === "kuisioner") {
			return <Kuisioner />;
		}

		if (currentSection === "kelola-rw") {
			if (pathSegments.length === 2) {
				return <KelolaRwSection />;
			}
			if (pathSegments.length === 3) {
				const rwId = pathSegments[2];
				return <KelolaRtSection rwId={rwId} />;
			}
			if (pathSegments.length === 4) {
				const rwId = pathSegments[2];
				const rtId = pathSegments[3];
				return <WargaSection rwId={rwId} rtId={rtId} questionnaireId={""} />;
			}
		}

		if (currentSection === "responden") {
			// Tampilkan RespondenHome ketika di /admin-medis/responden
			if (pathSegments.length === 2) {
				return <AdminHome />;
			}
			if (pathSegments.length === 3) {
				const questionnaireId = pathSegments[2];
				return <RWSection questionnaireId={questionnaireId} />;
			}
			if (pathSegments.length === 4) {
				const questionnaireId = pathSegments[2];
				const rwId = pathSegments[3];
				return <RTSection questionnaireId={questionnaireId} rwId={rwId} />;
			}
			if (pathSegments.length === 5) {
				const questionnaireId = pathSegments[2];
				const rwId = pathSegments[3];
				const rtId = pathSegments[4];
				return (
					<KeluargaSection
						questionnaireId={questionnaireId}
						rwId={rwId}
						rtId={rtId}
					/>
				);
			}
		}

		// Default fallback
		return <div>Halaman tidak ditemukan</div>;
	};

	const getHeaderTitle = () => {
		if (pathSegments[0] === "admin-medis") {
			return "Tes Kesehatan Mental - Medis";
		}
		return "Tes Kesehatan Mental";
	};

	const getUserDisplayName = () => {
		if (user?.email === "admin.desa@example.com") {
			return "Admin Desa";
		} else if (user?.email === "admin.medis@example.com") {
			return "Admin Medis";
		}
		return user?.fullname || "User";
	};

	return (
		<section className="h-screen flex flex-col overflow-hidden">
			<header className="z-20 fixed w-full bg-gray-100 text-white flex justify-between items-center p-[20px] shadow-xs">
				<section>
					<a className="flex items-center space-x-4 cursor-pointer" href="/">
						<Heart className="fill-[#70B748] text-[#70B748] w-10 h-10" />
						<div className="text-[#70B748] text-base lg:text-[24px] font-bold">
							{getHeaderTitle()}
						</div>
					</a>
				</section>
				<section className="flex justify-end items-center gap-[15px] md:gap-[30px]">
					<div className="flex items-center gap-3">
						<h3 className="text-zinc-800 text-base lg:text-xl font-medium">
							{getUserDisplayName()}
						</h3>
						<UserIcon className="w-7 h-7 text-zinc-800" />
					</div>
				</section>
			</header>
			<section className="h-full flex bg-[#0B0D12]">
				<aside
					className={`transition-all ease-in-out duration-300 ${
						responsiveSidebar ? "w-[100px]" : "w-[400px]"
					} py-[40px] h-full bg-gray-100 shadow-2xl flex flex-col justify-between p-[20px]`}>
					<div className="flex flex-col justify-between gap-20">
						<div></div>
						<ul className="space-y-[20px]">
							<li
								onClick={handleMobileResponsive}
								className="flex justify-center items-center text-zinc-600 text-sm md:text-base gap-[10px] md:gap-[20px] py-[10px] cursor-pointer">
								{showMinimizeText && "Minimize Sidebar"}
								{!responsiveSidebar ? (
									<DoubleArrowIcon className="w-6 lg:w-7" />
								) : (
									<div className="rotate-180">
										<DoubleArrowIcon className="w-6 lg:w-7" />
									</div>
								)}
							</li>
							<AdminSidebar
								responsiveSidebar={responsiveSidebar}
								// isAdminMedis={pathSegments[0] === "admin-medis"}
							/>
						</ul>
					</div>
					<div className="flex justify-center">
						<button
							onClick={handleLogout}
							className={`flex items-center text-base lg:text-xl text-white font-normal ${
								!responsiveSidebar ? "bg-[#70B748]" : "bg-transparent"
							} rounded-full px-[30px] lg:px-[60px] py-[8px] lg:py-[12px] gap-[10px]`}>
							{showLogoutText && "Logout"}
							<div
								className={`flex justify-center items-center border ${
									!responsiveSidebar ? "border-white" : "border-[#70B748]"
								} border-full rounded-full w-[36px] h-[36px]`}>
								{!responsiveSidebar ? (
									<RightArrowIcon className="w-3 lg:w-5" fill="white" />
								) : (
									<RightArrowIcon className="w-3 lg:w-5" fill="#70B748" />
								)}
							</div>
						</button>
					</div>
				</aside>
				<main
					className={`w-full overflow-y-auto bg-gray-200 ${
						responsiveSidebar ? "col-span-11 w-full" : "col-span-10"
					} flex flex-col gap-[20px] px-[20px] pt-28 pb-5`}>
					{renderMainContent()}
				</main>
			</section>
		</section>
	);
}
