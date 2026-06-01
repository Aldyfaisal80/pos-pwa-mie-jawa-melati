"use client";

import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Store, MapPin, Phone } from "lucide-react";
import { type StoreSettingsFormValues } from "../types";

export const STORE_SETTINGS_FORM_ID = "store-settings-form";

type StoreSettingsFormInnerProps = {
  onSubmit: (values: StoreSettingsFormValues) => void;
};

export const StoreSettingsFormInner = ({
  onSubmit,
}: StoreSettingsFormInnerProps) => {
  const form = useFormContext<StoreSettingsFormValues>();

  return (
    <form
      id={STORE_SETTINGS_FORM_ID}
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="space-y-6"
    >
      {/* Logo Toko */}
      <div className="border-border/40 flex flex-col items-center gap-6 border-b pb-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="mt-1 space-y-2 text-center sm:w-1/3 sm:text-left">
          <div className="text-foreground inline-flex items-center gap-2 text-base font-bold">
            <span className="bg-primary/10 text-primary rounded-md p-1.5">
              <Store className="h-4 w-4" />
            </span>
            <span>Logo Toko</span>
          </div>
          <p className="text-muted-foreground mx-auto w-full max-w-70 text-sm leading-relaxed sm:mx-0">
            Format persegi (1:1) sangat direkomendasikan. Maksimal 5MB. Logo ini
            akan dicetak jelas pada struk pelanggan.
          </p>
        </div>

        <div className="flex justify-center sm:w-2/3 sm:justify-start">
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center sm:items-start">
                <FormControl>
                  <ImageUpload
                    value={field.value ?? ""}
                    onChange={(url) => field.onChange(url ?? "")}
                    shape="circle"
                    placeholderText="Upload Logo"
                    className="ring-background shadow-sm ring-4 transition-shadow hover:shadow-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Data Toko */}
      <div className="space-y-5 pt-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Store className="text-muted-foreground h-4 w-4" />
                Nama Toko
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="storeName"
                  placeholder="Masukkan nama toko"
                  maxLength={100}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <MapPin className="text-muted-foreground h-4 w-4" />
                Alamat Lengkap
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Masukkan alamat toko"
                  maxLength={255}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-4 w-4" />
                Nomor Telepon
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  placeholder="Masukkan nomor telepon"
                  maxLength={20}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </form>
  );
};
