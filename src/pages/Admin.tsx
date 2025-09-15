import { useLocation } from "react-router";
import AdminSidebar from "../components/admin/AdminSidebar";
import { useEffect, useState } from "react";
import { DoubleArrowIcon } from "../icon/doubleArrowIcon";
import { RightArrowIcon } from "../icon/rightArrowIcon";
import RWSection from "../components/admin/adminComponent/RWSection";
import { Heart, UserIcon } from "lucide-react";
import RTSection from "../components/admin/adminComponent/RTSection";
import KeluargaSection from "../components/admin/adminComponent/KeluargaSection";
import DetailKeluargaSection from "../components/admin/adminComponent/DetailKeluargaSection";
import DetailAnggotaKeluargaSection from "../components/admin/adminComponent/DetailAnggotaKeluargaSection";
import KelolaRwRt from "../components/admin/adminComponent/KelolaRwSection";
import KelolaRt from "../components/admin/adminComponent/KelolaRtsection";

export default function Admin() {
	const location = useLocation().pathname;
	const pathSegments = location.split("/").filter(Boolean);

	const [responsiveSidebar, setResponsiveSidebar] = useState(false);
	const [showLogoutText, setShowLogoutText] = useState(!responsiveSidebar);
	const [showMinimizeText, setShowMinimizeText] = useState(!responsiveSidebar);

	function handleMobileResponsive() {
		setResponsiveSidebar(!responsiveSidebar);
	}

	useEffect(() => {
		let delay: number;

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

	const renderMainContent = () => {
		const currentSection = pathSegments[1];

		if (currentSection === "kelola-rw") {
			if (pathSegments.length === 2) {
				return <KelolaRwRt />;
			}
			if (pathSegments.length === 3) {
				const rwId = pathSegments[2];
				return <KelolaRt rwId={rwId} />;
			}
			if (pathSegments.length === 4) {
				const rwId = pathSegments[2];
				const rtId = pathSegments[3];
				return <KeluargaSection rwId={rwId} rtId={rtId} />;
			}
		}

		if (currentSection === "responden") {
			if (pathSegments.length === 2) {
				return <RWSection />;
			}
			if (pathSegments.length === 3) {
				const rwId = pathSegments[2];
				return <RTSection rwId={rwId} />;
			}
			if (pathSegments.length === 4) {
				const rwId = pathSegments[2];
				const rtId = pathSegments[3];
				return <KeluargaSection rwId={rwId} rtId={rtId} />;
			}
			if (pathSegments.length === 5) {
				const rwId = pathSegments[2];
				const rtId = pathSegments[3];
				const keluargaId = pathSegments[4];
				return (
					<DetailKeluargaSection rwId={rwId} rtId={rtId} keluargaId={keluargaId} />
				);
			}
			if (pathSegments.length === 6) {
				const rwId = pathSegments[2];
				const rtId = pathSegments[3];
				const keluargaId = pathSegments[4];
				const anggotaName = pathSegments[5];
				return (
					<DetailAnggotaKeluargaSection
						rwId={rwId}
						rtId={rtId}
						keluargaId={keluargaId}
						anggotaName={anggotaName}
					/>
				);
			}
		}

		return <RWSection />;
	};

	return (
		<>
			<section className="h-screen flex flex-col overflow-hidden">
				<header className="fixed w-full bg-[#70B748] text-white flex justify-between items-center p-[20px] px-[40px]">
					<section>
						<a className="flex items-center space-x-4 cursor-pointer" href="/">
							<Heart className="fill-white w-10 h-10" />
							<div className="text-base lg:text-[24px] font-semibold">Abdimas</div>
						</a>
					</section>
					<section className="flex items-center gap-[15px] md:gap-[30px]">
						<div className="flex items-center gap-3">
							<h3 className="text-base lg:text-xl font-medium">Sodikin</h3>
							<UserIcon className="w-7 h-7" />
						</div>
						<img
							className="w-[56px]"
							src="/assets/logo/business-units/ltw-logo.webp"
							alt=""
						/>
					</section>
				</header>
				<section className="h-full flex bg-[#0B0D12]">
					<aside
						className={`transition-all ease-in-out duration-300 ${
							responsiveSidebar ? "w-[100px]" : "w-[400px]"
						} py-[40px] h-full bg-[#70B748] flex flex-col justify-between p-[20px]`}>
						<div className="flex flex-col justify-between gap-20">
							<div></div>
							<ul className="space-y-[20px]">
								<li
									onClick={handleMobileResponsive}
									className="flex justify-center items-center text-white text-sm md:text-base gap-[10px] md:gap-[20px] py-[10px] cursor-pointer">
									{showMinimizeText && "Minimize Sidebar"}
									{!responsiveSidebar ? (
										<DoubleArrowIcon className="w-6 lg:w-7" />
									) : (
										<div className="rotate-180">
											<DoubleArrowIcon className="w-6 lg:w-7" />
										</div>
									)}
								</li>
								<AdminSidebar responsiveSidebar={responsiveSidebar} />
							</ul>
						</div>
						<div className="flex justify-center">
							<a
								href="/masuk"
								className={`flex items-center text-base lg:text-xl text-white font-normal ${
									!responsiveSidebar && "border-[2px] border-white"
								} rounded-full px-[30px] lg:px-[60px] py-[8px] lg:py-[12px] gap-[10px]`}>
								{showLogoutText && "Logout"}
								<div className="flex justify-center items-center border border-white border-full rounded-full w-[36px] h-[36px]">
									<RightArrowIcon className="w-3 lg:w-5" fill="white" />
								</div>
							</a>
						</div>
					</aside>
					<main
						className={`w-full overflow-y-auto bg-white ${
							responsiveSidebar ? "col-span-11 w-full" : "col-span-10"
						} flex flex-col gap-[20px] px-[20px] pt-28 pb-5`}>
						{renderMainContent()}
					</main>
				</section>
			</section>
		</>
	);
}
