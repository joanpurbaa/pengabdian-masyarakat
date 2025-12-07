import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Avatar, Tag, Button, Skeleton, Divider, Descriptions } from "antd";
import { User, Mail, Calendar, Edit, ShieldCheck, Clock } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import EditAdminProfileModal from "./Partials/EditAdminProfileModal";
import { adminDesaService } from "../../../../service/adminDesaService";


export default function AdminProfile() {
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: response, isLoading, isError } = useQuery({
        queryKey: ["admin-desa", "me"],
        queryFn: adminDesaService.getMe,
    });

    if (isLoading) {
        return <div className="p-6"><Skeleton active avatar paragraph={{ rows: 4 }} /></div>;
    }

    if (isError || !response?.data) {
        return <div className="p-6 text-center text-red-500">Gagal memuat profil admin.</div>;
    }

    const data = response?.data;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil Saya</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Card className="text-center shadow-sm rounded-xl border-gray-200">
                        <div className="flex flex-col items-center py-4">
                            <Avatar
                                size={100}
                                className="bg-[#70B748] text-4xl font-bold shadow-md"
                            >
                                {data.fullname.charAt(0).toUpperCase()}
                            </Avatar>
                            <div className="pt-5">
                                <h2 className="text-xl font-bold text-gray-800">{data.fullname}</h2>
                                <Tag color="green" className="px-3 py-1 rounded-full capitalize">
                                    {data.role.name}
                                </Tag>
                            </div>
                        </div>
                        <Divider />
                        <div className="text-left px-4 pb-2">
                            <div className="flex items-center gap-x-2 mb-2">
                                <Clock size={14} className="text-gray-300" />
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                                    Bergabung Sejak
                                </span>
                            </div>
                            <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-center">
                                <span className="text-sm font-medium text-gray-700">
                                    {dayjs(data.createdAt).locale('id').format("DD MMMM YYYY")}
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2">
                    <Card
                        title="Informasi Detail"
                        extra={
                            <Button
                                type="text"
                                icon={<Edit size={16} />}
                                className="text-[#70B748] hover:bg-green-50 font-medium"
                                onClick={() => setIsEditOpen(true)}
                            >
                                Edit Profil
                            </Button>
                        }
                        className="shadow-sm rounded-xl border-gray-200 h-full"
                    >
                        <Descriptions column={1} layout="horizontal" labelStyle={{ width: '140px', color: '#6b7280' }}>
                            <Descriptions.Item label={<span className="flex items-center gap-2"><User size={16} /> Nama Lengkap</span>}>
                                <span className="font-medium text-gray-800">{data.fullname}</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className="flex items-center gap-2"><Mail size={16} /> Email</span>}>
                                <span className="font-medium text-gray-800">{data.email}</span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className="flex items-center gap-2"><Calendar size={16} /> Tanggal Lahir</span>}>
                                <span className="font-medium text-gray-800">
                                    {dayjs(data.birthDate).locale('id').format("DD MMMM YYYY")}
                                </span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className="flex items-center gap-2"><User size={16} /> Jenis Kelamin</span>}>
                                <span className="font-medium text-gray-800">
                                    {data.gender === 'm' ? 'Laki-laki' : 'Perempuan'}
                                </span>
                            </Descriptions.Item>

                            <Descriptions.Item label={<span className="flex items-center gap-2"><ShieldCheck size={16} /> Role Akses</span>}>
                                <span className="font-medium text-gray-800 uppercase tracking-wide">
                                    {data.role.name}
                                </span>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </div>
            </div>

            <EditAdminProfileModal
                open={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                initialData={data}
            />
        </div>
    );
}