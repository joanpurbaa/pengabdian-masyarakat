import { Button, Space, Tag, Tooltip } from "antd";
import { Edit, Settings, Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { Questionnaire } from "../../../../../types/adminMedisService";

interface KuisionerColumnProps {
    pagination: { current: number; pageSize: number };
    onManageQuestions: (record: Questionnaire) => void;
    onEditStatus: (id: string, currentStatus: string) => void;
    onDelete: (id: string) => void;
}

export const getKuisionerColumns = ({
    pagination,
    onManageQuestions,
    onEditStatus,
    onDelete
}: KuisionerColumnProps): ColumnsType<Questionnaire> => [
    {
        title: "No",
        key: "index",
        width: 70,
        align: "center",
        render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
        title: "Judul Kuisioner",
        dataIndex: "title",
        key: "title",
        width: 250,
        render: (text) => <span className="font-medium text-gray-700">{text}</span>,
    },
    {
        title: "Deskripsi",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
        width: 300,
    },
    {
        title: "Threshold",
        dataIndex: "riskThreshold",
        key: "riskThreshold",
        align: "center",
        width: 100,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 120,
        render: (status: string) => {
            let color = "default";
            if (status === "publish" || status === "published") color = "success";
            if (status === "draft") color = "warning";
            if (status === "archived") color = "error";
            
            return <Tag color={color}>{status.toUpperCase()}</Tag>;
        },
    },
    {
        title: "Dibuat",
        dataIndex: "createdAt",
        key: "createdAt",
        width: 150,
        render: (date) => new Date(date).toLocaleDateString("id-ID", {
            day: 'numeric', month: 'short', year: 'numeric'
        }),
    },
    {
        title: "Aksi",
        key: "action",
        align: "center",
        fixed: "right",
        width: 180,
        render: (_, record) => (
            <Space>
                <Tooltip title="Kelola Pertanyaan">
                    <Button 
                        type="primary"
                        className="!bg-[#70B748] !hover:bg-[#5a9639]"
                        size="small" 
                        icon={<Settings size={16} />} 
                        onClick={() => onManageQuestions(record)} 
                    />
                </Tooltip>
                
                <Tooltip title="Ubah Status (Draft/Publish)">
                    <Button 
                        size="small" 
                        icon={<Edit size={16} />} 
                        onClick={() => onEditStatus(record.id, record.status)} 
                    />
                </Tooltip>

                {/* <Tooltip title="Hapus">
                    <Button 
                        danger
                        size="small" 
                        icon={<Trash2 size={16} />} 
                        onClick={() => onDelete(record.id)} 
                    />
                </Tooltip> */}
            </Space>
        ),
    },
];