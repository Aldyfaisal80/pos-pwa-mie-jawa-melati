"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReportPaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export const ReportPagination = ({
  currentPage,
  totalPages,
  isLoading,
  isFetching,
  onPageChange,
}: ReportPaginationProps) => {
  if (totalPages <= 1) return null;

  const disabled = isLoading || isFetching;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="mx-1 flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const isNearCurrent =
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
          const isEllipsis =
            pageNum === currentPage - 2 || pageNum === currentPage + 2;

          if (isNearCurrent) {
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="icon"
                className="h-8 w-8 text-xs"
                onClick={() => onPageChange(pageNum)}
                disabled={disabled}
              >
                {pageNum}
              </Button>
            );
          }
          if (isEllipsis) {
            return (
              <span
                key={pageNum}
                className="text-muted-foreground px-1 text-xs"
              >
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
