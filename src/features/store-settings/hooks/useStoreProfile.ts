import { api } from "@/trpc/react";
import { toast } from "sonner";

export const useStoreProfile = () => {
  return api.store.getProfile.useQuery();
};

export const useUpdateStoreProfile = () => {
  const utils = api.useUtils();

  return api.store.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Pengaturan Disimpan", {
        description: "Informasi toko berhasil diperbarui.",
      });
      void utils.store.getProfile.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });
};
