"use client";

import { Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PaymentMethod,
  type PaymentMethod as ServerPaymentMethod,
} from "@/server/validations";
import { parseLocalDate } from "../utils/reportUtils";

interface ReportFilterBarProps {
  search: string;
  limit: number;
  paymentMethod: ServerPaymentMethod | "ALL";
  onSearchChange: (v: string) => void;
  onLimitChange: (v: number) => void;
  onPaymentMethodChange: (v: ServerPaymentMethod | "ALL") => void;
  onStartDateChange: (v: Date | undefined) => void;
  onEndDateChange: (v: Date | undefined) => void;
}

export const ReportFilterBar = ({
  search,
  limit,
  paymentMethod,
  onSearchChange,
  onLimitChange,
  onPaymentMethodChange,
  onStartDateChange,
  onEndDateChange,
}: ReportFilterBarProps) => (
  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
    {/* Cari invoice */}
    <div className="relative min-w-50 flex-1">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        className="pl-9"
        placeholder="Cari no. nota..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>

    {/* Items per page */}
    <div className="relative min-w-25">
      <Select
        value={limit.toString()}
        onValueChange={(val) => onLimitChange(Number(val))}
      >
        <SelectTrigger className="w-full sm:w-30">
          <SelectValue placeholder="Baris" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10 baris</SelectItem>
          <SelectItem value="25">25 baris</SelectItem>
          <SelectItem value="50">50 baris</SelectItem>
          <SelectItem value="100">100 baris</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Metode pembayaran */}
    <div className="relative min-w-35">
      <Select
        value={paymentMethod}
        onValueChange={(val) =>
          onPaymentMethodChange(val as ServerPaymentMethod | "ALL")
        }
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Metode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Semua Metode</SelectItem>
          <SelectItem value={PaymentMethod.CASH}>Tunai</SelectItem>
          <SelectItem value={PaymentMethod.QRIS}>QRIS</SelectItem>
          <SelectItem value={PaymentMethod.TRANSFER}>Transfer</SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Tanggal mulai */}
    <div className="relative">
      <Calendar className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="date"
        className="w-full pl-9 sm:w-40"
        onChange={(e) => {
          if (!e.target.value) {
            onStartDateChange(undefined);
            return;
          }
          onStartDateChange(parseLocalDate(e.target.value));
        }}
      />
    </div>

    {/* Tanggal akhir */}
    <div className="relative">
      <Calendar className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="date"
        className="w-full pl-9 sm:w-40"
        onChange={(e) => {
          if (!e.target.value) {
            onEndDateChange(undefined);
            return;
          }
          onEndDateChange(parseLocalDate(e.target.value, true));
        }}
      />
    </div>
  </div>
);
