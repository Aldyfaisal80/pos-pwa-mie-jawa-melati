"use client";

import { useState } from "react";
import { PageContainer } from "@/components/layouts/PageContainer";
import { SectionContainer } from "@/components/layouts/SectionContainer";
import { Store, Printer, UserCog } from "lucide-react";
import { StoreSettingsForm } from "../components/StoreSettingsForm";
import { PrinterSettingsCard } from "../components/PrinterSettingsCard";
import { AccountProfileForm } from "../components/AccountProfileForm";
import { cn } from "@/lib/utils";

type Section = "store" | "printer" | "account";

const NAV_ITEMS = [
  { id: "store" as Section, label: "Info Toko", icon: Store },
  { id: "printer" as Section, label: "Printer", icon: Printer },
  { id: "account" as Section, label: "Akun", icon: UserCog },
];

const SECTION_CONTENT: Record<Section, React.ReactNode> = {
  store: <StoreSettingsForm />,
  printer: <PrinterSettingsCard />,
  account: <AccountProfileForm />,
};

export const StoreSettingsPage = () => {
  const [activeSection, setActiveSection] = useState<Section>("store");

  return (
    <PageContainer title="Pengaturan Toko" withHeader>
      <SectionContainer padded>
        {/* Mobile tab pills — hidden on desktop */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                activeSection === id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Unified layout: card on desktop, plain on mobile. Content rendered ONCE. */}
        <div className="md:flex md:overflow-hidden md:rounded-xl md:border md:shadow-sm">
          {/* Desktop sidebar nav — hidden on mobile */}
          <nav className="bg-muted/40 hidden w-44 shrink-0 border-r p-3 md:block">
            <p className="text-muted-foreground mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest">
              Pengaturan
            </p>
            <ul className="space-y-0.5">
              {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setActiveSection(id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      activeSection === id
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content panel — rendered once for both mobile and desktop */}
          <div className="min-w-0 flex-1 md:p-6">
            {SECTION_CONTENT[activeSection]}
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};
