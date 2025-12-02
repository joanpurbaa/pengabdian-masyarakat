import { Button, Dropdown, Modal, Tag, type MenuProps } from "antd";
import { CheckCircle, Edit, Eye, MoreHorizontal, Settings, Trash2, XCircle } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import type { Questionnaire } from "../../../../../types/adminMedisService";

interface KuisionerColumnProps {
  pagination: { current: number; pageSize: number };
  onManageQuestions: (record: Questionnaire) => void;
  onEditStatus: (id: string, currentStatus: string) => void;
  onEditData: (record: Questionnaire) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
}

export const getKuisionerColumns = ({
  pagination,
  onManageQuestions,
  onEditStatus,
  onEditData,
  onDelete,
  onPreview
}: KuisionerColumnProps): ColumnsType<Questionnaire> => [
  {
    title: "No",
    key: "index",
    width: 70,
    align: "center",
    render: (_, __, index) =>
      (pagination.current - 1) * pagination.pageSize + index + 1,
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
    render: (date) =>
      new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
    title: "Diubah",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: 150,
    render: (date) =>
      new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
  },
  {
        title: "Aksi",
        key: "action",
        align: "center",
        fixed: "right",
        width: 80,
        render: (_, record) => {
            const items: MenuProps['items'] = [
                {
                    key: 'manage',
                    label: 'Kelola Pertanyaan',
                    icon: <Settings size={16} />,
                    onClick: () => onManageQuestions(record)
                },
                {
                    key: 'preview',
                    label: 'Preview Tampilan',
                    icon: <Eye size={16} />,
                    onClick: () => onPreview(record.id)
                },
                {
                    key: 'edit',
                    label: 'Edit Kuisioner',
                    icon: <Edit size={16} />,
                    onClick: () => onEditData(record)
                },
                {
                    type: 'divider'
                },
                {
                    key: 'status',
                    label: record.status === 'publish' ? 'Ubah ke Draft' : 'Ubah ke Publish',
                    icon: record.status === 'publish' ? <XCircle size={16} className="text-orange-500"/> : <CheckCircle size={16} className="text-green-500"/>,
                    onClick: () => onEditStatus(record.id, record.status)
                },
                {
                    key: 'delete',
                    label: 'Hapus',
                    icon: <Trash2 size={16} />,
                    danger: true,
                    onClick: () => {
                        Modal.confirm({
                            title: "Hapus Kuisioner",
                            content: `Yakin ingin menghapus "${record.title}"?`,
                            okText: "Ya, Hapus",
                            cancelText: "Batal",
                            okButtonProps: { danger: true },
                            onOk: () => onDelete(record.id)
                        });
                    }
                }
            ];

            return (
                <Dropdown menu={{ items }} trigger={['click']}>
                    <Button icon={<MoreHorizontal size={18} />} />
                </Dropdown>
            );
        },
    },
];
