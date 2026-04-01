"use client";

import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Store } from "lucide-react";
import { StoreSettingsForm } from "../components/StoreSettingsForm";

export const StoreSettingsPage = () => (
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

          <CardContent className="p-6 sm:p-8">
            <StoreSettingsForm />
          </CardContent>
        </Card>
      </div>
    </SectionContainer>
  </PageContainer>
);
