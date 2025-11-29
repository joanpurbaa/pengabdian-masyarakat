import { Dropdown, Layout, type MenuProps } from 'antd';
import { Heart, UserIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const { Header } = Layout;

const items: MenuProps['items'] = [
    {
        key: 'profile-key',
        label: (
            <p>Profile</p>
        ),
    },
    {
        key: 'logout-btn',
        danger: true,
        label: 'Logout',
        icon: <RiLogoutCircleRLine className='w-5 h-5' />
    },
];

const ProfileComponent = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate("/masuk");
    };

    const onMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'logout-btn') {
            handleLogout();
        }
    };

    return (
        <section className="flex justify-end items-center gap-[15px] md:gap-[30px]">
            <Dropdown menu={{ items, onClick: onMenuClick }}>
                <div className="flex items-center gap-3 cursor-pointer">
                    <h3 className="hidden sm:block text-zinc-800 text-sm lg:text-base font-medium">
                        {user?.fullname || "User"}
                    </h3>
                    <UserIcon className="w-6 h-6 text-zinc-800" />
                </div>
            </Dropdown>
        </section>
    )
}

interface MainLayoutProps {
    children: ReactNode;
    title: string;
    startAction?: ReactNode;
}

function MainLayout(props: MainLayoutProps) {
    const { children, title, startAction } = props

    return (
        <Layout className='h-screen w-screen overflow-hidden'>
            <Header className="w-full !bg-white text-white flex justify-between items-center !px-4 !py-3 !md:p-[20px] !shadow-sm z-20 relative h-auto min-h-[64px]">
                <section className="flex items-center gap-3">
                    {startAction && (
                        <div className="mr-1">
                            {startAction}
                        </div>
                    )}

                    {!startAction && <a className="flex items-center space-x-2 md:space-x-4 cursor-pointer" href="/">
                        <Heart className="fill-[#70B748] text-[#70B748] w-8 h-8 md:w-10 md:h-10 shrink-0" />
                        <div className="text-[#70B748] text-base md:text-lg lg:text-[24px] font-bold leading-tight">
                            {title}
                        </div>
                    </a>}
                </section>
                <ProfileComponent />
            </Header>
            <Layout className='h-full overflow-hidden'>
                {children}
            </Layout>
        </Layout >
    )
}

export default MainLayout