import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Control } from "react-hook-form";
import type { ProductFormValues } from "../schemas";

interface ProductImageFieldProps {
  control: Control<ProductFormValues>;
}

export const ProductImageField = ({ control }: ProductImageFieldProps) => (
  <FormField
    control={control}
    name="image"
    render={({ field }) => (
      <div className="relative mt-2 mb-6 flex flex-col items-center justify-center">
        <ImageUpload
          value={field.value ? String(field.value) : ""}
          onChange={(url) => field.onChange(url ?? "")}
          shape="square"
          className="ring-background shadow-sm ring-4 transition-shadow hover:shadow-md"
          placeholderText="Upload Foto"
        />
        <p className="text-muted-foreground mt-3 px-4 text-center text-xs">
          Format 1:1 direkomendasikan. Foto akan tampil di katalog.
        </p>
      </div>
    )}
  />
);

export { FormField, FormItem, FormLabel, FormControl, FormMessage };
