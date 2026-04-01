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

const COLUMN_WIDTHS = {
  kategori: "hidden w-36 md:table-cell",
  harga: "w-28",
  status: "hidden w-32 md:table-cell",
  aksi: "w-[88px]",
} as const;

const TableSkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-5 w-40" />
        </TableCell>
        <TableCell className={COLUMN_WIDTHS.kategori}>
          <Skeleton className="h-5 w-24" />
        </TableCell>
        <TableCell className={COLUMN_WIDTHS.harga}>
          <Skeleton className="h-5 w-20" />
        </TableCell>
        <TableCell className={COLUMN_WIDTHS.status}>
          <Skeleton className="h-5 w-16" />
        </TableCell>
        <TableCell className={COLUMN_WIDTHS.aksi}>
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
      {/* table-fixed: column widths set by <th>, not content → no layout shift */}
      <Table className="table-fixed">
        <TableHeader className="bg-muted/50">
          <TableRow>
            {/* No width = takes all remaining space after fixed columns */}
            <TableHead>Nama Produk</TableHead>
            <TableHead className={COLUMN_WIDTHS.kategori}>Kategori</TableHead>
            <TableHead className={COLUMN_WIDTHS.harga}>Harga</TableHead>
            <TableHead className={COLUMN_WIDTHS.status}>Status</TableHead>
            <TableHead className={`${COLUMN_WIDTHS.aksi} text-right`}>
              Aksi
            </TableHead>
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
                  {/* min-w-0 allows flex children to truncate properly */}
                  <div className="flex min-w-0 items-center gap-2 font-medium">
                    <span className="shrink-0">
                      {getCategoryIcon(product.category.name)}
                    </span>
                    <span className="truncate">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell
                  className={`text-muted-foreground ${COLUMN_WIDTHS.kategori}`}
                >
                  <span className="truncate">{product.category.name}</span>
                </TableCell>
                <TableCell className={`font-semibold ${COLUMN_WIDTHS.harga}`}>
                  {formatRupiah(Number(product.price))}
                </TableCell>
                <TableCell className={COLUMN_WIDTHS.status}>
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
                <TableCell className={`text-right ${COLUMN_WIDTHS.aksi}`}>
                  <div className="flex justify-end gap-1">
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
