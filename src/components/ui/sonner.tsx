"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      visibleToasts={4}
      closeButton
      expand={false}
      duration={4000}
      gap={8}
      offset={20}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: [
            "group/toast",
            "!rounded-xl !border !shadow-lg",
            "!bg-popover !text-popover-foreground !border-border",
            "dark:!shadow-black/40",
          ].join(" "),
          title: "!font-semibold !text-sm",
          description: "!text-muted-foreground !text-xs",
          icon: "!mt-0.5",
          closeButton: [
            "!border-border/60 !bg-popover !text-muted-foreground",
            "hover:!bg-accent hover:!text-accent-foreground",
          ].join(" "),
          // Type-specific left border accent
          success: "!border-l-[3px] !border-l-emerald-500",
          error: "!border-l-[3px] !border-l-destructive",
          warning: "!border-l-[3px] !border-l-amber-500",
          info: "!border-l-[3px] !border-l-blue-500",
          loading: "!border-l-[3px] !border-l-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
