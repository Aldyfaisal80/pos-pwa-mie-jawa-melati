"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, MapPin, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import {
  useStoreProfile,
  useUpdateStoreProfile,
} from "../hooks/useStoreProfile";
import { ImageUpload } from "@/components/ui/image-upload";
import { Image as ImageIcon } from "lucide-react";

export const StoreSettingsPage = () => {
  const { data: profile, isLoading } = useStoreProfile();
  const updateProfile = useUpdateStoreProfile();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    logoUrl: "",
  });

  // Sync form ke data server saat pertama kali load
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        address: profile.address ?? "",
        phone: profile.phone ?? "",
        logoUrl: (profile as any).logoUrl ?? "",
      });
    }
  }, [profile]);

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Nama toko wajib diisi.");
      return;
    }
    updateProfile.mutate({
      name: form.name.trim(),
      address: form.address.trim() || undefined,
      phone: form.phone.trim() || undefined,
      logoUrl: form.logoUrl.trim() || undefined,
    });
  };

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement> | string | null) => {
      // Handle both input events and direct string values (from ImageUpload)
      const value =
        typeof e === "object" && e !== null && "target" in e
          ? e.target.value
          : e || "";
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <PageContainer title="Pengaturan Toko" withHeader>
      <SectionContainer padded>
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Store className="h-5 w-5 text-amber-600" />
                Informasi Toko
              </CardTitle>
              <CardDescription>
                Perbarui identitas toko kamu. Data ini akan tercetak pada struk
                kasir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6 sm:p-8">
              {/* Logo Toko */}
              <div className="border-border/40 flex flex-col items-center gap-6 border-b pb-8 sm:flex-row sm:items-start sm:gap-10">
                <div className="mt-1 space-y-2 text-center sm:w-1/3 sm:text-left">
                  <Label className="text-foreground inline-flex items-center gap-2 text-base font-bold">
                    <span className="bg-primary/10 text-primary rounded-md p-1.5">
                      <ImageIcon className="h-4 w-4" />
                    </span>
                    Logo Toko
                  </Label>
                  <p className="text-muted-foreground mx-auto w-full max-w-70 text-sm leading-relaxed sm:mx-0">
                    Format persegi (1:1) sangat direkomendasikan. Maksimal 5MB.
                    Logo ini akan dicetak jelas pada struk pelanggan.
                  </p>
                </div>
                <div className="flex justify-center sm:w-2/3 sm:justify-start">
                  {isLoading ? (
                    <Skeleton className="h-28 w-28 rounded-full shadow-sm sm:h-32 sm:w-32" />
                  ) : (
                    <ImageUpload
                      value={form.logoUrl}
                      onChange={set("logoUrl")}
                      shape="circle"
                      placeholderText="Upload Logo"
                      className="ring-background shadow-sm ring-4 transition-shadow hover:shadow-md"
                    />
                  )}
                </div>
              </div>

              {/* Data Toko */}
              <div className="space-y-5 pt-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="storeName"
                    className="flex items-center gap-2"
                  >
                    <Store className="text-muted-foreground h-4 w-4" />
                    Nama Toko
                  </Label>
                  {isLoading ? (
                    <Skeleton className="h-9 w-full rounded-md" />
                  ) : (
                    <Input
                      id="storeName"
                      placeholder="Masukkan nama toko"
                      value={form.name}
                      onChange={set("name")}
                    />
                  )}
                </div>

                {/* Alamat */}
                <div className="space-y-2">
                  <Label
                    htmlFor="storeAddress"
                    className="flex items-center gap-2"
                  >
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    Alamat Lengkap
                  </Label>
                  {isLoading ? (
                    <Skeleton className="h-9 w-full rounded-md" />
                  ) : (
                    <Input
                      id="storeAddress"
                      placeholder="Masukkan alamat toko"
                      value={form.address}
                      onChange={set("address")}
                    />
                  )}
                </div>

                {/* Telepon */}
                <div className="space-y-2">
                  <Label
                    htmlFor="storePhone"
                    className="flex items-center gap-2"
                  >
                    <Phone className="text-muted-foreground h-4 w-4" />
                    Nomor Telepon
                  </Label>
                  {isLoading ? (
                    <Skeleton className="h-9 w-full rounded-md" />
                  ) : (
                    <Input
                      id="storePhone"
                      placeholder="Masukkan nomor telepon"
                      value={form.phone}
                      onChange={set("phone")}
                    />
                  )}
                </div>

                <Button
                  onClick={handleSave}
                  disabled={updateProfile.isPending || isLoading}
                  className="flex w-full items-center gap-2 sm:w-auto"
                >
                  <Save className="h-4 w-4" />
                  {updateProfile.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};
