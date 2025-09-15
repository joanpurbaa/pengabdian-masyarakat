import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { File, FileHeartIcon, HouseIcon } from "lucide-react";

export default function AdminSideBar({
	responsiveSidebar,
}: {
	responsiveSidebar: boolean;
}) {
	const [sectionLabel, setSectionLabel] = useState<boolean>(!responsiveSidebar);
	const location = useLocation();
	const currentSection = location.pathname.split("/")[2];
	const pathSegments = useLocation().pathname.split("/").filter(Boolean);

	useEffect(() => {
		let delay: number;

		if (responsiveSidebar) {
			setSectionLabel(false);
		} else {
			delay = setTimeout(() => {
				setSectionLabel(true);
			}, 100);
		}

		return () => clearTimeout(delay);
	}, [responsiveSidebar]);

	return (
		<>
			<hr className="border-white" />
			<Link
				className="block"
				to={
					pathSegments[0] == "admin" ? "/admin/responden" : "/admin-medis/responden"
				}>
				<li
					className={`flex ${responsiveSidebar && "justify-center"} items-center ${
						currentSection === "responden"
							? "bg-[#439017] text-white text-base"
							: "bg-transparent text-white text-base font-normal"
					} gap-[20px] p-[10px] rounded-[8px]`}>
					<FileHeartIcon className="w-6 h-6" />
					{sectionLabel && (
						<span className="text-sm lg:text-base whitespace-nowrap transition-opacity duration-200">
							Responden
						</span>
					)}
				</li>
			</Link>
			<hr className="border-white" />
			<Link
				className="block"
				to={
					pathSegments[0] == "admin" ? "/admin/kelola-rw" : "/admin-medis/kuisioner"
				}>
				<li
					className={`flex ${responsiveSidebar && "justify-center"} items-center ${
						currentSection === "kelola-rw" || currentSection === "kuisioner"
							? "bg-[#439017] text-white text-base"
							: "bg-transparent text-white text-base font-normal"
					} gap-[20px] p-[10px] rounded-[8px]`}>
					{pathSegments[0] === "admin" ? (
						<HouseIcon className="w-6 h-6" />
					) : (
						<File className="w-6 h-6" />
					)}
					{sectionLabel && (
						<span className="text-sm lg:text-base whitespace-nowrap transition-opacity duration-200">
							{pathSegments[0] === "admin" ? "Kelola RW dan RT" : "Kuisioner"}
						</span>
					)}
				</li>
			</Link>
		</>
	);
}
