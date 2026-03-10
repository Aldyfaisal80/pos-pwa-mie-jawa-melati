"use client";

import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import {
  formatDateTime,
  getPaymentMethodBadge,
  getPaymentMethodLabel,
} from "../utils/report.utils";
import type { RouterOutputs } from "@/trpc/react";
import { TransactionDetailModal } from "./TransactionDetailModal";
import { useTransactionMutations } from "../hooks/useTransactionMutations";

type Transaction = NonNullable<
  RouterOutputs["transaction"]["getTransactionReport"]
>[number];

interface TransactionTableProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
}

type SortColumn =
  | "invoiceNumber"
  | "date"
  | "paymentMethod"
  | "totalAmount"
  | "itemCount";
type SortOrder = "asc" | "desc";

const TableSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-28" />
        </TableCell>
        <TableCell>
          <Skeleton className="mb-1 h-4 w-16" />
          <Skeleton className="h-3 w-10" />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <Skeleton className="h-5 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-20" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="ml-auto h-5 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-6 w-16" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

export const TransactionTable = ({
  transactions,
  isLoading,
}: TransactionTableProps) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { deleteTransaction } = useTransactionMutations();

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column)
      return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-50" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-1.5 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1.5 h-3.5 w-3.5" />
    );
  };

  const SortableHead = ({
    column,
    className,
    children,
  }: {
    column: SortColumn;
    className?: string;
    children: React.ReactNode;
  }) => (
    <TableHead
      className={`hover:bg-muted/80 cursor-pointer font-semibold transition-colors select-none ${className ?? ""}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center">
        {children}
        <SortIcon column={column} />
      </div>
    </TableHead>
  );

  const sortedTransactions = [...(transactions ?? [])].sort((a, b) => {
    let cmp = 0;
    switch (sortColumn) {
      case "invoiceNumber":
        cmp = a.invoiceNumber.localeCompare(b.invoiceNumber);
        break;
      case "date":
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case "paymentMethod":
        cmp = a.paymentMethod.localeCompare(b.paymentMethod);
        break;
      case "totalAmount":
        cmp = Number(a.totalAmount) - Number(b.totalAmount);
        break;
      case "itemCount":
        cmp = a.items.length - b.items.length;
        break;
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const handleOpenDetail = (trx: Transaction) => {
    setSelectedTrx(trx);
    setIsDetailOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <SortableHead column="invoiceNumber">No. Nota</SortableHead>
              <SortableHead column="date">Waktu</SortableHead>
              <SortableHead
                column="paymentMethod"
                className="hidden md:table-cell"
              >
                Metode
              </SortableHead>
              <SortableHead column="totalAmount">Total</SortableHead>
              <SortableHead column="itemCount" className="hidden sm:table-cell">
                Items
              </SortableHead>
              <TableHead className="text-right font-semibold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : !transactions?.length ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-10 text-center"
                >
                  Tidak ada transaksi pada periode ini.
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((trx) => {
                const { date, time } = formatDateTime(trx.date);
                return (
                  <TableRow
                    key={trx.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-foreground font-mono text-xs font-medium md:text-sm">
                      {trx.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="text-foreground font-medium">{date}</div>
                      <div>{time}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-medium md:text-xs ${getPaymentMethodBadge(trx.paymentMethod)}`}
                      >
                        {getPaymentMethodLabel(trx.paymentMethod)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-foreground text-xs font-bold md:text-sm">
                      {formatRupiah(Number(trx.totalAmount))}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden text-xs sm:table-cell">
                      {trx.items.length} item
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {/* Tombol Detail */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-8 w-8"
                          onClick={() => handleOpenDetail(trx)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Tombol Hapus dengan Konfirmasi */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Hapus Transaksi?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini akan{" "}
                                <strong>menghapus secara permanen</strong>{" "}
                                transaksi <strong>{trx.invoiceNumber}</strong>{" "}
                                beserta semua item di dalamnya. Data tidak bisa
                                dikembalikan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() =>
                                  deleteTransaction.mutate({ id: trx.id })
                                }
                              >
                                Ya, Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTrx}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  );
};
