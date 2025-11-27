import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import MainLayout from '../MainLayout'
import { DoubleArrowIcon } from "../../../icon/doubleArrowIcon";
import AdminSideBar from "../../../components/admin/AdminSidebar";
import { RightArrowIcon } from "../../../icon/rightArrowIcon";
import { useAuth } from "../../../context/AuthContext";

function AdminDesaLayout() {
    const { logout } = useAuth();

    const [responsiveSidebar, setResponsiveSidebar] = useState(false);
    const [showLogoutText, setShowLogoutText] = useState(!responsiveSidebar);
    const [showMinimizeText, setShowMinimizeText] = useState(!responsiveSidebar);

    const navigate = useNavigate();

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

    return (
        <MainLayout>
            <aside
                className={`transition-all ease-in-out duration-300 ${responsiveSidebar ? "w-[100px]" : "w-[400px]"
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
                        <AdminSideBar
                            responsiveSidebar={responsiveSidebar}
                        // isAdminMedis={pathSegments[0] === "admin-medis"}
                        />
                    </ul>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center text-base lg:text-xl text-white font-normal ${!responsiveSidebar ? "bg-[#70B748]" : "bg-transparent"
                            } rounded-full px-[30px] lg:px-[60px] py-[8px] lg:py-[12px] gap-[10px]`}>
                        {showLogoutText && "Logout"}
                        <div
                            className={`flex justify-center items-center border ${!responsiveSidebar ? "border-white" : "border-[#70B748]"
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
            <Outlet />
        </MainLayout>
    )
}

export default AdminDesaLayout