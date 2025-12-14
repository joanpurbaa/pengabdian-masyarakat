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
		let delay: ReturnType<typeof setTimeout> | undefined;

		if (responsiveSidebar) {
			setSectionLabel(false);
		} else {
			delay = setTimeout(() => {
				setSectionLabel(true);
			}, 100);
		}

		return () => {
			if (delay) clearTimeout(delay);
		};
	}, [responsiveSidebar]);

	return (
		<>
			<Link
				className="block"
				to={
					pathSegments[0] == "admin" ? "/admin/responden" : "/admin-medis/responden"
				}>
				<li
					className={`flex ${responsiveSidebar && "justify-center"} items-center ${
						currentSection === "responden"
							? "bg-[#70B748] text-white text-base"
							: "bg-transparent text-zinc-600 hover:text-[#70B748] text-base font-normal"
					} gap-[20px] p-[10px] rounded-[8px]`}>
					<FileHeartIcon className="w-6 h-6" />
					{sectionLabel && (
						<span className="text-sm lg:text-base whitespace-nowrap transition-opacity duration-200">
							Responden
						</span>
					)}
				</li>
			</Link>
			<Link
				className="block"
				to={
					pathSegments[0] == "admin" ? "/admin/kelola-wilayah" : "/admin-medis/kuisioner"
				}>
				<li
					className={`flex ${responsiveSidebar && "justify-center"} items-center ${
						currentSection === "kelola-wilayah" || currentSection === "kuisioner"
							? "bg-[#70B748] text-white text-base"
							: "bg-transparent text-zinc-600 hover:text-[#70B748] text-base font-normal"
					} gap-[20px] p-[10px] rounded-[8px]`}>
					{pathSegments[0] === "admin" ? (
						<HouseIcon className="w-6 h-6" />
					) : (
						<File className="w-6 h-6" />
					)}
					{sectionLabel && (
						<span className="text-sm lg:text-base whitespace-nowrap transition-opacity duration-200">
							{pathSegments[0] === "admin" ? "Kelola Wilayah" : "Kuisioner"}
						</span>
					)}
				</li>
			</Link>
		</>
	);
}
