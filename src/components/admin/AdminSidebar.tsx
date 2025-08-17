import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { FileHeartIcon, HouseIcon } from "lucide-react";

export default function AdminSideBar({
	responsiveSidebar,
}: {
	responsiveSidebar: boolean;
}) {
	const [sectionLabel, setSectionLabel] = useState<boolean>(!responsiveSidebar);
	const location = useLocation().pathname;

	// Pake localStorage -> get role (admin/super-admin)
	const userRole = localStorage.getItem("userRole");

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
			{userRole === "super-admin" && (
				<>
					<hr className="border-white" />
					<Link className="block" to={"/admin"}>
						<li
							className={`flex ${responsiveSidebar && "justify-center"} items-center ${
								location.split("/")[1] == "admin"
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
				</>
			)}
			<hr className="border-white" />
			<Link className="block" to={"/admin?panel=about-us"}>
				<li
					className={`flex ${responsiveSidebar && "justify-center"} items-center ${
						location.split("/")[1] == "about-us"
							? "bg-[#439017] text-white text-base"
							: "bg-transparent text-white text-base font-normal"
					} gap-[20px] p-[10px] rounded-[8px]`}>
					<HouseIcon className="w-6 h-6" />
					{sectionLabel && (
						<span className="text-sm lg:text-base whitespace-nowrap transition-opacity duration-200">
							Kelola RW dan RT
						</span>
					)}
				</li>
			</Link>
		</>
	);
}
