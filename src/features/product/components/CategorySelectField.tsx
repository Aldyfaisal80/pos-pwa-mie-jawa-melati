"use client";

import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CategoryFormModal } from "./CategoryFormModal";
import type { Control } from "react-hook-form";
import type { ProductFormValues } from "../schemas";
import type { Category } from "../types/product.types";

interface CategorySelectFieldProps {
  control: Control<ProductFormValues>;
  categories: Category[];
  onCategoryCreated: (id: number) => void;
}

export const CategorySelectField = ({
  control,
  categories,
  onCategoryCreated,
}: CategorySelectFieldProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <FormField
        control={control}
        name="categoryId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Kategori</FormLabel>
            <div className="flex gap-2">
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="icon"
                title="Tambah Kategori Baru"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <CategoryFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreated={onCategoryCreated}
      />
    </>
  );
};
