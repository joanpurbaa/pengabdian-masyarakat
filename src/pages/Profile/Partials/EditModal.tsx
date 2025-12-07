import { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Alert } from "antd";
import { Info } from "lucide-react"; // Import icon Info
import type { ResidentProfile } from "../../../service/residentService";
import { useUpdateProfile } from "../../../hooks/useResident";
import { getErrorMessage } from "../../../utils/getErrorMessage";

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
    initialData: ResidentProfile;
}

export default function EditProfileModal({ open, onClose, initialData }: EditProfileModalProps) {
    const [form] = Form.useForm();
    const updateMutation = useUpdateProfile();

    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue({
                email: initialData.email,
                phoneNumber: initialData.userDetail.phoneNumber,
            });
        }
    }, [open, initialData, form]);

    const handleSubmit = async (values: any) => {
        const payload = {
            email: values.email,
            phoneNumber: values.phoneNumber,
            fullname: initialData.fullname,
            gender: initialData.gender,
            birthDate: initialData.birthDate,
            profession: initialData.userDetail.profession,
            MarriageStatusId: initialData.userDetail.marriageStatus.id,
            RukunWargaId: initialData.userDetail.rukunWarga.id,
            RukunTetanggaId: initialData.userDetail.rukunTetangga.id,
            EducationId: initialData.userDetail.education.id,
            SalaryRangeId: initialData.userDetail.salaryRange.id,
            ...(values.newPassword ? {
                password: values.newPassword,
                confirmNewPassword: values.confirmNewPassword
            } : {}),
        };

        updateMutation.mutate(payload, {
            onSuccess: () => {
                onClose();
                form.resetFields(["newPassword", "confirmNewPassword"]);
            },
            onError: (err) => {
                const msg = getErrorMessage(err);
                setErrorMsg(msg);
            }
        });
    };

    return (
        <Modal
            title="Edit Profil"
            open={open}
            onCancel={onClose}
            footer={null}
            centered
        >
            <Alert
                message="Informasi Perubahan Data"
                description="Hanya Email, Nomor Telepon, dan Password yang dapat diubah secara mandiri. Untuk perubahan data kependudukan lainnya (Pekerjaan, Pendidikan, Status), silakan hubungi Admin Desa."
                type="info"
                showIcon
                icon={<Info size={20} />}
                className="mb-6 bg-blue-50 border-blue-200 text-blue-800"
            />

            <br />

            {errorMsg && (
                <Alert
                    message="Gagal Menyimpan"
                    description={errorMsg}
                    type="error"
                    showIcon
                />
            )}

            <br />

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={updateMutation.isPending}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Email wajib diisi" },
                        { type: "email", message: "Format email tidak valid" }
                    ]}
                >
                    <Input placeholder="Contoh: nama@email.com" />
                </Form.Item>

                <Form.Item
                    label="Nomor Telepon"
                    name="phoneNumber"
                    rules={[{ required: true, message: "Nomor telepon wajib diisi" }]}
                >
                    <Input placeholder="Contoh: 08123456789" />
                </Form.Item>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200 mt-4">
                    <p className="text-xs text-gray-500 font-bold mb-3 uppercase">Ubah Password (Opsional)</p>
                    <Form.Item
                        label="Password Baru"
                        name="newPassword"
                        rules={[{ min: 6, message: "Minimal 6 karakter" }]}
                    >
                        <Input.Password placeholder="Kosongkan jika tidak ingin mengubah" />
                    </Form.Item>

                    <Form.Item
                        label="Konfirmasi Password Baru"
                        name="confirmNewPassword"
                        dependencies={['newPassword']}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    if (!getFieldValue('newPassword') && !value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Password konfirmasi tidak cocok!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Ulangi password baru" />
                    </Form.Item>
                </div>

                <div className="flex justify-end gap-2">
                    <Button onClick={onClose} disabled={updateMutation.isPending}>
                        Batal
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={updateMutation.isPending}
                        className="bg-[#70B748] hover:bg-[#5a9639]"
                    >
                        Simpan Perubahan
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}