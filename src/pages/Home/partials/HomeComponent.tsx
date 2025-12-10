import { Button, Card, Tag } from "antd";
import { FileText, PlayCircle } from "lucide-react";

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
    disabled: boolean;
    onStart: (id: string) => void;
}

export const QuestionnaireCard = ({ id, title, description, onStart, disabled }: QuestionnaireCardProps) => {
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
                disabled={disabled}
                className="!bg-[#70B748] !hover:bg-[#5a9639] border-none h-10 font-medium flex items-center justify-center gap-2"
                onClick={() => onStart(id)}
            >
                <PlayCircle size={18} />
                Mulai Mengerjakan
            </Button>
        </Card>
    );
};