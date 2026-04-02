"use client";

import { useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  className?: string;
  shape?: "circle" | "square" | "rectangle";
  placeholderText?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  onUploadStart,
  onUploadEnd,
  className,
  shape = "square",
  placeholderText = "Upload Gambar",
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isUploading } = useSupabaseUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUploadStart?.();
    const url = await uploadImage(file);
    if (url) {
      onChange(url);
    }
    onUploadEnd?.();

    // Reset input so the same file can be uploaded again if needed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering upload
    onChange(null);
  };

  // Shape styles mapping
  const shapeStyles = {
    circle: "w-28 h-28 sm:w-32 sm:h-32 rounded-full",
    square: "w-28 h-28 sm:w-32 sm:h-32 rounded-2xl",
    rectangle: "w-full aspect-[4/3] rounded-2xl max-w-sm",
  };

  return (
    <div className={cn("group relative", shapeStyles[shape], className)}>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        className={cn(
          "relative flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed transition-all duration-300",
          isUploading
            ? "border-muted-foreground/30 bg-muted/10 cursor-not-allowed opacity-60"
            : "border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 hover:shadow-sm",
          shapeStyles[shape],
        )}
      >
        {/* Preview Image */}
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-contain p-2"
          />
        ) : (
          /* Placeholder */
          <div className="text-muted-foreground group-hover:text-primary flex flex-col items-center justify-center p-4 text-center transition-transform group-hover:scale-105">
            <div className="bg-background/80 border-border/50 mb-2 rounded-full border p-3 shadow-sm">
              <Camera className="h-5 w-5 opacity-70 sm:h-6 sm:w-6" />
            </div>
            {shape !== "circle" && (
              <p className="text-xs leading-tight font-semibold">
                {placeholderText}
              </p>
            )}
            {shape === "circle" && (
              <p className="mt-1 text-[10px] font-semibold tracking-wider uppercase opacity-70">
                Upload
              </p>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="bg-background/80 absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-sm">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        )}

        {/* Hover Overlay for Edit */}
        {!isUploading && value && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex flex-col items-center text-white">
              <Camera className="mb-1 h-6 w-6" />
              <span className="text-xs font-medium">Ubah Foto</span>
            </div>
          </div>
        )}
      </div>

      {/* Remove Button */}
      {value && !isUploading && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="border-background absolute -top-2 -right-2 z-20 h-7 w-7 rounded-full border-2 shadow-lg transition-transform hover:scale-110"
          onClick={handleRemove}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};
