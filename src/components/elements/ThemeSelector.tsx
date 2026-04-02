"use client";

import * as React from "react";
import { Sun, Moon, Monitor, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useAppTheme,
  type AppMode,
} from "@/hooks/useAppTheme";

const MODES: { id: AppMode; icon: React.ReactNode; label: string }[] = [
  { id: "light", icon: <Sun className="h-4 w-4" />, label: "Terang" },
  { id: "dark", icon: <Moon className="h-4 w-4" />, label: "Gelap" },
  { id: "system", icon: <Monitor className="h-4 w-4" />, label: "Sistem" },
];

export const ThemeSelector = () => {
  const { colorTheme, mode, setColorTheme, setMode, themes } =
    useAppTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full"
          aria-label="Pilih tema"
        >
          {/* Dynamic icon based on mode */}
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          {/* Color dot indicator */}
          <span
            className="absolute right-0.5 bottom-0.5 h-2 w-2 rounded-full border border-white shadow-sm ring-1 ring-current"
            style={{
              backgroundColor: themes.find((t) => t.id === colorTheme)
                ?.preview[0],
            }}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-0">
        {/* Header */}
        <div className="bg-muted/50 flex items-center gap-2 border-b px-4 py-3">
          <Palette className="text-primary h-4 w-4" />
          <span className="text-sm font-semibold">Pilih Tema</span>
        </div>

        <div className="space-y-4 p-3">
          {/* Mode selector */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wide uppercase">
              Mode tampilan
            </p>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all",
                    mode === m.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color themes */}
          <div>
            <p className="text-muted-foreground mb-2 text-xs font-bold tracking-wide uppercase">
              Warna tema
            </p>
            <div className="space-y-1.5">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setColorTheme(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
                    colorTheme === t.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/40 hover:bg-muted/50",
                  )}
                >
                  {/* Swatch */}
                  <div className="flex shrink-0 gap-0.5 overflow-hidden rounded shadow-sm">
                    {t.preview.map((color, i) => (
                      <span
                        key={i}
                        className="h-5 w-3"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Label */}
                  <div className="flex flex-1 flex-col">
                    <span className="flex items-center gap-1.5 text-sm leading-none font-semibold">
                      {t.emoji} {t.label}
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-xs">
                      {t.description}
                    </span>
                  </div>

                  {/* Active check */}
                  {colorTheme === t.id && (
                    <Check className="text-primary h-4 w-4 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
