import { useState } from "react";
import { Table, Button, Modal, Form, InputNumber, Select, message, Card } from "antd";
import { Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDesaService } from "../../../../../service/adminDesaService";
import { getRTColumns } from "../columns/RTColumn";
import type { RukunTetangga } from "../../../../../types/adminDesaService";

export default function RTTab() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRW, setSelectedRW] = useState<string | null>(null);
    const [form] = Form.useForm();

    const { data: rwList } = useQuery({
        queryKey: ["list-rw"],
        queryFn: adminDesaService.getAllRW
    });

    const { data: rtData, isLoading, isFetching } = useQuery({
        queryKey: ["list-rt", selectedRW],
        queryFn: () => selectedRW ? adminDesaService.getRT(selectedRW) : null,
        enabled: !!selectedRW
    });

    const createMutation = useMutation({
        mutationFn: (vals: { count: number, rwId: string }) => adminDesaService.createRT(vals.count, vals.rwId),
        onSuccess: () => {
            message.success("Berhasil membuat RT");
            queryClient.invalidateQueries({ queryKey: ["list-rt", selectedRW] });
            queryClient.invalidateQueries({ queryKey: ["list-rw"] });
            setIsModalOpen(false);
            form.resetFields();
        },
        onError: () => message.error("Gagal membuat RT")
    });

    const deleteMutation = useMutation({
        mutationFn: adminDesaService.deleteRT,
        onMutate: () => {
            message.loading({ content: "Menghapus RT...", key: "deleteRT" });
        },
        onSuccess: () => {
            message.success({ content: "RT dihapus", key: "deleteRT" });
            queryClient.invalidateQueries({ queryKey: ["list-rt", selectedRW] });
        },
        onError: () => {
            message.error({ content: "Gagal menghapus RT", key: "deleteRT" });
        }
    });

    const columns = getRTColumns({
        onDelete: (id) => deleteMutation.mutate(id)
    });

    const dataSource = (rtData?.data?.rukunTetangga || []) as unknown as RukunTetangga[];
    const tableLoading = isLoading || isFetching || deleteMutation.isPending;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 w-full max-w-md">
                    <Select
                        className="flex-1"
                        placeholder="Pilih RW untuk melihat RT"
                        onChange={setSelectedRW}
                        value={selectedRW}
                        options={rwList?.data?.map((rw: any) => ({ label: `RW ${rw.name}`, value: rw.id }))}
                        loading={!rwList}
                    />
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    className="!bg-[#70B748] !hover:bg-[#5a9639]"
                    onClick={() => setIsModalOpen(true)}
                    disabled={!selectedRW}
                >
                    Tambah RT
                </Button>
            </div>

            <Table<RukunTetangga>
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                loading={tableLoading}
                pagination={{ pageSize: 10 }}
                locale={{
                    emptyText: selectedRW ? "Belum ada data RT di RW ini" : "Silakan pilih RW terlebih dahulu di atas"
                }}
            />

            <Modal
                title="Tambah RT Baru"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={createMutation.isPending}
                okText="Simpan"
                cancelText="Batal"
                okButtonProps={{ className: "!bg-[#70B748] !hover:bg-[#5a9639]" }}
            >
                <Form form={form} layout="vertical" onFinish={(vals) => createMutation.mutate({ ...vals, rwId: selectedRW! })}>
                    <p className="mb-4 text-gray-500 text-sm">
                        Menambahkan RT ke dalam <b>RW {rwList?.data?.find((r: any) => r.id === selectedRW)?.name}</b>
                    </p>
                    <Form.Item
                        label="Nomor RT (Angka)"
                        name="count"
                        rules={[{ required: true, message: "Wajib diisi" }]}
                    >
                        <InputNumber min={1} className="!w-full" placeholder="Contoh: 3" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}