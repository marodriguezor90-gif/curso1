"use client";

import { ListingCard } from "@/components/listings/ListingCard";
import { ListingStatus } from "@/types/listing";
import type { Listing } from "@/types/listing";

interface ListingsGridProps {
  listings: Listing[];
  likedMap: Record<string, boolean>;
  savedMap: Record<string, boolean>;
  uploadingIds: Set<string>;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onStatusChange: (id: string, status: ListingStatus) => void;
  onAddComment: (id: string, text: string) => void;
  onImageUpload: (id: string, file: File) => Promise<{ success: boolean; error?: string }>;
}

export const ListingsGrid = ({
  listings,
  likedMap,
  savedMap,
  uploadingIds,
  onToggleLike,
  onToggleSave,
  onStatusChange,
  onAddComment,
  onImageUpload,
}: ListingsGridProps) => {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No se encontraron artículos
        </p>
        <p className="text-sm text-muted-foreground">
          Intenta cambiar los filtros de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isLiked={likedMap[listing.id] ?? false}
          isSaved={savedMap[listing.id] ?? false}
          isUploading={uploadingIds.has(listing.id)}
          onToggleLike={() => onToggleLike(listing.id)}
          onToggleSave={() => onToggleSave(listing.id)}
          onStatusChange={(status: ListingStatus) => onStatusChange(listing.id, status)}
          onAddComment={(text: string) => onAddComment(listing.id, text)}
          onImageUpload={(file: File) => onImageUpload(listing.id, file)}
        />
      ))}
    </div>
  );
};
