import { useEffect, useState } from "react";
import {
    Button,
    Input,
    Select,
    message,
    Spin,
    Empty,
    Tag,
    Popconfirm,
    Dropdown,
    Modal,
    Pagination,
} from "antd";
import { GripVertical, Plus, Trash2, Save, Edit, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import type { CreateQuestionPayload, QuestionnaireQuestion } from "../../../../../types/adminMedisService";
import { adminMedisService } from "../../../../../service/adminMedisService";

interface QuestionManagerProps {
    questionnaireId: string;
}

interface AddQuestionFormProps {
    questionnaireId: string;
    onAdd: (payload: CreateQuestionPayload) => Promise<void>;
    disabled: boolean;
}

const AddQuestionForm = ({ questionnaireId, onAdd, disabled }: AddQuestionFormProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newQuestion, setNewQuestion] = useState<CreateQuestionPayload>({
        questionText: "",
        questionType: "radio",
        status: "draft",
        QuestionnaireId: questionnaireId,
        order: 0
    });

    useEffect(() => {
        setNewQuestion(prev => ({ ...prev, QuestionnaireId: questionnaireId }));
    }, [questionnaireId]);

    const handleSubmit = async () => {
        if (!newQuestion.questionText.trim()) {
            message.error("Teks pertanyaan wajib diisi");
            return;
        }

        setIsAdding(true);
        try {
            await onAdd(newQuestion);
            setNewQuestion(prev => ({ ...prev, questionText: "" }));
        } catch (error) {
            // Error handled in parent
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <h3 className="font-medium text-zinc-700 mb-3">Tambah Pertanyaan Baru</h3>
            <div className="flex flex-col gap-3">
                <Input
                    placeholder="Tulis pertanyaan..."
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                    disabled={disabled || isAdding}
                />
                <div className="flex gap-3">
                    <Select
                        value={newQuestion.questionType}
                        onChange={(val) => setNewQuestion(prev => ({ ...prev, questionType: val }))}
                        className="flex-1"
                        disabled={disabled || isAdding}
                        options={[
                            { value: 'radio', label: 'Radio (Ya/Tidak)' },
                            { value: 'checkbox', label: 'Checkbox' },
                            { value: 'text', label: 'Text' },
                        ]}
                    />
                    <Select
                        value={newQuestion.status}
                        onChange={(val) => setNewQuestion(prev => ({ ...prev, status: val }))}
                        className="w-32"
                        disabled={disabled || isAdding}
                        options={[
                            { value: 'draft', label: 'Draft' },
                            { value: 'publish', label: 'Publish' },
                        ]}
                    />
                    <Button
                        type="primary"
                        className="flex items-center gap-x-2 !bg-[#70B748] !hover:bg-[#5a9639]"
                        onClick={handleSubmit}
                        loading={isAdding}
                        disabled={disabled}
                    >
                        <Plus size={16} />
                        <p>
                            Tambah
                        </p>
                    </Button>
                </div>
            </div>
        </div>
    );
};

interface EditQuestionModalProps {
    open: boolean;
    question: QuestionnaireQuestion | null;
    onCancel: () => void;
    onSave: (updatedQuestion: QuestionnaireQuestion) => Promise<void>;
    loading: boolean;
}

const EditQuestionModal = ({ open, question, onCancel, onSave, loading }: EditQuestionModalProps) => {
    const [localQuestion, setLocalQuestion] = useState<QuestionnaireQuestion | null>(null);

    useEffect(() => {
        if (question) {
            setLocalQuestion({ ...question });
        }
    }, [question]);

    const handleSave = () => {
        if (localQuestion) {
            onSave(localQuestion);
        }
    };

    return (
        <Modal
            title="Edit Pertanyaan"
            open={open}
            onCancel={onCancel}
            onOk={handleSave}
            confirmLoading={loading}
            okText="Simpan"
            cancelText="Batal"
            okButtonProps={{ className: "!bg-[#70B748] !hover:bg-[#5a9639]" }}
            destroyOnClose
        >
            {localQuestion && (
                <div className="flex flex-col gap-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
                        <Input
                            value={localQuestion.questionText}
                            onChange={(e) => setLocalQuestion(prev => prev ? ({ ...prev, questionText: e.target.value }) : null)}
                            placeholder="Tulis pertanyaan..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                            <Select
                                className="w-full"
                                value={localQuestion.questionType}
                                onChange={(val) => setLocalQuestion(prev => prev ? ({ ...prev, questionType: val }) : null)}
                                options={[
                                    { value: 'radio', label: 'Radio (Ya/Tidak)' },
                                    { value: 'checkbox', label: 'Checkbox' },
                                    { value: 'text', label: 'Text' },
                                ]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <Select
                                className="w-full"
                                value={localQuestion.status}
                                onChange={(val) => setLocalQuestion(prev => prev ? ({ ...prev, status: val as "draft" | "publish" }) : null)}
                                options={[
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'publish', label: 'Publish' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default function QuestionManager({ questionnaireId }: QuestionManagerProps) {
    const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
    const [loading, setLoading] = useState(false);

    const [isOrderDirty, setIsOrderDirty] = useState(false);
    const [isSavingOrder, setIsSavingOrder] = useState(false);

    const [draggedItem, setDraggedItem] = useState<number | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuestionnaireQuestion | null>(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        if (questionnaireId) {
            fetchQuestions();
        }
    }, [questionnaireId]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const params: any = {
                QuestionnaireId: questionnaireId,
                page: 1,
                pageSize: 100, // STATIC - Todo Be: Add Total Data 
                order: '[["order", "asc"]]'
            };

            const data = await adminMedisService.getQuestionnaireQuestions(questionnaireId, params);
            setQuestions(data || []);
            setIsOrderDirty(false);
        } catch (error) {
            console.error(error);
            message.error("Gagal memuat pertanyaan");
        } finally {
            setLoading(false);
        }
    };

    const handleAddQuestion = async (payloadData: CreateQuestionPayload) => {
        if (isOrderDirty) {
            message.warning("Mohon simpan urutan pertanyaan terlebih dahulu sebelum menambah baru.");
            throw new Error("Unsaved changes");
        }

        try {
            const nextOrder = questions.length > 0
                ? Math.max(...questions.map(q => q.order || 0)) + 1
                : 1;

            const payload = { ...payloadData, order: nextOrder };
            const created = await adminMedisService.createQuestionnaireQuestion(payload);

            const newQuestions = [...questions, created];
            setQuestions(newQuestions);
            message.success("Pertanyaan ditambahkan");

            const newTotalPages = Math.ceil(newQuestions.length / pageSize);
            if (newTotalPages > currentPage) {
                setCurrentPage(newTotalPages);
            }

        } catch (error: any) {
            message.error(error.response?.data?.message || "Gagal menambah pertanyaan");
            throw error;
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await adminMedisService.deleteQuestionnaireQuestion(id);
            setQuestions(prev => prev.filter(q => q.id !== id));
            message.success("Pertanyaan dihapus");
        } catch (error) {
            message.error("Gagal menghapus pertanyaan");
        }
    };

    const handleChangeStatus = async (id: string, newStatus: "draft" | "publish") => {
        const previousQuestions = [...questions];
        const updatedQuestions = questions.map(q =>
            q.id === id ? { ...q, status: newStatus } : q
        );
        setQuestions(updatedQuestions);

        try {
            await adminMedisService.toggleQuestionStatus(
                id,
                newStatus,
                updatedQuestions
            );
            message.success(`Status diubah menjadi ${newStatus}`);
        } catch (error) {
            setQuestions(previousQuestions);
            message.error("Gagal mengubah status");
        }
    };

    const openEditModal = (question: QuestionnaireQuestion) => {
        setEditingQuestion(question);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async (updatedQuestion: QuestionnaireQuestion) => {
        if (!updatedQuestion.questionText.trim()) {
            message.error("Pertanyaan tidak boleh kosong");
            return;
        }

        setIsSavingEdit(true);
        try {
            const updatedQuestions = questions.map(q =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            );

            const payload = updatedQuestions.map((q, index) => ({
                id: q.id,
                questionText: q.questionText,
                questionType: q.questionType,
                status: q.status as "draft" | "publish",
                order: q.order ?? (index + 1)
            }));

            const res = await adminMedisService.bulkUpdateQuestions(payload);

            if (res && Array.isArray(res)) {
                const sortedList = res.sort((a, b) => (a.order || 0) - (b.order || 0));
                setQuestions(sortedList);
            } else {
                setQuestions(updatedQuestions);
            }

            setIsOrderDirty(false);

            message.success("Pertanyaan berhasil diperbarui");
            setIsEditModalOpen(false);
            setEditingQuestion(null);
        } catch (error) {
            console.error(error);
            message.error("Gagal menyimpan perubahan");
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleDragStart = (index: number) => {
        setDraggedItem(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;

        const updatedQuestions = [...questions];
        const draggedQuestion = updatedQuestions[draggedItem];
        updatedQuestions.splice(draggedItem, 1);
        updatedQuestions.splice(index, 0, draggedQuestion);

        setQuestions(updatedQuestions);
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setIsOrderDirty(true);
    };

    const handleSaveOrder = async () => {
        setIsSavingOrder(true);
        try {
            const payload = questions.map((q, index) => ({
                id: q.id,
                questionText: q.questionText,
                questionType: q.questionType,
                status: q.status as "draft" | "publish",
                order: index + 1
            }));

            const updatedList = await adminMedisService.bulkUpdateQuestions(payload);

            if (updatedList && Array.isArray(updatedList)) {
                const sortedList = updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));
                setQuestions(sortedList);
            }

            setIsOrderDirty(false);
            message.success("Urutan berhasil disimpan");
        } catch (error) {
            message.error("Gagal menyimpan urutan");
            fetchQuestions();
        } finally {
            setIsSavingOrder(false);
        }
    };

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentQuestions = questions.slice(startIndex, endIndex);

    return (
        <div className="space-y-6 pb-10">

            <AddQuestionForm
                questionnaireId={questionnaireId}
                onAdd={handleAddQuestion}
                disabled={isSavingOrder}
            />

            {loading ? (
                <div className="flex justify-center py-8"><Spin /></div>
            ) : !questions || questions.length === 0 ? (
                <Empty description="Belum ada pertanyaan" />
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500 font-medium">
                            Total: {questions.length} Pertanyaan
                        </span>
                        <span className="text-xs text-gray-400 italic">
                            Drag icon grip untuk mengubah urutan
                        </span>
                    </div>

                    <div className="space-y-2">
                        {currentQuestions.map((q, index) => {
                            const globalIndex = startIndex + index;

                            return (
                                <div
                                    key={q.id}
                                    draggable
                                    onDragStart={() => handleDragStart(globalIndex)}
                                    onDragOver={(e) => handleDragOver(e, globalIndex)}
                                    onDragEnd={handleDragEnd}
                                    className={`
                                        flex items-center gap-3 p-3 bg-white border rounded-md transition-all
                                        ${draggedItem === globalIndex ? 'border-[#70B748] bg-green-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}
                                        ${isSavingOrder ? 'opacity-50 cursor-not-allowed' : 'cursor-default'}
                                    `}
                                >
                                    <div
                                        className="cursor-move text-gray-400 hover:text-gray-600 p-1"
                                        title="Drag untuk pindah posisi"
                                    >
                                        <GripVertical size={20} />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-500 w-8">#{globalIndex + 1}</span>
                                            <span className="text-sm font-medium text-gray-800">{q.questionText}</span>
                                        </div>
                                        <div className="flex gap-2 ml-10">
                                            <Tag className="text-xs m-0">{q.questionType}</Tag>
                                            {q.status === 'publish' ? (
                                                <Tag color="success" className="text-xs m-0">Published</Tag>
                                            ) : (
                                                <Tag color="warning" className="text-xs m-0">Draft</Tag>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Dropdown
                                            trigger={['click']}
                                            menu={{
                                                items: [
                                                    {
                                                        key: 'edit',
                                                        label: 'Edit Pertanyaan',
                                                        icon: <Edit size={14} />,
                                                        onClick: () => openEditModal(q)
                                                    },
                                                    { type: 'divider' },
                                                    {
                                                        key: 'publish',
                                                        label: 'Set as Publish',
                                                        icon: <CheckCircle size={14} className="text-green-500" />,
                                                        disabled: q.status === 'publish',
                                                        onClick: () => handleChangeStatus(q.id, 'publish')
                                                    },
                                                    {
                                                        key: 'draft',
                                                        label: 'Set as Draft',
                                                        icon: <XCircle size={14} className="text-yellow-500" />,
                                                        disabled: q.status === 'draft',
                                                        onClick: () => handleChangeStatus(q.id, 'draft')
                                                    }
                                                ]
                                            }}
                                        >
                                            <Button
                                                size="small"
                                                icon={<MoreHorizontal size={16} />}
                                            />
                                        </Dropdown>

                                        <Popconfirm
                                            title="Hapus Pertanyaan"
                                            description="Yakin ingin menghapus pertanyaan ini?"
                                            onConfirm={() => handleDelete(q.id)}
                                            okText="Ya"
                                            cancelText="Batal"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button
                                                type="text"
                                                danger
                                                size="small"
                                                icon={<Trash2 size={16} />}
                                                className="flex items-center justify-center"
                                            />
                                        </Popconfirm>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={questions.length}
                            onChange={(page, size) => {
                                setCurrentPage(page);
                                setPageSize(size);
                            }}
                            showSizeChanger
                            pageSizeOptions={['10', '20', '50', '100']}
                            showTotal={(total) => `Total ${total} pertanyaan`}
                        />
                    </div>
                </div>
            )}

            {isOrderDirty && (
                <div className="sticky bottom-4 z-10 flex justify-center animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-white p-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-3 pr-4">
                        <span className="text-sm text-gray-600 ml-3">
                            Urutan telah berubah
                        </span>
                        <Button
                            type="primary"
                            className="!bg-[#70B748] !hover:bg-[#5a9639] h-9"
                            icon={<Save size={16} />}
                            loading={isSavingOrder}
                            onClick={handleSaveOrder}
                        >
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>
            )}

            <EditQuestionModal
                open={isEditModalOpen}
                question={editingQuestion}
                onCancel={() => setIsEditModalOpen(false)}
                onSave={handleSaveEdit}
                loading={isSavingEdit}
            />
        </div>
    );
}