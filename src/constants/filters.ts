import type { PriceSortOrder } from "@/types/listing";
import { ListingStatus, Platform } from "@/types/listing";

export const PLATFORM_OPTIONS = [
  { value: "ALL" as const, label: "Todos" },
  { value: Platform.GOTRENDIER, label: "GoTrendier" },
  { value: Platform.GLOSET, label: "Gloset" },
  { value: Platform.PORTELO, label: "Portèlo" },
];

export const STATUS_OPTIONS = [
  { value: "ALL" as const, label: "Todos" },
  { value: ListingStatus.AVAILABLE, label: "Disponible" },
  { value: ListingStatus.RESERVED, label: "Reservado" },
  { value: ListingStatus.SOLD, label: "Vendido" },
];

export const CATEGORY_OPTIONS = [
  { value: "ALL", label: "Todas" },
  { value: "Vestidos", label: "Vestidos" },
  { value: "Zapatos", label: "Zapatos" },
  { value: "Bolsas", label: "Bolsas" },
  { value: "Tops", label: "Tops" },
  { value: "Pantalones", label: "Pantalones" },
  { value: "Accesorios", label: "Accesorios" },
  { value: "Ropa deportiva", label: "Ropa deportiva" },
  { value: "Trajes de baño", label: "Trajes de baño" },
  { value: "Chamarras", label: "Chamarras" },
];

export const PRICE_SORT_OPTIONS: { value: PriceSortOrder; label: string }[] = [
  { value: "NONE", label: "Sin ordenar" },
  { value: "ASC", label: "Menor precio" },
  { value: "DESC", label: "Mayor precio" },
];

export const PLATFORM_COLORS: Record<Platform, string> = {
  [Platform.GOTRENDIER]: "bg-pink-100 text-pink-700 border-pink-200",
  [Platform.GLOSET]: "bg-violet-100 text-violet-700 border-violet-200",
  [Platform.PORTELO]: "bg-amber-100 text-amber-700 border-amber-200",
};

export const STATUS_COLORS: Record<ListingStatus, string> = {
  [ListingStatus.AVAILABLE]: "bg-green-100 text-green-700",
  [ListingStatus.RESERVED]: "bg-yellow-100 text-yellow-700",
  [ListingStatus.SOLD]: "bg-red-100 text-red-700",
};

export const STATUS_LABELS: Record<ListingStatus, string> = {
  [ListingStatus.AVAILABLE]: "Disponible",
  [ListingStatus.RESERVED]: "Reservado",
  [ListingStatus.SOLD]: "Vendido",
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  [Platform.GOTRENDIER]: "GoTrendier",
  [Platform.GLOSET]: "Gloset",
  [Platform.PORTELO]: "Portèlo",
};
