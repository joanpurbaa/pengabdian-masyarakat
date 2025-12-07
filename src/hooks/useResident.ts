import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { residentService, type UpdateProfilePayload } from "../service/residentService";
import { message } from "antd";

export const useResident = () => {
  return useQuery({
    queryKey: ["resident", "me"],
    queryFn: residentService.getResidentProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => residentService.updateProfile(payload),
    onSuccess: () => {
      message.success("Profil berhasil diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["resident", "me"] });
    },
    onError: (error: any) => {
      console.error(error);
      message.error(error.response?.data?.message || "Gagal memperbarui profil");
    },
  });
};