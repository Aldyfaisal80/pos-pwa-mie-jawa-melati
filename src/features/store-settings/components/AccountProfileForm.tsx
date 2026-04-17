"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UserCog, KeyRound, Save, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import {
  useAccountProfile,
  useUpdateDisplayName,
  useChangePassword,
} from "../hooks/useAccountProfile";
import {
  displayNameSchema,
  changePasswordSchema,
  type DisplayNameFormValues,
  type ChangePasswordFormValues,
} from "../schemas/account";

export const AccountProfileForm = () => {
  const { user, loading } = useAccountProfile();
  const updateDisplayName = useUpdateDisplayName();
  const changePassword = useChangePassword();

  // Display name form
  const nameForm = useForm<DisplayNameFormValues>({
    resolver: zodResolver(displayNameSchema),
    mode: "onBlur",
    defaultValues: { displayName: "" },
  });

  // Password form
  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    mode: "onBlur",
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      nameForm.reset({
        displayName:
          (user.user_metadata?.display_name as string) ??
          user.email?.split("@")[0] ??
          "",
      });
    }
  }, [user]);

  const onDisplayNameSubmit = async (data: DisplayNameFormValues) => {
    await updateDisplayName.mutate(data.displayName.trim());
  };

  const onPasswordSubmit = async (data: ChangePasswordFormValues) => {
    const success = await changePassword.mutate(data.currentPassword, data.newPassword);
    if (success) {
      passwordForm.reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
    // On failure: form values are preserved, user doesn't have to retype
  };

  if (loading) {
    return (
      <div className="space-y-5 p-1">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-1">
      {/* Desktop: 2-column grid | Mobile: single column */}
      <div className="grid gap-0 md:grid-cols-2 md:gap-8">

          {/* LEFT COLUMN: Email + Display Name */}
          <div className="space-y-5 border-b pb-6 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            {/* Email (read-only) */}
            <div className="border-border/40 space-y-2 border-b pb-5">
              <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <Mail className="h-4 w-4" />
                </span>
                Email Akun
              </div>
              <Input
                id="accountEmail"
                value={user?.email ?? ""}
                disabled
                className="bg-muted/50 text-muted-foreground cursor-not-allowed"
              />
              <p className="text-muted-foreground text-xs">
                Email tidak dapat diubah melalui aplikasi.
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-3">
              <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <span className="bg-primary/10 text-primary rounded-md p-1.5">
                  <UserCog className="h-4 w-4" />
                </span>
                Nama Tampilan
              </div>
              <Form {...nameForm}>
                <form
                  id="display-name-form"
                  onSubmit={nameForm.handleSubmit(onDisplayNameSubmit)}
                  noValidate
                  className="space-y-6"
                >
                  <FormField
                    control={nameForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Nama Tampilan</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="displayName"
                            placeholder="Masukkan nama tampilan"
                            maxLength={50}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    form="display-name-form"
                    disabled={updateDisplayName.isPending || !nameForm.formState.isDirty}
                    size="sm"
                    className="flex w-full items-center gap-2 sm:w-auto"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {updateDisplayName.isPending ? "Menyimpan..." : "Simpan Nama"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* RIGHT COLUMN: Change Password */}
          <div className="space-y-3 pt-6 md:pl-8 md:pt-0">
            <div className="text-foreground flex items-center gap-2 text-sm font-semibold">
              <span className="bg-primary/10 text-primary rounded-md p-1.5">
                <KeyRound className="h-4 w-4" />
              </span>
              Ganti Password
            </div>
            <Form {...passwordForm}>
              <form
                id="change-password-form"
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                noValidate
                className="space-y-3"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Saat Ini</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            id="currentPassword"
                            type={showCurrent ? "text" : "password"}
                            placeholder="Masukkan password saat ini"
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                          >
                            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            id="newPassword"
                            type={showNew ? "text" : "password"}
                            placeholder="Minimal 8 karakter"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowNew(!showNew)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                          >
                            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Konfirmasi Password Baru</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            id="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Ketik ulang password baru"
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                          >
                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  form="change-password-form"
                  disabled={changePassword.isPending}
                  size="sm"
                  variant="outline"
                  className="flex w-full items-center gap-2 sm:w-auto"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {changePassword.isPending ? "Mengubah..." : "Ubah Password"}
                </Button>
              </form>
            </Form>
          </div>

        </div>
    </div>
  );
};
