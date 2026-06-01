"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Save, Store } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useStoreProfile,
  useUpdateStoreProfile,
} from "../hooks/useStoreProfile";
import {
  StoreSettingsFormInner,
  STORE_SETTINGS_FORM_ID,
} from "./StoreSettingsFormInner";
import { storeSettingsSchema } from "../schemas";
import { type StoreSettingsFormValues } from "../types";

export const StoreSettingsForm = () => {
  const { data: profile, isLoading, isSuccess } = useStoreProfile();
  const updateProfile = useUpdateStoreProfile();

  const form = useForm<StoreSettingsFormValues>({
    resolver: zodResolver(storeSettingsSchema),
    mode: "all",
    defaultValues: { name: "", address: "", phone: "", logoUrl: "" },
  });

  useEffect(() => {
    if (isSuccess && profile) {
      form.reset({
        name: profile.name ?? "",
        address: profile.address ?? "",
        phone: profile.phone ?? "",
        logoUrl: "logoUrl" in profile ? String(profile.logoUrl ?? "") : "",
      });
    }
  }, [isSuccess]);

  const onSubmit = (data: StoreSettingsFormValues) => {
    updateProfile.mutate({
      name: data.name.trim(),
      address: data.address?.trim() ?? undefined,
      phone: data.phone?.trim() ?? undefined,
      logoUrl: data.logoUrl?.trim() ?? undefined,
    });
  };

  if (isLoading || !isSuccess) {
    return (
      <Card>
        <CardContent className="space-y-8">
          <div className="border-border/40 flex flex-col items-center gap-6 border-b pb-8 sm:flex-row sm:items-start sm:gap-10">
            <div className="space-y-2 sm:w-1/3">
              <Skeleton className="mx-auto h-4 w-24 sm:mx-0" />
              <Skeleton className="mx-auto h-16 w-full max-w-70 sm:mx-0" />
            </div>
            <Skeleton className="h-28 w-28 rounded-full sm:h-32 sm:w-32" />
          </div>
          <div className="space-y-5 pt-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Store className="text-primary h-4 w-4" />
          Info Toko
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <StoreSettingsFormInner onSubmit={onSubmit} />
        </Form>

        <Button
          type="submit"
          form={STORE_SETTINGS_FORM_ID}
          disabled={updateProfile.isPending}
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <Save className="h-4 w-4" />
          {updateProfile.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </CardContent>
    </Card>
  );
};
