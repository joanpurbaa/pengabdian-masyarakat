import { useState } from "react";
import { Table, Button, Modal, Form, InputNumber, message } from "antd";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDesaService } from "../../../../../service/adminDesaService";
import { getRWColumns } from "../columns/RWColumn";
import type { RukunWarga } from "../../../../../types/adminDesaService";

export default function RWTab() {
    const queryClient = useQueryClient();

    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const { data: rwList, isLoading } = useQuery({
        queryKey: ["list-rw"],
        queryFn: adminDesaService.getAllRW
    });

    const createMutation = useMutation({
        mutationFn: (count: number) => adminDesaService.createRW(count),
        onMutate: () => {
            setLoading(true)
            message.loading({ content: "Membuat RW..." });
        },
        onSuccess: () => {
            setLoading(false)
            message.success("Berhasil membuat RW");
            queryClient.invalidateQueries({ queryKey: ["list-rw"] });
            setIsModalOpen(false);
            form.resetFields();
        },
        onError: () => message.error("Gagal membuat RW")
    });

    const deleteMutation = useMutation({
        mutationFn: adminDesaService.deleteRW,
        onMutate: () => {
            setLoading(true)
            message.loading({ content: "Menghapus RW...", key: "deleteRW" });
        },
        onSuccess: () => {
            setLoading(false)
            message.success({ content: "RW dihapus", key: "deleteRW" });
            queryClient.invalidateQueries({ queryKey: ["list-rw"] });
        },
        onError: () => {
            message.error({ content: "Gagal menghapus RW", key: "deleteRW" });
        }
    });

    const handleCreate = (values: { count: number }) => {
        createMutation.mutate(values.count);
    };

    const columns = getRWColumns({
        onDelete: (id) => deleteMutation.mutate(id)
    });

    const dataSource = (rwList?.data || []) as unknown as RukunWarga[];

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button type="primary" icon={<Plus size={16} />} className="!bg-[#70B748]" onClick={() => setIsModalOpen(true)}>
                    Tambah RW
                </Button>
            </div>

            <Table<RukunWarga>
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={isLoading || loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Tambah RW Baru"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={createMutation.isPending}
            >
                <Form form={form} layout="vertical" onFinish={handleCreate}>
                    <Form.Item name="count" rules={[{ required: true }]}>
                        <InputNumber min={1} className="!w-full" placeholder="Contoh: 5" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}