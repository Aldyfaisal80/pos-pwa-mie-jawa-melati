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

export const ProductCatalog = ({
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
      <div className="hide-scroll bg-background flex shrink-0 gap-2 overflow-x-auto border-b p-4">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm transition-all duration-200 ${
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
      <div className="custom-scrollbar flex-1 overflow-y-auto p-4 pb-36 lg:pb-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : filtered?.map((product) => {
                const { color, Icon } = getCategoryStyle(product.category.name);
                return (
                  <Card
                    key={product.id}
                    className="group border-border/50 flex cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => onAddToCart(product)}
                  >
                    {/* Top Image Section - Edge to Edge */}
                    <div className="bg-muted relative flex aspect-4/3 w-full items-center justify-center overflow-hidden">
                      {product.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`flex h-full w-full items-center justify-center ${color}`}
                        >
                          <Icon className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                      )}

                      {/* Gradient Overlay for contrast (optional, but looks premium) */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Bottom Content Section */}
                    <CardContent className="flex flex-1 flex-col justify-between p-3 sm:p-4">
                      <h3 className="text-foreground line-clamp-2 text-sm leading-tight font-bold sm:text-base">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-primary text-sm font-bold sm:text-base">
                          {formatRupiah(Number(product.price))}
                        </p>
                        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-colors sm:h-8 sm:w-8">
                          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
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
};
