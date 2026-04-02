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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PrinterSettingsCard } from "../components/PrinterSettingsCard";

export const StoreSettingsPage = () => (
  <PageContainer title="Pengaturan Toko" withHeader>
    <SectionContainer padded>
      <div className="mx-auto max-w-2xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-muted/80 mb-6 grid w-full grid-cols-2 rounded-full">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground h-full rounded-full text-sm font-medium transition-all data-[state=active]:shadow-sm"
            >
              Profil Toko
            </TabsTrigger>
            <TabsTrigger
              value="printer"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground h-full rounded-full text-sm font-medium transition-all data-[state=active]:shadow-sm"
            >
              Perangkat Printer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Store className="h-5 w-5 text-amber-600" />
                  Informasi Toko
                </CardTitle>
                <CardDescription>
                  Perbarui identitas toko kamu. Data ini akan tercetak pada
                  struk kasir.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <StoreSettingsForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="printer" className="mt-0">
            <PrinterSettingsCard />
          </TabsContent>
        </Tabs>
      </div>
    </SectionContainer>
  </PageContainer>
);
