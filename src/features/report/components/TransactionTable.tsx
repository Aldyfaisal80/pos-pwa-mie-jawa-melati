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
} from "@/components/ui/alert-dialog";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  Trash2,
  Receipt,
} from "lucide-react";
import { formatRupiah } from "@/lib/format";
import {
  formatDateTime,
  getPaymentMethodBadge,
  getPaymentMethodLabel,
} from "../utils/report.utils";
import type { RouterOutputs } from "@/trpc/react";
import { TransactionDetailModal } from "./TransactionDetailModal";
import { useTransactionMutations } from "../hooks/useTransactionMutations";
import {
  ReportSortBy,
  type ReportSortOrder,
} from "@/server/validations/transaction.validation";

export type Transaction = Exclude<
  RouterOutputs["transaction"]["getTransactionReport"],
  undefined
>["transactions"][number];

interface TransactionTableProps {
  transactions: Transaction[] | undefined;
  isLoading: boolean;
  sortColumn: ReportSortBy;
  sortOrder: ReportSortOrder;
  onSort: (column: ReportSortBy) => void;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
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

// ── Sort helpers ──────────────────────────────────────────────────────────────
const SortIcon = ({
  column,
  sortColumn,
  sortOrder,
}: {
  column: ReportSortBy;
  sortColumn: ReportSortBy;
  sortOrder: ReportSortOrder;
}) => {
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
  sortColumn,
  sortOrder,
  onSort,
  className,
  children,
}: {
  column: ReportSortBy;
  sortColumn: ReportSortBy;
  sortOrder: ReportSortOrder;
  onSort: (column: ReportSortBy) => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <TableHead
    className={`hover:bg-muted/80 cursor-pointer font-semibold transition-colors select-none ${className ?? ""}`}
    onClick={() => onSort(column)}
  >
    <div className="flex items-center">
      {children}
      <SortIcon column={column} sortColumn={sortColumn} sortOrder={sortOrder} />
    </div>
  </TableHead>
);

// ── Row ───────────────────────────────────────────────────────────────────────
const TransactionRow = ({
  trx,
  onOpenDetail,
  onDeleteRequest,
}: {
  trx: Transaction;
  onOpenDetail: (trx: Transaction) => void;
  onDeleteRequest: (id: string) => void;
}) => {
  const { date, time } = formatDateTime(trx.date);
  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
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
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground h-8 w-8"
            onClick={() => onOpenDetail(trx)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-8 w-8"
            onClick={() => onDeleteRequest(trx.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export const TransactionTable = ({
  transactions,
  isLoading,
  sortColumn,
  sortOrder,
  onSort,
}: TransactionTableProps) => {
  const [selectedTrx, setSelectedTrx] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Single shared delete dialog — not per-row
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const pendingDeleteTrx = transactions?.find((t) => t.id === pendingDeleteId);

  const { deleteTransaction } = useTransactionMutations();

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
              <SortableHead
                column={ReportSortBy.INVOICE_NUMBER}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
              >
                No. Nota
              </SortableHead>
              <SortableHead
                column={ReportSortBy.DATE}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
              >
                Waktu
              </SortableHead>
              <SortableHead
                column={ReportSortBy.PAYMENT_METHOD}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
                className="hidden md:table-cell"
              >
                Metode
              </SortableHead>
              <SortableHead
                column={ReportSortBy.TOTAL_AMOUNT}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
              >
                Total
              </SortableHead>
              <SortableHead
                column={ReportSortBy.ITEM_COUNT}
                sortColumn={sortColumn}
                sortOrder={sortOrder}
                onSort={onSort}
                className="hidden sm:table-cell"
              >
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
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
                      <Receipt className="text-muted-foreground h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-foreground font-medium">
                        Bebas Transaksi!
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Belum ada transaksi pada periode atau filter ini.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((trx) => (
                <TransactionRow
                  key={trx.id}
                  trx={trx}
                  onOpenDetail={handleOpenDetail}
                  onDeleteRequest={setPendingDeleteId}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TransactionDetailModal
        transaction={selectedTrx}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      {/* Single shared AlertDialog — renders once, not per-row */}
      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open && !deleteTransaction.isPending) setPendingDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Transaksi?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan <strong>menghapus secara permanen</strong>{" "}
              transaksi <strong>{pendingDeleteTrx?.invoiceNumber ?? ""}</strong>{" "}
              beserta semua item di dalamnya. Data tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteTransaction.isPending}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTransaction.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (!pendingDeleteId || deleteTransaction.isPending) return;
                deleteTransaction.mutate(
                  { id: pendingDeleteId },
                  { onSuccess: () => setPendingDeleteId(null) },
                );
              }}
            >
              {deleteTransaction.isPending ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
