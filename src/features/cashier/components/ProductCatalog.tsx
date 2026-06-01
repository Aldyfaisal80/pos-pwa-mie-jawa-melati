import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { getCategoryStyle } from "../utils/getCategoryStyle";
import type { ProductFromServer } from "../types/cashier.types";

interface ProductCatalogProps {
  products: ProductFromServer[] | undefined;
  isLoading: boolean;
  activeCategory: string;
  categoryNames: string[];
  onCategoryChange: (cat: string) => void;
  onAddToCart: (product: ProductFromServer) => void;
}

const ProductCardSkeleton = () => (
  <Card className="border-border/50 overflow-hidden shadow-sm">
    <div className="bg-muted aspect-4/3 w-full animate-pulse" />
    <CardContent className="p-3">
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
  </Card>
);

export const ProductCatalog = memo(
  ({
    products,
    isLoading,
    activeCategory,
    categoryNames,
    onCategoryChange,
    onAddToCart,
  }: ProductCatalogProps) => {
    const filtered =
      activeCategory === "Semua"
        ? products
        : products?.filter((p) => p.category.name === activeCategory);

    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Filter Kategori */}
        <div className="hide-scroll bg-background/95 sticky top-0 z-10 flex shrink-0 gap-3 overflow-x-auto border-b p-4 backdrop-blur-md">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold whitespace-nowrap shadow-sm transition-all duration-200 sm:px-6 sm:py-2.5 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid Produk */}
        <div className="custom-scrollbar flex-1 overflow-y-auto p-4 pb-36 lg:pb-6">
          <div className="animate-stagger grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : filtered?.map((product) => {
                  const { color, Icon } = getCategoryStyle(
                    product.category.name,
                  );
                  return (
                    <Card
                      key={product.id}
                      className="group ring-border/50 hover:ring-primary/50 flex cursor-pointer flex-col overflow-hidden rounded-2xl border-transparent shadow-sm ring-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                      onClick={() => onAddToCart(product)}
                    >
                      {/* Top Image Section - Edge to Edge */}
                      <div className="bg-muted relative flex aspect-square w-full items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className={`flex h-full w-full items-center justify-center transition-colors duration-300 ${color} group-hover:brightness-95`}
                          >
                            <Icon className="h-12 w-12 opacity-80 transition-transform duration-300 group-hover:scale-110" />
                          </div>
                        )}

                        {/* Gradient Overlay for contrast */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      {/* Bottom Content Section */}
                      <CardContent className="flex flex-1 flex-col justify-between p-4">
                        <h3 className="text-foreground line-clamp-2 text-sm leading-tight font-bold sm:text-base">
                          {product.name}
                        </h3>
                        <div className="mt-3 flex items-end justify-between">
                          <p className="text-primary text-sm font-extrabold sm:text-base">
                            {formatRupiah(Number(product.price))}
                          </p>
                          <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition-all duration-300 sm:h-11 sm:w-11">
                            <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
        </div>
      </div>
    );
  },
);
