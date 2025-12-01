import { Button, Tag, Tooltip } from "antd";
import { Eye } from "lucide-react";
import type { ColumnsType } from "antd/es/table";

export interface ResidentData {
    id: string;
    fullname: string;
    email: string;
    gender: "m" | "f";
    birthDate: string;
    userDetail?: {
        nik: string;
        profession: string;
    };
}

interface ResidentColumnProps {
    pagination: { current: number; pageSize: number };
    onViewDetail: (id: string) => void;
}

export const getResidentColumns = ({ 
    pagination, 
    onViewDetail 
}: ResidentColumnProps): ColumnsType<ResidentData> => [
    {
        title: 'No',
        key: 'index',
        width: 60,
        align: 'center',
        render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
        title: 'Nama Lengkap',
        dataIndex: 'fullname',
        key: 'fullname',
        render: (text) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Jenis Kelamin',
        dataIndex: 'gender',
        key: 'gender',
        width: 120,
        align: 'center',
        render: (gender: string) => (
            <Tag color={gender === 'm' ? 'blue' : 'magenta'}>
                {gender === 'm' ? 'Laki-laki' : 'Perempuan'}
            </Tag>
        ),
    },
    {
        title: 'NIK',
        key: 'nik',
        render: (_, record) => record.userDetail?.nik || "-",
    },
    {
        title: 'Aksi',
        key: 'action',
        align: 'center',
        width: 100,
        render: (_, record) => (
            <Tooltip title="Lihat Detail Warga">
                <Button 
                    type="primary" 
                    size="small"
                    className="!bg-[#70B748] !hover:bg-[#5a9639] border-none"
                    icon={<Eye size={16} />}
                    onClick={() => onViewDetail(record.id)}
                >
                    Lihat
                </Button>
            </Tooltip>
        ),
    },
];