import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { adminDesaService } from "../service/adminDesaService";

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => adminDesaService.updateProfilePicture(file),
    onSuccess: () => {
      message.success("Foto profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["admin-desa", "me"] });
    },
    onError: (error: any) => {
      console.error(error);
      message.error(error.response?.data?.message || "Gagal mengupload foto");
    },
  });
};
