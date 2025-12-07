import { Button, Card, Tag, Avatar, type MenuProps, Dropdown } from "antd";
import { FileText, PlayCircle, LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";

interface HeaderProps {
    fullname: string;
    onLogout: () => void;
}

export const HomeHeader = ({ fullname, onLogout }: HeaderProps) => {
    const navigate = useNavigate();

    const items: MenuProps['items'] = [
        {
            key: 'profile',
            label: 'Lihat Profil Saya',
            icon: <User size={16} />,
            onClick: () => navigate('/profile'), // Navigasi ke halaman profile
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Keluar',
            icon: <LogOut size={16} />,
            danger: true,
            onClick: onLogout, // Panggil fungsi logout
        },
    ];
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img className="w-10 h-10 object-contain" src="/icon.png" alt="Logo" />
                    <span className="text-lg font-bold text-[#70B748] hidden sm:block">
                        Desa Cibiru Wetan
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 group">
                                <div className="text-right hidden md:block">
                                    <div className="text-sm font-semibold text-gray-700 group-hover:text-[#70B748] transition-colors">
                                        {fullname}
                                    </div>
                                    <div className="text-xs text-gray-500">Warga</div>
                                </div>

                                <Avatar
                                    size="large"
                                    className="bg-gray-200 text-gray-600 group-hover:bg-[#70B748] group-hover:text-white transition-colors"
                                >
                                    {fullname?.charAt(0)?.toUpperCase() || <User />}
                                </Avatar>

                                <ChevronDown size={16} className="text-gray-400 group-hover:text-[#70B748] transition-colors" />
                            </div>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>
    );
};

interface WelcomeBannerProps {
    fullname: string;
}

export const WelcomeBanner = ({ fullname }: WelcomeBannerProps) => {
    return (
        <div className="bg-gradient-to-r from-[#70B748] to-[#5a9639] rounded-2xl p-6 sm:p-10 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="relative z-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Selamat Datang, {fullname}! 👋
                </h1>
                <p className="text-white/90 text-base sm:text-lg max-w-2xl">
                    Mari jaga kesehatan mental kita bersama. Silakan pilih kuisioner yang tersedia di bawah ini untuk memulai pengecekan mandiri.
                </p>
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        </div>
    );
};

interface QuestionnaireCardProps {
    id: string;
    title: string;
    description: string;
    onStart: (id: string) => void;
}

export const QuestionnaireCard = ({ id, title, description, onStart }: QuestionnaireCardProps) => {
    return (
        <Card
            hoverable
            className="h-full flex flex-col border-gray-200 hover:border-[#70B748] transition-all duration-300 group"
            bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg group-hover:bg-[#70B748] transition-colors duration-300">
                    <FileText className="w-6 h-6 text-[#70B748] group-hover:text-white transition-colors" />
                </div>
                <Tag color="success">Aktif</Tag>
            </div>

            <div className="flex-1 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#70B748] transition-colors">
                    {title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                    {description || "Tidak ada deskripsi tersedia."}
                </p>
            </div>

            <Button
                type="primary"
                block
                size="large"
                className="!bg-[#70B748] !hover:bg-[#5a9639] border-none h-10 font-medium flex items-center justify-center gap-2"
                onClick={() => onStart(id)}
            >
                <PlayCircle size={18} />
                Mulai Mengerjakan
            </Button>
        </Card>
    );
};