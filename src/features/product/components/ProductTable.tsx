import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, PackageOpen } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { getCategoryIcon } from "../utils/getCategoryIcon";
import type { Product } from "../types/product.types";

interface ProductTableProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const TableSkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-5 w-40" />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Skeleton className="h-5 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-20" />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Skeleton className="h-5 w-16" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="ml-auto h-8 w-16" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export const ProductTable = ({
  products,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) => {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Nama Produk</TableHead>
            <TableHead className="hidden md:table-cell">Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton />
          ) : !products?.length ? (
            <TableRow>
              <TableCell colSpan={5} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                    <PackageOpen className="text-muted-foreground h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground font-medium">
                      Belum ada data produk
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Klik &quot;Tambah Produk&quot; untuk memulai.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    {getCategoryIcon(product.category.name)}
                    {product.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">
                  {product.category.name}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatRupiah(Number(product.price))}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge
                    variant={product.isAvailable ? "default" : "destructive"}
                    className={
                      product.isAvailable
                        ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                        : ""
                    }
                  >
                    {product.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                    >
                      <Edit className="h-4 w-4 text-amber-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
