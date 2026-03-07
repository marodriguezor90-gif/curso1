"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PLATFORM_OPTIONS,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
  PRICE_SORT_OPTIONS,
} from "@/constants/filters";
import type { ListingFilters, PriceSortOrder } from "@/types/listing";
import type { Platform } from "@/types/listing";
import type { ListingStatus } from "@/types/listing";

interface ListingsFiltersProps {
  filters: ListingFilters;
  onPlatformChange: (value: Platform | "ALL") => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: ListingStatus | "ALL") => void;
  onPriceSortChange: (value: PriceSortOrder) => void;
  resultCount: number;
}

export const ListingsFilters = ({
  filters,
  onPlatformChange,
  onCategoryChange,
  onStatusChange,
  onPriceSortChange,
  resultCount,
}: ListingsFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {PLATFORM_OPTIONS.map((option) => (
          <Badge
            key={option.value}
            variant={filters.platform === option.value ? "default" : "outline"}
            className="cursor-pointer px-4 py-1.5 text-sm transition-colors hover:bg-primary/80 hover:text-primary-foreground"
            onClick={() => onPlatformChange(option.value)}
          >
            {option.label}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={filters.category as string}
          onValueChange={(v: string | null) => { if (v) onCategoryChange(v); }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status as string}
          onValueChange={(v: string | null) => { if (v) onStatusChange(v as ListingStatus | "ALL"); }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortByPrice}
          onValueChange={(v: string | null) => { if (v) onPriceSortChange(v as PriceSortOrder); }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Ordenar precio" />
          </SelectTrigger>
          <SelectContent>
            {PRICE_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground">
          {resultCount} artículo{resultCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};
