"use client";

import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { GreetingBanner } from "../components/GreetingBanner";
import { MiniStats } from "../components/MiniStats";
import { QuickActionGrid } from "../components/QuickActionGrid";

export const HomePage = () => (
  <PageContainer title="Beranda — Mie Jawa Melati POS" withHeader>
    <SectionContainer padded>
      <div className="flex flex-col gap-4 sm:gap-5">
        <GreetingBanner />
        <MiniStats />
        <QuickActionGrid />
      </div>
    </SectionContainer>
  </PageContainer>
);
