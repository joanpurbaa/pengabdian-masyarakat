import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Table,
  Modal,
  Form,
  Select,
  message,
  InputNumber,
} from "antd";
import { Plus, Search, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { getKuisionerColumns } from "./columns/KuisionerColumn";
import type {
  CreateQuestionnairePayload,
  Questionnaire,
} from "../../../../types/adminMedisService";
import { adminMedisService } from "../../../../service/adminMedisService";
import QuestionManager from "./Partials/QuestionManager";
import { useNavigate } from "react-router";

export default function Kuisioner() {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [selectedQuestionnaire, setSelectedQuestionnaire] =
    useState<Questionnaire | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["questionnaires", pagination.current, debouncedSearch],
    queryFn: () =>
      adminMedisService.getAllQuestionnaires({
        page: pagination.current,
        pageSize: pagination.pageSize,
        title: debouncedSearch,
      }),
  });

  const openCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ status: "draft", riskThreshold: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: Questionnaire) => {
    setIsEditMode(true);
    setEditingId(record.id);
    form.setFieldsValue({
      title: record.title,
      description: record.description,
      riskThreshold: record.riskThreshold,
      status: record.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (values: any) => {
    setModalLoading(true);
    try {
      if (isEditMode && editingId) {
        await adminMedisService.updateQuestionnaire(editingId, {
          title: values.title,
          description: values.description,
          status: values.status,
          riskThreshold: Number(values.riskThreshold),
        });
        message.success("Kuisioner berhasil diperbarui!");
      } else {
        const payload: CreateQuestionnairePayload = {
          title: values.title,
          description: values.description,
          riskThreshold: Number(values.riskThreshold),
          status: values.status as "draft" | "publish",
        };
        await adminMedisService.createQuestionnaire(payload);
        message.success("Kuisioner berhasil dibuat!");
      }

      setIsModalOpen(false);
      form.resetFields();
      refetch();
    } catch (error: any) {
      const action = isEditMode ? "memperbarui" : "membuat";
      message.error(
        error.response?.data?.message || `Gagal ${action} kuisioner`
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "publish" ? "draft" : "publish";
    try {
      const currentData = (data?.data || []).find((q) => q.id === id);
      if (!currentData) return;

      await adminMedisService.updateQuestionnaire(id, {
        title: currentData.title,
        description: currentData.description,
        status: newStatus as "draft" | "publish",
        riskThreshold: currentData.riskThreshold as number,
      });

      message.success(`Status berhasil diubah ke ${newStatus}`);
      refetch();
    } catch (error) {
      message.error("Gagal mengubah status");
    }
  };

  const handleDeleteQuestionnaire = async (id: string) => {
    try {
      await adminMedisService.deleteQuestionnaire(id);

      message.success(`Kuisioner berhasil dihapus`);
      refetch();
    } catch (error) {
      message.error("Kuisioner gagal dihapus");
    }
  };

  const handleManage = (record: Questionnaire) => {
    setSelectedQuestionnaire(record);
  };

  if (selectedQuestionnaire) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <Button
              icon={<ArrowLeft size={18} />}
              onClick={() => setSelectedQuestionnaire(null)}
            >
              Kembali
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 m-0">
                {selectedQuestionnaire.title}
              </h1>
              <p className="text-gray-500 text-sm m-0">Kelola Pertanyaan</p>
            </div>
          </div>

          <QuestionManager questionnaireId={selectedQuestionnaire.id} />
        </div>
      </div>
    );
  }

  const columns = getKuisionerColumns({
    pagination,
    onManageQuestions: handleManage,
    onEditStatus: handleToggleStatus,
    onEditData: handleOpenEdit,
    onDelete: handleDeleteQuestionnaire,
    onPreview: (id) => navigate(`/admin-medis/kuisioner/questionnaireId=${id}/preview`),
  });

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 m-0">
            Daftar Kuisioner
          </h1>
          <p className="text-gray-500 m-0">
            Kelola data kuisioner kesehatan mental
          </p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={18} />}
          className="!bg-[#70B748] !hover:bg-[#5a9639]"
          onClick={openCreateModal}
        >
          Buat Kuisioner
        </Button>
      </div>

      <Card className="shadow-sm border-gray-200">
        <div className="mb-4">
          <Input
            prefix={<Search className="text-gray-400" size={18} />}
            placeholder="Cari judul kuisioner..."
            className="max-w-md"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </div>

        <Table<Questionnaire>
          columns={columns}
          dataSource={(data?.data || []) as Questionnaire[]}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.data?.length || 0,
            onChange: (page, pageSize) =>
              setPagination({ current: page, pageSize }),
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} Kuisioner`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={isEditMode ? "Edit Kuisioner" : "Buat Kuisioner Baru"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Judul Kuisioner"
            name="title"
            rules={[{ required: true, message: "Judul wajib diisi" }]}
          >
            <Input placeholder="Masukkan judul..." />
          </Form.Item>

          <Form.Item label="Deskripsi" name="description">
            <Input.TextArea rows={3} placeholder="Deskripsi singkat..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Risk Threshold" name="riskThreshold">
              <InputNumber min={0} className="w-full" disabled={isEditMode} />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="draft">Draft</Select.Option>
                <Select.Option value="publish">Publish</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={modalLoading}
              className="!bg-[#70B748] hover:bg-[#5a9639]"
            >
              {isEditMode ? "Simpan Perubahan" : "Buat"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
