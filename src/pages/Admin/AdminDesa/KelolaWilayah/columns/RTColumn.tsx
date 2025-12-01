import { Button, Popconfirm } from "antd";
import { Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { RukunTetangga } from "../../../../../types/adminDesaService";

interface RTColumnProps {
    onDelete: (id: string) => void;
}

export const getRTColumns = ({ onDelete }: RTColumnProps): ColumnsType<RukunTetangga> => [
    {
        title: 'No',
        key: 'index',
        width: 70,
        align: 'center',
        render: (_, __, index) => index + 1,
    },
    {
        title: 'Nama RT',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <span className="font-medium">RT {text}</span>,
    },
    {
        title: 'Total Warga',
        dataIndex: 'userCount',
        key: 'userCount',
        align: 'center',
    },
    {
        title: 'Aksi',
        key: 'action',
        align: 'center',
        width: 100,
        render: (_, record) => (
            <Popconfirm 
                title="Hapus RT" 
                description="Yakin ingin menghapus RT ini?"
                onConfirm={() => onDelete(record.id)}
                okText="Ya"
                cancelText="Batal"
                okButtonProps={{ danger: true }}
            >
                <Button danger size="small" icon={<Trash2 size={16} />} />
            </Popconfirm>
        ),
    },
];