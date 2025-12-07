import { useNavigate } from "react-router";
import {
    Card, Avatar, Tag, Descriptions, Button, Skeleton, Divider, Result
} from "antd";
import {
    ArrowLeft, MapPin, Briefcase, GraduationCap,
    Phone, CreditCard, Heart, Calendar,
    Edit
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";

import { useAuth } from "../../context/AuthContext";
import { HomeHeader } from "../Home/partials/HomeComponent";
import { useResident } from "../../hooks/useResident";
import { useState } from "react";
import EditProfileModal from "./Partials/EditModal";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const {
        data: response,
        isLoading,
        isError,
        refetch
    } = useResident();

    const formatCurrency = (val: string) => {
        return parseInt(val).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        });
    };

    const handleLogout = () => {
        logout();
        navigate("/masuk");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <HomeHeader fullname={user?.fullname || "..."} onLogout={handleLogout} />
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <Skeleton.Node active style={{ width: '100%', height: 400 }} />
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton active paragraph={{ rows: 6 }} />
                            <Skeleton active paragraph={{ rows: 6 }} />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (isError || !response?.data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center w-screen">
                <Result
                    status="error"
                    title="Gagal Memuat Profil"
                    subTitle="Terjadi kesalahan saat mengambil data profil Anda."
                    extra={[
                        <Button type="primary" onClick={() => refetch()} key="retry">
                            Coba Lagi
                        </Button>,
                        <Button onClick={() => navigate("/")} key="home">
                            Kembali ke Home
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    const profile = response.data;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <HomeHeader fullname={profile.fullname} onLogout={handleLogout} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex justify-between items-center mb-6">
                    <Button
                        type="text"
                        onClick={() => navigate("/")}
                        className="hover:bg-gray-200 text-gray-600 font-medium flex items-center gap-x-2"
                    >
                        <ArrowLeft size={18} />
                        <span>
                            Kembali ke Beranda
                        </span>
                    </Button>
                    <Button
                        icon={<Edit size={16} />}
                        onClick={() => setIsEditModalOpen(true)}
                        className="border-[#70B748] text-[#70B748] hover:bg-green-50"
                    >
                        Edit Profil
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1">
                        <Card className="shadow-sm border-gray-200 rounded-2xl text-center h-full">
                            <div className="flex flex-col items-center py-6">
                                <div className="relative mb-4">
                                    <Avatar
                                        size={120}
                                        className="bg-gradient-to-br from-[#70B748] to-[#5a9639] text-white shadow-lg text-4xl font-bold"
                                    >
                                        {profile.fullname.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
                                        <Tag color={profile.gender === 'm' ? 'blue' : 'magenta'} className="m-0 px-2 rounded-full font-bold">
                                            {profile.gender === 'm' ? 'L' : 'P'}
                                        </Tag>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.fullname}</h2>
                                <p className="text-gray-500 mb-4">{profile.email}</p>

                                <Tag color="green" className="px-3 py-1 rounded-full text-sm">
                                    Warga Aktif
                                </Tag>
                            </div>

                            <Divider className="my-4" />

                            <div className="px-4 text-left space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">NIK (Nomor Induk Kependudukan)</p>
                                    <p className="font-mono text-lg font-medium text-gray-700 tracking-wide bg-gray-50 p-2 rounded border border-gray-100">
                                        {profile.userDetail.nik}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Terdaftar Pada</p>
                                    <p className="text-sm text-gray-700">
                                        {dayjs(profile.userDetail.createdAt).locale('id').format("DD MMMM YYYY")}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6 flex flex-col gap-y-5">
                        <Card
                            title={<span className="text-lg font-bold text-gray-800">Informasi Pribadi</span>}
                            className="shadow-sm border-gray-200 rounded-2xl"
                        >
                            <Descriptions column={{ xs: 1, sm: 2 }} layout="vertical" labelStyle={{ color: '#9ca3af', fontSize: '12px' }}>
                                <Descriptions.Item label="Jenis Kelamin">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        {profile.gender === "m" ? <BsGenderMale size={16} className="text-[#70B748]" /> : <BsGenderFemale size={16} className="text-[#70B748]" />}
                                        {profile.gender === "m" ? "Laki-Laki" : "Perempuan"}
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label="Tanggal Lahir">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <Calendar size={16} className="text-[#70B748]" />
                                        {dayjs(profile.birthDate).locale('id').format("DD MMMM YYYY")}
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label="Nomor Telepon">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <Phone size={16} className="text-[#70B748]" />
                                        {profile.userDetail.phoneNumber}
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label="Status Pernikahan">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <Heart size={16} className="text-[#70B748]" />
                                        {profile.userDetail.marriageStatus.name}
                                    </div>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card
                            title={<span className="text-lg font-bold text-gray-800">Data Domisili & Pekerjaan</span>}
                            className="shadow-sm border-gray-200 rounded-2xl"
                        >
                            <Descriptions column={{ xs: 1, sm: 2 }} layout="vertical" labelStyle={{ color: '#9ca3af', fontSize: '12px' }}>
                                <Descriptions.Item label="Wilayah Tinggal">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <MapPin size={16} className="text-[#70B748]" />
                                        RW {String(profile.userDetail.rukunWarga.name).padStart(2, '0')} / RT {String(profile.userDetail.rukunTetangga.name).padStart(2, '0')}
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label="Pendidikan Terakhir">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <GraduationCap size={16} className="text-[#70B748]" />
                                        {profile.userDetail.education.name}
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label="Pekerjaan">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <Briefcase size={16} className="text-[#70B748]" />
                                        {profile.userDetail.profession}
                                    </div>
                                </Descriptions.Item>

                                <Descriptions.Item label="Rentang Pendapatan">
                                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                                        <CreditCard size={16} className="text-[#70B748]" />
                                        {formatCurrency(profile.userDetail.salaryRange.minRange)} - {formatCurrency(profile.userDetail.salaryRange.maxRange)}
                                    </div>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                    </div>
                </div>

                <EditProfileModal
                    open={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={profile}
                />
            </main>
        </div>
    );
}